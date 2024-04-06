/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir las rutas de acciones sobre paises (CRUD)
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Router } from "express";
import { create, update, deletePais, getDataPaises, getPais } from "../controllers/pais.controller";
import passport from 'passport';

const router = Router();

router.post('/create',  create);
router.put('/update/:id', update);
router.delete('/delete/:id', deletePais);
router.get('/show', getDataPaises);
router.get('/show/:id', getPais);


export default router;