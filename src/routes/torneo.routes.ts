import { Router } from "express";

import { create, update, addAtletas, getTorneo, getListTorneo, generarPartidasTorneo, generarRondaTorneo, iniciarTorneo, pausarTorneo, reanudarTorneo, addAtletasAsistentes, detenerTorneo } from "../controllers/torneo.controller";

const router = Router();

/**
 * @swagger
 * /api/torneo/get/{pag}:
 *  get:
 *    summary: Listar torneo
 *    parameters:
 *      - in: path
 *        name: pag
 *        type: string
 *        minimum: 1
 *        description: pagina para listar
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
router.get('/get/', getListTorneo);

/**
 * @swagger
 * /api/torneo/get/{id}:
 *  get:
 *    summary: obtener torneo por id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *        schema:
 *          $ref: '#/components/schemas/createTorneoSchema'
 *      500:
 *        description: Error inesperado
 */
router.get('/get/:id', getTorneo);

/**
 * @swagger
 * /api/torneo/create:
 *  post:
 *    summary: Registrar un nuevo torneo
 *    tags:
 *      - Torneo
 *    requestBody:
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

/**
 * @swagger
 * /api/torneo/update/{id}:
 *  post:
 *    summary: actualizar un  torneo
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateTorneoSchema'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: Torneo actualizado con exito
 *      404:
 *        description: arbitro no encontrado  
 *      409:
 *        description: Los campos nombre, ubicacion, puntos, rondas, sistema son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/update/:id', update);

/**
 * @swagger
 * /api/torneo/addAtletas/{id}:
 *  post:
 *    summary: agrega atletas a un  torneo
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/addAtletaTorneo'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: atletas agregados con con exito
 *      404:
 *        description: arbitro no encontrado  / torneo no encontrado
 *      409:
 *        description: Los campos id, atletas son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/addAtletas/:id', addAtletas);

/**
 * @swagger
 * /api/torneo/addAtletasAsistentes/{id}:
 *  post:
 *    summary: marca como asistentes atletas de un  torneo
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/addAtletaTorneo'
 *          text/plain:
 *            schema:
 *              type: string
 * 
 *    responses:
 *      200:
 *        description: atletas agregados con con exito
 *      404:
 *        description: arbitro no encontrado  / torneo no encontrado
 *      409:
 *        description: Los campos id, atletas son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/addAtletasAsistentes/:id', addAtletasAsistentes);

/**
 * @swagger
 * /api/torneo/generarPartidasTorneo/{id}:
 *  post:
 *    summary: genera partidas de un  torneo
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 * 
 *    responses:
 *      200:
 *        description: atletas agregados con con exito
 *      404:
 *        description: arbitro no encontrado  / torneo no encontrado
 *      409:
 *        description: Los campos id, atletas son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/generarPartidasTorneo/:id', generarPartidasTorneo);

/**
 * @swagger
 * /api/torneo/generarRondaTorneo/{id}:
 *  post:
 *    summary: genera partidas de un  torneo
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 * 
 *    responses:
 *      200:
 *        description: atletas agregados con con exito
 *      404:
 *        description: arbitro no encontrado  / torneo no encontrado
 *      409:
 *        description: Los campos id, atletas son obligatorios
 *      500:
 *        description: Error inesperado
 */
router.post('/generarRondaTorneo/:id', generarRondaTorneo);

/**
 * @swagger
 * /api/torneo/iniciarTorneo/{id}:
 *  get:
 *    summary: inicia torneo por id y arranca el contador en el websocket
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: torneo no encontrado
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/iniciarTorneo/:id', iniciarTorneo);

/**
 * @swagger
 * /api/torneo/pausarTorneo/{id}:
 *  get:
 *    summary: pausa torneo por id y pausa el contador en el websocket
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: torneo no encontrado
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/pausarTorneo/:id', pausarTorneo);

/**
 * @swagger
 * /api/torneo/reanudarTorneo/{id}:
 *  get:
 *    summary: reanuda torneo por id y reaunda el contador en el websocket
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: torneo no encontrado
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/reanudarTorneo/:id', reanudarTorneo);


/**
 * @swagger
 * /api/torneo/detenerTorneo/{id}:
 *  get:
 *    summary: detiene torneo por id y detiene el contador en el websocket
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        minimum: 1
 *        description: uuid del torneo
 *    tags:
 *      - Torneo
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: ok
 *      400:
 *        description: torneo no encontrado
 *      500:
 *        description: Error inesperado
 * 
 */
router.get('/detenerTorneo/:id', detenerTorneo);

export default router;