import jwt from "jsonwebtoken"
import Company from "../models/Company.js"

export const protectCompany = async (req, res, next) => {

    const token = req.headers.token

    if (!token) {
        return res.json({ success: false, message: "Not authorized, Login Again" })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.company = await Company.findById(decoded.id).select("-password")

        next()
        
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const protectAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    const token = req.headers['admin-token'] || req.headers['x-admin-token'] || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null)

    if (!token) {
        return res.status(401).json({ success: false, message: "Admin authorization required." })
    }

    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: "Invalid admin token." })
    }

    next()
}