import { Router } from "express";
import { register, login, confirm, modifyPassword } from "../controllers/auth/user.controller.auth";
import { fbkLogin, fbkCallback, fbkLogout } from "../controllers/auth/fbk.controller.auth";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Registrar un nuevo usuario
 *    tags:
 *      - Auth
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createUserSchema'
 *          text/plain:
 *            schema:
 *              type: string
 *    responses:
 *      200:
 *        description: Registrado con exito
 *      409:
 *        description: Los campos email, password, phone, name, son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: ingresa en la aplicacion
 *    tags:
 *      - Auth
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginSchema'
 *          text/plain:
 *            schema:
 *              type: string
 *    responses:
 *      200:
 *        description: login con exito
 *      409:
 *        description: Los campos email, password, phone, name, son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/modify-password:
 *  post:
 *    summary: Modifica la contraseña del usuario
 *    tags:
 *      - Auth
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/passwordModifySchema'
 *          text/plain:
 *            schema:
 *              type: string
 *    responses:
 *      200:
 *        description: clave modificada con exito
 *      410:
 *        description: usuario no encontrado
 *      409:
 *        description: clave actual es incorrecta
 *      500:
 *        description: Error inesperado
 */
router.post('/modify-password', modifyPassword);


router.get('/confirm', confirm);

// routes facebook login

router.get("/facebook", fbkLogin);

router.get("/facebook/callback",fbkCallback);

router.get('/facebook/logout',fbkLogout);


router.get("/google", (req,res)=> res.send("hola"))

export default router;