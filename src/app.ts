/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó 
  Módulo          : Archivo que define la configuración para la conexión a la BD
  Fecha creación  : 23 de Mar del 2024
  Modificado el   : 25-03-24
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { urlencoded } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config from './config/config'
import authRoutes from './routes/auth.routes'
import protectedRoutes from './routes/protected.routes'
import userRoutes from './routes/users.routes'
import { connectDB } from './database'
import passport from 'passport'
import passportMiddleware from './middlewares/protectedroutes.middleware'

//conexión a la bd
connectDB();

//initializations
const app = express()

// settings
app.set('port', process.env.PORT || 3000)


//middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
passport.use(passportMiddleware)

//routes
app.get('/', (req, res) => {
   res.send(`The API Dominó, is running in http://localhost:${app.get('port')}`)
})


app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/',protectedRoutes);
export default app