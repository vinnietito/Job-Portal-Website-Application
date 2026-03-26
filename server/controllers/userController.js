import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import { clerkClient } from "@clerk/express";

// Get user Data
export const getUserData = async(req, res) => {
    const userId = req.auth?.userId;
    
    // Debug: Check what's in req.auth
    console.log('=== AUTH DEBUG ===');
    console.log('req.auth:', JSON.stringify(req.auth));
    console.log('userId:', userId);
    console.log('==================');
    
    // Check if user is authenticated
    if (!userId) {
        return res.json({ success: false, message: "User not authenticated" });
    }
    
    try {
        let user = await User.findById(userId);
        
        // If user doesn't exist by Clerk ID, try to find by email
        if (!user) {
            try {
                // Get user info from Clerk
                const clerkUser = await clerkClient.users.getUser(userId);
                const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
                
                // Check if a user with this email already exists
                user = await User.findOne({ email: clerkEmail });
                
                if (user) {
                    // User exists with same email - use this account
                    console.log('User found by email, using existing account:', user._id);
                } else {
                    // Create new user with Clerk ID
                    const userData = {
                        _id: clerkUser.id,
                        email: clerkEmail || `${clerkUser.id}@clerk.user`,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                        image: clerkUser.imageUrl || '',
                        resume: ''
                    };
                    
                    user = await User.create(userData);
                    console.log('User created on-the-fly:', user._id);
                }
            } catch (createError) {
                console.log('Error creating user from Clerk:', createError.message);
                return res.json({ success: false, message: "User not found and could not be created" });
            }
        }
        
        res.json({ success: true, user })
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

// Apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.auth.userId
    
    // Check if user is authenticated
    if (!userId) {
        return res.json({ success: false, message: "User not authenticated" });
    }
    
    try {
        // Check if user exists in our database
        let user = await User.findById(userId);
        let userIdToUse = userId;
        
        // If not found by Clerk ID, try to find by email
        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
                
                // Check if a user with this email already exists
                user = await User.findOne({ email: clerkEmail });
                
                if (user) {
                    // Use the existing user's _id for the application
                    userIdToUse = user._id;
                    console.log('Application: User found by email, using user ID:', userIdToUse);
                } else {
                    // Create new user if not found by email either
                    const userData = {
                        _id: clerkUser.id,
                        email: clerkEmail || `${clerkUser.id}@clerk.user`,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                        image: clerkUser.imageUrl || '',
                        resume: ''
                    };
                    user = await User.create(userData);
                    console.log('Application: User created:', user._id);
                }
            } catch (err) {
                console.log('Error in user lookup:', err.message);
            }
        }
        
        const isAlreadyApplied = await JobApplication.find({jobId, userId: userIdToUse})
        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: "You have already applied for this job" })
        }
        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({ success: false, message: "Job not found" })
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId: userIdToUse,
            jobId,
            date: Date.now()
        })
        res.json({ success: true, message: "Applied for job successfully" })
    } catch (error) {
        res.json({success:false, message: error.message})        
    }
}

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
    let userId = req.auth.userId;
    
    // Check if user is authenticated
    if (!userId) {
        return res.json({ success: false, message: "User not authenticated" });
    }
    
    try {
        let user = await User.findById(userId);
        
        // If user not found by Clerk ID, try to find by email
        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
                user = await User.findOne({ email: clerkEmail });
                
                if (user) {
                    userId = user._id;  // Use the existing user's ID
                }
            } catch (err) {
                console.log('Error finding user:', err.message);
            }
        }
        
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category salary')
            .exec()
        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user!!' })
        }
        return res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update user profile (resume)
export const updateUserResume = async (req, res) => {
    const userId = req.auth.userId
    
    // Check if user is authenticated
    if (!userId) {
        return res.json({ success: false, message: "User not authenticated" });
    }
    
    try {
        const resumeFile = req.file
        let userData = await User.findById(userId)
        
        // If user not found, try to find by email or create
        if (!userData) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
                userData = await User.findOne({ email: clerkEmail });
                
                if (!userData) {
                    const userDataNew = {
                        _id: clerkUser.id,
                        email: clerkEmail || `${clerkUser.id}@clerk.user`,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                        image: clerkUser.imageUrl || '',
                        resume: ''
                    };
                    userData = await User.create(userDataNew);
                }
            } catch (err) {
                return res.json({ success: false, message: "User not found" });
            }
        }
        
        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()
        res.json({ success: true, message: 'Resume updated successfully'})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}