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
import SubscripcionesPush from './models/subscripcionesPush.model';
import ColaNotificaciones from './models/colaNotificaciones.model';
import puntuacion from './models/puntuacion.model';
import Noticia from './models/noticia.model';
import Notificacion from './models/notificacion.model';

export const sequelize = new Sequelize({
   host: config.DB.HOST,
   database: config.DB.DBNAME,
   dialect: 'mysql',
   username: config.DB.USER,
   password: config.DB.PASW,
   port: Number(config.DB.PORT),
   // models: [__dirname + '/models'], // or [Player, Team],
});

export const connectDB = async () => {
   try {

      sequelize.addModels([
            SolicitudMembresia,
            User,
            Torneo,
            AtletasTorneos,
            PremiosTorneos,
            Club,
            Partida,
            JugadorPartida,
            SubscripcionesPush,
            ColaNotificaciones,
            puntuacion,
            Noticia,
            Notificacion
         ]);
      
   } catch (error) {
      console.log('Error in connection db ',
      error);
      process.exit(0);    
   }
}





