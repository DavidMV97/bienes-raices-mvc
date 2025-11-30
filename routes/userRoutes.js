import express from "express"
import { loginForm, registerForm, forgotPasswordForm, register, confirm, resetPassword, checkToken, newPassword, authenticateUser } from "../controllers/userController.js"

const router = express.Router()

router.get('/login', loginForm)
router.post('/login', authenticateUser)

router.get('/register', registerForm)

router.get('/forgot-password', forgotPasswordForm)
router.post('/forgot-password', resetPassword)

router.get('/confirm/:token', confirm)

router.post('/register', register)

// save new password
router.get('/forgot-password/:token', checkToken)
router.post('/forgot-password/:token', newPassword)
    

export default router

