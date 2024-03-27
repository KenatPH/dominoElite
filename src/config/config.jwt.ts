import jwt from 'jsonwebtoken'
import config from "./config";

export const getToken = (payload:any) => {
   return jwt.sign(
   {
      data: payload
   }, config.JWT_SECRET,
   {
      expiresIn: '1h'
   });
}

export const getTokenData = (token:any) => {
   let data = null;
   jwt.verify(token, config.JWT_SECRET, (err:any, decoded:any) => {
      if(err){
         console.log("Error al obtener data del token");
      }else{
         data = decoded;
      }
   });
   return data;
}