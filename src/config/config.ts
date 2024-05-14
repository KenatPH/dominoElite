
import dotenv from 'dotenv';
dotenv.config();

const production = process.env.PRODUCTION_MODE === 'true'

export default {
   JWT_SECRET: process.env.JWT_SECRET || 'BioonixDominosomeSecretKey17$*',
   DB: { 
      DBNAME: 'dominoelite',
      HOST: production? process.env.MYSQL_HOST : 'localhost',
      PORT: production? process.env.MYSQL_PORT : 3306,
      URI: production? process.env.MONGODB_URI : "jdbc:mysql://localhost:3306/",
      USER: production? process.env.MYSQL_USER : 'root',
      PASW: production? process.env.MYSQL_PASS : 'root'
   },
   WS:{
      HOST: production? process.env.SOCKETHOST : 'localhost',
      PORT: production? process.env.SOCKETPORT : 3000,
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
   },
   webpush:{
      publicKey: production? process.env.PUBLIC_KEY_WP :'BPgm4VlLBMb0m5ambYzGPWHo2twJncZa5Gi0WNOiOdjvHe-itNrw4FB-LjLfciGerdyruqRhe65Qr0xOYZAfSoQ',
      privateKey: production? process.env.PRIVATE_KEY_WP : '6vUWlr36g72GqwU2Poj3Pp2_uBURJ0auK_fLzhXLppI'
   }
}
