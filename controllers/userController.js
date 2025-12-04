import { check, validationResult } from 'express-validator'
import User from "../models/UserModel.js"
import { generateId, generateJWT } from '../helpers/tokens.js'
import { registerEmail, emailForgotPassword } from '../helpers/emails.js'
import bcrypt from 'bcrypt'

const loginForm = ((req, res) => {
    res.render('auth/login', {
        page: 'Login',
        csrfToken: req.csrfToken()
    })
})

const authenticateUser = async (req, res) => {
    await check('email').isEmail().withMessage('The email field is required').run(req)
    await check('password').notEmpty().withMessage('The password field is required').run(req)


    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/login', {
            page: 'Login',
            errors: result.array(),
            csrfToken: req.csrfToken()
        })
    }

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User not found' }]
        })
    }

    // check confirmed user
    if (!user.confirm) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Your account has not been confirmed' }]
        })
    }

    // check password
    if (!user.checkPassword(password)) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Invalid password' }]
        })
    }

    const token = generateJWT(user.id)
    console.log(token);
    
    //save token
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true,
        //sameSite: true
    }).redirect('/mis-propiedades')

}

const registerForm = ((req, res) => {
    res.render('auth/register', {
        page: 'Create account',
        csrfToken: req.csrfToken()
    })
})

// create user
const register = async (req, res) => {
    //validation
    await check('name').notEmpty().withMessage('The name field is required').run(req)
    await check('email').isEmail().withMessage('The email field is required').run(req)
    await check('password').isLength({ min: 6 }).withMessage('The password field must be at least 6 characters long.').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Passwords do not match').run(req)

    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Create account',
            errors: result.array(),
            csrfToken: req.csrfToken(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }

    // prevent duplicates
    const userExist = await User.findOne({ where: { email: req.body.email } })

    if (userExist) {
        return res.render('auth/register', {
            page: 'Create account',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'The User is already registered' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        token: generateId()
    })


    // send confiramtion email 
    registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })

    // confirmation message    
    res.render('templates/message', {
        page: 'Successfully Created Account',
        message: 'We have sent a Confirmation Email, click on the link'
    })
}

// confirm account
const confirm = async (req, res) => {
    const { token } = req.params

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirm-account', {
            page: 'Error confirming your account',
            message: 'There was an error confirming your account, please try again.',
            error: true
        })
    }

    user.token = null;
    user.confrim = true;
    await user.save();

    return res.render('auth/confirm-account', {
        page: 'Account confirmed',
        message: 'Your account has been successfully confirmed',
        error: false
    })
}

const forgotPasswordForm = ((req, res) => {
    res.render('auth/forgot-password', {
        page: 'Recover your access to Bienes raíces',
        csrfToken: req.csrfToken()

    })
})

const resetPassword = async (req, res) => {
    //validation
    await check('email').isEmail().withMessage('The email is not valid').run(req)
    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/forgot-password', {
            page: 'Recover your access to Bienes raíces',
            errors: result.array(),
            csrfToken: req.csrfToken(),
        })
    }

    // search  user

    const { email } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
        return res.render('auth/forgot-password', {
            page: 'Recover your access to Bienes raíces',
            errors: [{ msg: 'User not found' }],
            csrfToken: req.csrfToken(),
        })
    }

    user.token = generateId()
    await user.save()

    // Send email
    emailForgotPassword({
        email: user.email,
        name: user.name,
        token: user.token
    })

    // confirmation message    
    res.render('templates/message', {
        page: 'Reset your password',
        message: 'We have sent an email with the instructions'
    })
}

const checkToken = async (req, res) => {

    const { token } = req.params;

    const user = await User.findOne({ where: { token } })
    if (!user) {
        return res.render('auth/confirm-account', {
            page: 'Reset your password',
            message: 'There was an error validating the information, try again.',
            error: true
        })
    }

    res.render('auth/reset-password', {
        page: 'Reset your password',
        csrfToken: req.csrfToken()
    })
}

const newPassword = async (req, res) => {
    // validate
    await check('password').isLength({ min: 6 }).withMessage('The password field must be at least 6 characters long.').run(req)
    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/reset-password', {
            page: 'Reset your password',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })
    }

    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ where: { token } })

    // hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null
    await user.save()
    res.render('auth/confirm-account', {
        page: 'Password Reset',
        message: 'The password was saved correctly'
    })
}

export {
    loginForm,
    authenticateUser,
    registerForm,
    confirm,
    forgotPasswordForm,
    register,
    resetPassword,
    checkToken,
    newPassword
}