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

const forgotPasswordForm = ((req, res) => {
    res.render('auth/forgot-password', {
        page: 'Recupera tu acceso a Bienes raices'
    })
})

export{
    loginForm,
    registerForm,
    forgotPasswordForm
}