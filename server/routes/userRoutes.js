import upload from '../middleware/multer.js'
import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'


const router = express.Router()

// Get user data
router.get('/user', getUserData)

// Apply for a Job
router.post('/apply', applyForJob)

// Get applied Job data
router.get('/applications', getUserJobApplications)

// Update user profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router