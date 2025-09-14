import nodemailer from 'nodemailer'

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    

    const {email, name, token} = data

    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject: 'Confirm your account in Bienesraices.com',
        text: 'Confirm your account in Bienesraices.co',
        html: `
            <p>Hello ${name}, confirm your account in Bienesraices.com </p>
            <p>Your account is now ready, you just have to confirm it in the following link: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a>
            </p>
            <p>If you did not create this account you can ignore the message</p>
            `
    })

}

const emailForgotPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    

    const {email, name, token} = data

    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject: 'Reset your password in Bienesraices.com',
        text: 'Reset your password in Bienesraices.co',
        html: `
            <p>Hello ${name}, You have requested to reset your password in Bienesraices.com </p>
            <p>Follow the link below to generate a new password: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a>
            </p>
            <p>If you did not create this account you can ignore the message</p>
            `
    })

}

export {
    registerEmail
}