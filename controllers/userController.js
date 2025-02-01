import { check, validationResult } from 'express-validator'
import User from "../models/UserModel.js"
import { generateId } from '../helpers/tokens.js'


const loginForm = ((req, res) => {
    res.render('auth/login', {
        page: 'Iniciar Sesión'
    })
})

const registerForm = ((req, res) => {
    res.render('auth/register', {
        page: 'Crear cuenta'
    })
})

// create user
const register = async (req, res) => {
    //validation
    console.log("reqsss", req.body.password);

    await check('name').notEmpty().withMessage('El campo nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El campo nombre es obligatorio').run(req)
    await check('password').isLength({min: 6}).withMessage('El campo password debe ser de almenos 6 carácteres').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
    let result = validationResult(req)

    

    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear cuenta',
            errors: result.array(),
            user:{
                name: req.body.name,
                email: req.body.email
            }
        })
    }

    // prevent duplicates
    const userExist = await User.findOne({ where: {email: req.body.email}})

    if (userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            errors: [{msg: 'El Usuario ya está registrado'}],
            user:{
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    
    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        token: generateId()
    })

    

}

const forgotPasswordForm = ((req, res) => {
    res.render('auth/forgot-password', {
        page: 'Recupera tu acceso a Bienes raices'
    })
})

export{
    loginForm,
    registerForm,
    forgotPasswordForm,
    register
}