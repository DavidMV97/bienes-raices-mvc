import express from "express"

const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.json({msg: 'Hola mundo en express'})
    })
    .post((req, res) => {
        res.json({msg: 'Respuesta de tipo post'})
    })


export default router

