import express from 'express';
import { ObjectId } from 'mongodb';
import { getGridFSBucket } from '../config/gridfs.js';
import { decryptBuffer } from '../utils/aes256.js';
import { logResmeDecryption } from '../utils/auditLog.js';
import User from '../models/User.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET /resume/:userId
// Only authenticated recruiters (companies) can access
router.get('/resume/:userId', protectCompany, async (req, res) => {
  try {
    const { userId } = req.params;
    const recruiterId = req.company._id; // Get recruiter ID from auth middleware
    
    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(404).json({ success: false, message: 'Resume not found for this user.' });
    }

    const bucket = getGridFSBucket();
    const fileId = typeof user.resume === 'string' ? new ObjectId(user.resume) : user.resume;

    const fileDocs = await bucket.find({ _id: fileId }).toArray();
    if (!fileDocs?.length) {
      return res.status(404).json({ success: false, message: 'Resume file metadata not found.' });
    }

    const fileDoc = fileDocs[0];
    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks = [];
    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', () => {
      logResmeDecryption(recruiterId, userId, fileId.toString(), req, 'FAILED');
      res.status(500).json({ success: false, message: 'Error reading resume from storage.' });
    });
    
    downloadStream.on('end', () => {
      try {
        const encryptedBuffer = Buffer.concat(chunks);
        const decrypted = decryptBuffer(encryptedBuffer);
        
        // Log the decryption event
        logResmeDecryption(recruiterId, userId, fileId.toString(), req, 'SUCCESS');
        
        res.setHeader('Content-Type', fileDoc.contentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.filename || `resume_${userId}`}"`);
        res.send(decrypted);
      } catch (err) {
        logResmeDecryption(recruiterId, userId, fileId.toString(), req, 'FAILED');
        res.status(500).json({ success: false, message: 'Decryption failed.' });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
