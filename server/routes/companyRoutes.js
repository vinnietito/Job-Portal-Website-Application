import express from 'express'
import { changeJobApplicationStatus, changeVisibility, getAdminOverview, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany, getAuditLogs, verifyRecruiter, requestVerification, getPendingRequests, adminLogin } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany, protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company Login
router.post('/login', loginCompany)

// Admin Login
router.post('/admin/login', adminLogin)

// Verify a recruiter account
router.post('/verify-recruiter/:companyId', protectAdmin, verifyRecruiter)

// Recruiter requests verification
router.post('/request-verification', protectCompany, requestVerification)

// Admin: list pending verification requests
router.get('/pending-requests', protectAdmin, getPendingRequests)

// Admin: overview dashboard
router.get('/admin/overview', protectAdmin, getAdminOverview)

// Get Company Data
router.get('/company', protectCompany, getCompanyData)

// Post a job
router.post('/post-job', protectCompany, postJob)

// Get Applicants Data of Company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

// Get Company Job List
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// Change Applications Status
router.post('/change-status', protectCompany, changeJobApplicationStatus)

// Change Applications Visibility
router.post('/change-visibility', protectCompany, changeVisibility)

// Get Audit Logs - Resume Decryption and Application Events
router.get('/audit-logs', protectCompany, getAuditLogs)

export default router