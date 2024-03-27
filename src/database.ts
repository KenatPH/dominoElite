/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo que recibe la configuración para la conexión a la BD y se conecta a mongodb
  Fecha creación  : 23 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import mongoose  from "mongoose";
import config from "./config/config";


export const connectDB = async () => {
   try {
      await mongoose.connect(config.DB.URI)
      
      const connection = mongoose.connection;
      connection.once('open', () => {
         console.log('Mongodb connection stablished');
      })
      connection.on('error', err => {
         console.log('Error in connection db ',err);
         process.exit(0);
      })  
   } catch (error) {
      console.log('Error in connection db ',error);
      process.exit(0);    
   }
}





