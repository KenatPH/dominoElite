import { Router } from "express";
import { getListPartida, create, getPartida, asignaJugadorAPartida, resultadoPartida, rankingJugador, iniciarPartida, getpartidaActivaPorUsuario, agregarPuntosMano, tacharPuntosMano } from "../controllers/partida.controller";

const router = Router();

/**
 * @swagger
 * /api/partida/get:
 *  get:
 *    summary: Listar partidas
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: Error inesperado
 */
router.get('/get/', getListPartida);

/**
 * @swagger
 * /api/partida/torneo/{id}:
 *  get:
 *    summary: Listar partidas por torneo
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: Error inesperado
 */
router.get('/torneo/:torneo', getListPartida);

/**
 * @swagger
 * /api/partida/get/{id}:
 *  get:
 *    summary: obtener partida por id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid de la partida
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: partida no encontrada
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/get/:id', getPartida);

/**
 * @swagger
 * /api/partida/get/usuario/{userId}:
 *  get:
 *    summary: obtener partida por id de usario
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del usuario
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: partida no encontrada
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/get/usuario/:userId', getpartidaActivaPorUsuario);

/**
 * @swagger
 * /api/partida/get/{id}:
 *  get:
 *    summary: inicia la  partida por id y arranca el contador en el websocket
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid de la partida
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: partida no encontrada
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/iniciarPartida/:id', iniciarPartida);


/**
 * @swagger
 * /api/partida/agregarPuntos/{id}:
 *  post:
 *    summary: agrega puntaje al anotador y lo envia a los demnas jugadores
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid de la partida
 *    tags:
 *      - Partidas
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: partida no encontrada
 *      500:
 *        description: Error inesperado
 * 
 */
router.post('/agregarPuntos/:id', agregarPuntosMano);

router.post('/tacharPuntos/:id', tacharPuntosMano);

/**
 * @swagger
 * /api/partida/create:
 *  post:
 *    summary: Registrar una nueva partida
 *    tags:
 *      - Partidas
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createPartidaSchema'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: Partida creada correctamente.
 *      409:
 *        description: Los campos "cantidad de jugadores, jugadores" son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/create', create);

/**
 * @swagger
 * /api/partida/resultadoPartida:
 *  post:
 *    summary: Registrar resultado de partida
 *    tags:
 *      - Partidas
 *    requestBody:
 *        description: Optional description in 
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/resultadoPartidaSchema'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: Partida Iniciada 
 *      500:
 *        description: Error inesperado
 */
router.post('/resultadoPartida', resultadoPartida);

/**
 * @swagger
 * /api/partida/asignaJugadores:
 *  post:
 *    summary: Asigna uno o mas jugadores a una partida
 *    tags:
 *      - Partidas
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/asignarJugadorPartidaSchema'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: Partida creada correctamente.
 *      409:
 *        description: Los campos "cantidad de jugadores, jugadores" son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/asignaJugadores', asignaJugadorAPartida);

router.get('/rankingJugador/:id?', rankingJugador);



export default router;