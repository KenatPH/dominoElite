
import { Router } from "express";
import { update, deleteUser, forgotPassword, resetPassword, getListUsuarios } from "../controllers/user.controller";

const router = Router();
router.put('/update/:id', update);
/**
 * @swagger
 * /api/user/update:
 *  put:
 *    summary: Actualizar Usuario
 *    security:
 *      - apiAuth: []
 *    tags:
 *      - Usuarios
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Error inesperado
 */
router.delete('/delete/:id', deleteUser);
router.get('/buscar', (req, res) => {
   res.send('Buscando usuario')
});


/**
 * @swagger
 * /api/user/forgotPassword:
 *  post:
 *    summary: Olvido contraseña
 *    tags:
 *      - Usuarios
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                    type: string
 *                    format: email
 *                    description: correo electronico del usuario
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Error inesperado
 */

router.post('/forgotPassword', forgotPassword)

/**
 * @swagger
 * /api/user/reset/{token}:
 *  post:
 *    summary: Reiniciar contraseña
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        type: string
 *        description: token de uso para reuniciar contraseña
 *    tags:
 *      - Usuarios
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                clave:
 *                    type: string
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Error inesperado
 */
router.post('/reset/:token', resetPassword)

/**
 * @swagger
 * /api/user/get:
 *  get:
 *    summary: Listar usuarios
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: Error inesperado
 */
router.get('/get/', getListUsuarios);


export default router;