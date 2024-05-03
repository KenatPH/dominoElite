import { Router } from "express";
import { getListPartida, create, getPartida, asignaJugadorAPartida, resultadoPartida, rankingJugador, iniciarPartida } from "../controllers/partida.controller";

const router = Router();

router.get('/get/', getListPartida);
router.get('/torneo/:torneo', getListPartida);
router.get('/get/:id', getPartida);
router.get('/iniciarPartida/:id', iniciarPartida);
/**
 * @swagger
 * /api/torneo/create:
 *  post:
 *    summary: Registrar un nuevo torneo
 *    tags:
 *      - Torneo
 *    requestBody:
 *        description: Optional description in 
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createTorneoSchema'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: Torneo creado con exito
 *      404:
 *        description: arbitro no encontrado  
 *      409:
 *        description: Los campos nombre, ubicacion, puntos, rondas, sistema son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/create', create);
router.post('/resultadoPartida', resultadoPartida);
router.post('/asignaJugadores', asignaJugadorAPartida);
router.get('/rankingJugador/:id', rankingJugador);

export default router;