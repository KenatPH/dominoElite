/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo que define la configuración para la conexión a la BD y otras configuraciones
  Fecha creación  : 23 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

export default {
   JWT_SECRET  : process.env.JWT_SECRET || 'BioonixDominosomeSecretKey17$*',
   DB: { 
      URI   : process.env.MONGODB_URI || "mongodb://localhost/domino",
      USER  : process.env.MONGODB_USER,
      PASW  : process.env.MONGODB_PASSW
   },
   MAIL: {
      correo: "jlramirez17@gmail.com",
      passw: "wbhlgttewcrahgvr",
      path_confirm: "http://localhost:3000/auth/confirm/"
   }
}
