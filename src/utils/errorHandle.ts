/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo que maneja los errores de la aplicación
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Response } from "express";

const handleHttp = (res: Response, error: String) => {
   res.status(500)
   res.send({ error })
}

export default handleHttp