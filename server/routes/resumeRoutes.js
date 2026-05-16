import express from 'express';
import { getGridFSBucket } from '../config/gridfs.js';
import { decryptBuffer } from '../utils/aes256.js';
import User from '../models/User.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET /resume/:userId
// Only authenticated recruiters (companies) can access
router.get('/resume/:userId', protectCompany, async (req, res) => {
  if (!req.company?.verified) {
    return res.status(403).json({ success: false, message: 'Recruiter is not verified to download resumes. Contact the admin for account verification.' });
  }
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(404).json({ success: false, message: 'Resume not found for this user.' });
    }
    const bucket = getGridFSBucket();
    const fileId = user.resume;
    const downloadStream = bucket.openDownloadStream(
      typeof fileId === 'string' ? new (await import('mongodb')).ObjectId(fileId) : fileId
    );
    const chunks = [];
    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', () => res.status(500).json({ success: false, message: 'Error reading resume from storage.' }));
    downloadStream.on('end', () => {
      try {
        const encryptedBuffer = Buffer.concat(chunks);
        const decrypted = decryptBuffer(encryptedBuffer);
        res.setHeader('Content-Type', 'application/pdf'); // or use user.resume mimetype if stored
        res.setHeader('Content-Disposition', `attachment; filename="resume_${userId}.pdf"`);
        res.send(decrypted);
      } catch (err) {
        res.status(500).json({ success: false, message: 'Decryption failed.' });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
