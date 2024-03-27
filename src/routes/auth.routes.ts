/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir las rutas de authority para la autenticación de usuarios
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Router } from "express";
import { register, login, confirm, modifyPassword } from "../controllers/auth/user.controller.auth";

const router = Router();


router.post('/register', register);
router.post('/login', login);
router.post('/modify-password', modifyPassword);
router.get('/confirm', confirm);


export default router;