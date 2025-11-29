import express from "express"
import csurf from "csurf"
import cookieParser from "cookie-parser"
import userRoutes from './routes/userRoutes.js'
import db from "./config/db.js"

const app = express()

// Enable reading data from forms
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.use(csurf({cookie: true}))

try {
    await db.authenticate()
    db.sync()
    console.log('Conexión existosa a la base de datos')
} catch (error) {
    console.log(error);
}

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

app.use('/auth', userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})