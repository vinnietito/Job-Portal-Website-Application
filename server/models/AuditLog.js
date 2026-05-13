import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // 'RESUME_DECRYPTED' or 'APPLICATION_SUBMITTED'
  recruiterId: { type: String }, // Recruiter ID (for resume decryption events)
  applicantId: { type: String, required: true }, // User ID of the applicant
  resumeId: { type: String }, // GridFS file ID (for resume decryption events)
  jobId: { type: mongoose.Schema.Types.ObjectId }, // Job ID (for application submission events)
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }, // Browser/client info
  status: { type: String, default: 'SUCCESS' } // SUCCESS or FAILED
});

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

export default AuditLog;
