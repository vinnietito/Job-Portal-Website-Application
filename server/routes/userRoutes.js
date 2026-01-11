import express from 'express'
import { getUserData } from '../controllers/userController.js'


const router = express.Router()

// Get user data
router.get('/user', getUserData)