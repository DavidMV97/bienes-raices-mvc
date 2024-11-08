import express from "express"
import usuarioRoutes from './routes/usuarioRoute.js'

// Crear la app 
const app = express()

// Routing
app.use('/', usuarioRoutes)

// Definir un puerto y arrancar un proyecto
const port = 3000

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})