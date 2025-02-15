import { check, validationResult } from 'express-validator'
import User from "../models/UserModel.js"
import { generateId } from '../helpers/tokens.js'
import { registerEmail } from '../helpers/emails.js'

const loginForm = ((req, res) => {
    res.render('auth/login', {
        page: 'Login'
    })
})

const registerForm = ((req, res) => {    
    res.render('auth/register', {
        page: 'Create account',
        csrfToken: req.csrfToken()
    })
})

// create user
const register = async (req, res) => {
    //validation
    console.log("reqsss", req.body.password);

    await check('name').notEmpty().withMessage('El campo nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El campo nombre es obligatorio').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El campo password debe ser de almenos 6 carácteres').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
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

 //confirm account
const confirm = async (req, res) => {
    const { token } = req.params

    const user = await User.findOne({ where: {token}})

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
        page: 'Recover your access to Bienes raíces'
    })
})

export {
    loginForm,
    registerForm,
    confirm,
    forgotPasswordForm,
    register
}