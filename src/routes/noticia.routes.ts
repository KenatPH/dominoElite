import { Router } from "express";
import { create, getListNoticia, getNoticia, update } from "../controllers/noticia.controller";


const router = Router();

router.get('/get/:pag', getListNoticia);
router.get('/get/:id', getNoticia);

/**
 * @swagger
 * /api/club/create:
 *  post:
 *    summary: Registrar un nuevo torneo
 *    tags:
 *      - club
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
router.post('/update/:id', update);





export default router;