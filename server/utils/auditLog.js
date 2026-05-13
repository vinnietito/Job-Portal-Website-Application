import AuditLog from '../models/AuditLog.js';

// Function to get client IP address from request
export const getClientIpAddress = (req) => {
  // Check for IP in various headers (proxy support)
  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    req.ip ||
    'Unknown';

  // If multiple IPs in x-forwarded-for, take the first one
  return typeof ip === 'string' ? ip.split(',')[0].trim() : ip;
};

// Function to log resume decryption event
export const logResmeDecryption = async (recruiterId, applicantId, resumeId, req, status = 'SUCCESS') => {
  try {
    const ipAddress = getClientIpAddress(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await AuditLog.create({
      eventType: 'RESUME_DECRYPTED',
      recruiterId,
      applicantId,
      resumeId,
      ipAddress,
      userAgent,
      status
    });

    console.log(`Audit Log: Resume decrypted by recruiter ${recruiterId} for applicant ${applicantId}`);
  } catch (error) {
    console.error('Error logging resume decryption:', error.message);
  }
};

// Function to log application submission event
export const logApplicationSubmission = async (applicantId, jobId, req, status = 'SUCCESS') => {
  try {
    const ipAddress = getClientIpAddress(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await AuditLog.create({
      eventType: 'APPLICATION_SUBMITTED',
      applicantId,
      jobId,
      ipAddress,
      userAgent,
      status
    });

    console.log(`Audit Log: Application submitted by user ${applicantId} for job ${jobId}`);
  } catch (error) {
    console.error('Error logging application submission:', error.message);
  }
};

// Function to retrieve audit logs with filters
export const getAuditLogs = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.recruiterId) query.recruiterId = filters.recruiterId;
    if (filters.applicantId) query.applicantId = filters.applicantId;
    if (filters.jobId) query.jobId = filters.jobId;
    
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .lean();

    return logs;
  } catch (error) {
    console.error('Error retrieving audit logs:', error.message);
    return [];
  }
};
