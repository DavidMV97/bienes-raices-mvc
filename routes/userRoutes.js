import express from "express"
import { loginForm, registerForm, forgotPasswordForm, register, confirm } from "../controllers/userController.js"

const router = express.Router()

router.get('/login', loginForm)
router.get('/register', registerForm)
router.get('/forgot-password', forgotPasswordForm)
router.get('/confirm/:token', confirm)
router.post('/register', register)
    

export default router

