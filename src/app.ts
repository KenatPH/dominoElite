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
import { connectDB } from './database'
import passport, { Passport } from 'passport'
import passportMiddleware from './middlewares/protectedroutes.middleware'
import session from 'express-session'

//imported routes
import authRoutes from './routes/auth.routes'
import protectedRoutes from './routes/protected.routes'
import userRoutes from './routes/users.routes'
import paisRoutes from './routes/pais.routes'
import edoRoutes from './routes/estados.routes'
//import fbkRoutes from './routes/fbk.routes'

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

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: config.FBK.secretSession, resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session());
passport.use(passportMiddleware)

//routes
app.get('/', (req, res) => {
   res.send(`The API Dominó, is running in http://localhost:${app.get('port')}`)
})

//rutas de autenticación
app.use('/auth',authRoutes);

app.use('/user',passport.authenticate('jwt', {session: false}),userRoutes);
app.use('/pais',passport.authenticate('jwt', {session: false}),paisRoutes);
app.use('/estado',passport.authenticate('jwt', {session: false}),edoRoutes);
app.use(passport.authenticate('jwt', {session: false}),protectedRoutes);
//app.use('/login/facebook',fbkRoutes);
export default app