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
      URI   : process.env.MONGODB_URI || "mongodb://localhost/dominoelite",
      USER  : process.env.MONGODB_USER,
      PASW  : process.env.MONGODB_PASSW
   },
   MAIL: {
      correo: "jlramirez17@gmail.com",
      passw: "wbhlgttewcrahgvr",
      path_confirm: "http://localhost:3000/auth/confirm/"
   },
   FBK: {
      clientID: process.env.FBK_ID || "730716712424276",
      clientSecret: process.env.FBK_SECRET || "7080d44bea7e664b3b9acc722620a202",
      callBackUrl: "http://localhost:3000/auth/facebook/callback",
      secretSession: "Aguila17_mejorando_el_mundo"
   }
}
