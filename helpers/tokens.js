import jwt from 'jsonwebtoken'


const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

// authenticate user
const generateJWT = Id => jwt.sign({ Id }, process.env.JWT_SECRET, { expiresIn: '1d'})


export {
    generateId,
    generateJWT
}