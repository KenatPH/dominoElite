import { Router } from "express";

import { create, update, addAtletas, getTorneo, getListTorneo, generarPartidasTorneo } from "../controllers/torneo.controller";

const router = Router();

/**
 * @swagger
 * /api/torneo/get:
 *  get:
 *    summary: Listar torneo
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
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/generarPartidasTorneo'
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
router.post('/generarPartidasTorneo/:id', generarPartidasTorneo);

export default router;