/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir las rutas de acciones sobre usuarios (CRUD)
  Fecha creación  : 27 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Router } from "express";
import { update, deleteUser } from "../controllers/user.controller";

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

export default router;