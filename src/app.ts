import express, { urlencoded } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config from './config/config'
import { connectDB } from './database'
import passport, { Passport } from 'passport'
import passportMiddleware from './middlewares/protectedroutes.middleware'
import session from 'express-session'
import swaggerUi from "swagger-ui-express";
import swggerSpec from './swagger'
import { Server } from 'socket.io';

//imported routes
import router from './routes'
import path from 'path'



//conexión a la bd
connectDB();

//initializations
const app = express()

// settings
app.set('port', process.env.PORT || 4000)


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

// app.use(express.static('src/public'));

app.use('/img', express.static(path.join(__dirname, 'public/images')));
// app.use('/img', express.static('src/public'));

//routes
app.get('/', (req, res) => {
  res.send(`⚡️[server]: The API Dominó, is running in http://localhost:${app.get('port')}`)
})

//rutas de autenticación
app.use(router)

//swagger
app.use("/docs", swaggerUi.serve,swaggerUi.setup(swggerSpec))


export default app