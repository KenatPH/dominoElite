/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir inicio de sesion de usuarios por facebook
  Fecha creación  : 01 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { Request, Response } from "express";
import User from "../../models/users.model";
import config from '../../config/config';
import passport from 'passport';
import { Strategy as FbkStrategy } from 'passport-facebook';
//import { Strategy } from 'passport-google-oauth20';



 

 export const fbkLogin =  (req: Request, res: Response) => {
   
     console.log('Login User with facebook'); 
     
   passport.serializeUser(function(user, cb) {
      cb(null, user);
   });
    
   passport.deserializeUser(function(obj:string, cb) {
      cb(null, obj);
   });
   console.log('Login User with facebook 2'); 
   
   
   passport.use(new FbkStrategy({
      clientID: config.FBK.clientID,
      clientSecret: config.FBK.clientSecret,
      callbackURL: config.FBK.callBackUrl //http://localhost:3000/auth/facebook/callback
   },
   
      function(accessToken, refreshToken, profile, done) {
         console.log('Login User with facebook 4'); 
         return done(null, profile);
      }
   ));
   console.log('Login User with facebook 3'); 
   passport.authenticate('facebook');
   console.log('Login User with facebook 4'); 
     /* passport.use(new FbkStrategy({
      clientID: config.FBK.clientID,
      clientSecret: config.FBK.clientSecret,
      callbackURL: config.FBK.callBackUrl,   
      profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
      //passReqToCallback: true,
    },
    async function(accessToken:any, refreshToken:any, profile:any, cb:any) {
      // if email not exists, save the profile on the Database
      console.log('profile.emails: ',profile.email);
      console.log('profile.emails[0].value: ',profile.email[0].value);
      
      const user = await User.findOne({ 
         email: profile.email 
      });
      if(!user) {
         console.log('Usuario no registrado');
         const lastUser = await User.findOne().sort({afiliado: -1});
         const lastUserId = lastUser ? lastUser.afiliado : 0;
         const newUser = new User({
            afiliado: lastUserId + 1,
            fbkgoog_id: profile.id,
            nombre: profile.displayName,
            email: profile.email,
            telefono:'', 
            clave:'', 
            estatus: 'activo', 
            origen: profile.provider, 
            tokenFacebook: accessToken,
            tokenGoogle:'', 
            perfil:'atleta'
         }); 
         await newUser.save();
         return cb(null, profile);
      }else{
         console.log('The user already exists!');
         return cb(null, profile);
      }         
      // Save the accessToken and refreshToken if you need to call facebook apis later on      
    }));
   passport.authenticate('facebook', { scope: ['email'] }); */
   
   
 }
 
export const fbkCallback = async (req: Request, res: Response) => {
    await passport.authenticate("facebook", 
      { failureRedirect: "/auth//login" }), 
      (req: Request, res: Response) => {      
      console.log("req", req.user);
      res.redirect('/');
   }
}
   
export const fbkLogout = async (req: Request, res:Response) => {
   try {
      req.session.destroy(function (err) {
        console.log("session destroyed.");
      });
      res.redirect("/");
    } catch (err) {
      res.status(400).send({ message: "Failed to sign out fb user" });
    }   
}