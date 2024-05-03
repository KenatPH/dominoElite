
export default {
   JWT_SECRET  : process.env.JWT_SECRET || 'BioonixDominosomeSecretKey17$*',
   DB: { 
      DBNAME: 'dominoelite',
      HOST: process.env.MYSQL_HOST || 'localhost',
      PORT: process.env.MYSQL_PORT || 3306,
      URI: process.env.MONGODB_URI || "jdbc:mysql://localhost:3306/",
      USER: process.env.MYSQL_USER || 'root',
      PASW: process.env.MYSQL_PASS || 'root'
   },
   WS:{
      HOST: process.env.SOCKETHOST || 'localhost',
      PORT: process.env.SOCKETPORT || 3000,
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
