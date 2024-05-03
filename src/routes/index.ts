import express from 'express'
import authRoutes  from './auth.routes';
import userRoutes  from './users.routes';
import torneoRoutes from './torneo.routes'
import clubsRoutes from './club.routes'
import partidasRouter from './partida.routes'
import passport from 'passport';

const router = express.Router()

router.use('/auth', authRoutes);

router.use('/api/user', passport.authenticate('jwt', { session: false }), userRoutes);

// router.use('/api/torneo', passport.authenticate('jwt', { session: false }), torneoRoutes);

// router.use('/api/club', passport.authenticate('jwt', { session: false }), clubsRoutes);

router.use('/api/torneo',  torneoRoutes);
router.use('/api/club', clubsRoutes);
router.use('/api/partida', partidasRouter);



export default router;
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    apiAuth:
 *      type: apiKey
 *      in: header
 *      name: id
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      loginSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  format: email
 *                  description: correo electronico del usuario
 *              clave:
 *                  type: string
 *                  description: clave del usuario
 *          required:
 *             - email
 *             - clave
 *      passwordModifySchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  format: email
 *                  description: correo electronico del usuario
 *              oldPassword:
 *                  type: string
 *                  description: clave anterior del usuario
 *              newPassword:
 *                  type: string
 *                  description: nueva clave del usuario
 *          required:
 *             - email
 *             - oldPassword
 *             - newPassword
 *      createUserSchema:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: nombre del usuario
 *              email:
 *                  type: string
 *                  format: email
 *                  description: correo electronico del usuario
 *              telefono:
 *                  type: string
 *                  description: numero telefonico del usuario
 *              clave:
 *                  type: string
 *                  description: clave del usuario
 *          required:
 *             - email
 *             - clave
 *      createTorneoSchema:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: nombre del torneo
 *              ubicacion:
 *                  type: string
 *                  description: ubicacion del torneo
 *              sistema:
 *                  type: string
 *              puntos:
 *                  type: integer
 *                  description: puntos por partidas del torneo
 *              rondas:
 *                  type: integer
 *                  description: cantidad de rondas del torneo
 *              publico:
 *                  type: boolean
 *              minutos:
 *                  type: integer
 *              segundos:
 *                  type: integer
 *              arbitro:
 *                  type: string
 *                  example:
 *                      id: 2ba3af9f-245e-47f2-bec6-30e6945804ee
 *              premios:
 *                  type: array
 *                  example:
 *                      - premio uno
 *                      - premio dos
 *                      - premio tres
 *          required:
 *             - sistema
 *             - nombre
 *             - rondas
 *      updateTorneoSchema:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: nombre del torneo
 *              ubicacion:
 *                  type: string
 *                  description: ubicacion del torneo
 *              sistema:
 *                  type: string
 *              puntos:
 *                  type: integer
 *                  description: puntos por partidas del torneo
 *              rondas:
 *                  type: integer
 *                  description: cantidad de rondas del torneo
 *              publico:
 *                  type: boolean
 *              minutos:
 *                  type: integer
 *              segundos:
 *                  type: integer
 *              arbitro:
 *                  type: string
 *                  example:
 *                      id: 2ba3af9f-245e-47f2-bec6-30e6945804ee
 *          required:
 *             - sistema
 *             - nombre
 *             - rondas
 *      addAtletaTorneo:
 *         type: object
 *         properties:
 *           atletas:
 *              type: array
 *              example:
 *               - 2ba3af9f-245e-47f2-bec6-30e6945804ee
 *      generarPartidasTorneo:
 *          type: object
 *          properties:
 *              mesas:
 *                type: object
 *                properties:
 *                  jugadores: 
 *                    example:
 *                       -  2ba3af9f-245e-47f2-bec6-30e6945804ee
 *                       -  2ba3af9f-245e-47f2-bec6-30e6945804ee
 *                       -  2ba3af9f-245e-47f2-bec6-30e6945804ee
 *                 
 */         