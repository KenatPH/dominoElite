/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para iniciar la aplicación
  Fecha creación  : 22 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import app from './app'
import './database'

app.listen(app.get('port'))
console.log(`Server Domino is running in port: ${app.get('port')}`)

