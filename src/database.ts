/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo que recibe la configuración para la conexión a la BD y se conecta a mongodb
  Fecha creación  : 23 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/


import { Sequelize } from 'sequelize-typescript';
import config from "./config/config";
import User from "./models/users.model";
import Torneo from "./models/torneo.model";
import AtletasTorneos from "./models/atletasTorneos.model";
import PremiosTorneos from "./models/premioTorneo.model";
import SolicitudMembresia from './models/solicitudMembresia.model';
import Club from './models/club.model';
import Partida from './models/partida.model';
import JugadorPartida from './models/jugadorPartida.model';

export const connectDB = async () => {
   try {

      const sequelize = new Sequelize({
         database: config.DB.DBNAME,
         dialect: 'mysql',
         username: config.DB.USER,
         password: config.DB.PASW,
         port: Number(config.DB.PORT),
         // models: [__dirname + '/models'], // or [Player, Team],
      });
      sequelize.addModels([
         SolicitudMembresia,
         User,
          Torneo,
          AtletasTorneos,
          PremiosTorneos,
          Club,
          Partida,
          JugadorPartida]);
      
   } catch (error) {
      console.log('Error in connection db ',
      error);
      process.exit(0);    
   }
}





