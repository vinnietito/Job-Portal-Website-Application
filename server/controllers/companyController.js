import Company from "../models/Company.js";
import bcrypt from "bcrypt"
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generatetoken.js";

// Register a new company
export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body
    
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {

        const companyExists = await Company.findOne({ email })

        if (companyExists) {
            return res.json({ success: false, message: "Company already registered" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

} 


// Company login
export const loginCompany = async (req, res) => {

    const { email, password } = req.body

    try {

        const company = await Company.findOne({ email })

        if (bcrypt.compare(password, company.password)) {

            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                },
                token: generateToken(company._id)
            })
            
        } 
        else {
            res.json({ success: false, message: "Invalid email or password" })
        }
        
    } catch (error) {
        res.json({ success: false, message: error.message })
        
    }

}

// Get comapany data
export const getCompanyData = async (req, res) => {

}

// Post a new job
export const postJob = async (req, res) => {

    const { title, description, location, salary } = req.body

    const companyId = req.company._id

    console.log(companyId, {title, description, location, salary});

}

// Get Company job Applicants
export const getCompanyJobApplicants = async (req, res) => {

}

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

}

// Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {

}

// Change job visibibility
export const changeVisibility = async (req, res) => {
}
