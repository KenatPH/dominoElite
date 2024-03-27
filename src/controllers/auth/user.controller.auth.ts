/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir la funcion de cada ruta de auth usuarios
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { Request, Response } from "express";
import User from "../../models/users.model";
import {getToken, getTokenData} from "../../config/config.jwt";
import {sendMail, getTemplateHtml} from "../../config/config.mail";


export const register = async (req: Request, res: Response): Promise<Response> => {
   //declaramos los parametros recibidos en el req.body
   const { nombre, email, telefono, clave, status, origen,  tokenFacebook, tokenGoogle, perfil} = req?.body
   if(!email || !clave || !telefono || !nombre ){
      return res.status(409).json({
         data_send: "",         
         num_status:1,
         msg_status: 'Los campos email, password, phone, name, son obligatorios'
      })
   }

   //verificar si ya existe un usuario con ése email
   const user = await User.findOne({email: email})
   if(user) {
      return res.status(409).json({
         data_send: "",         
         num_status:2,
         msg_status: 'The user already exists!'         
      })
   }
   
   const newUser = new User({
      nombre,
      email,
      telefono, 
      clave, 
      status, 
      origen, 
      tokenFacebook,
      tokenGoogle, 
      perfil
   })

   try {
      
      await newUser.save();
      const userId = newUser._id;   

      //obtenemos un token
      const token = getToken({ email, userId });
      console.log('email que recibe correo: ',email);
      console.log('token: ',token);
      //Obtener template html      
      const html = getTemplateHtml(nombre, token);

      //Enviar email
      await sendMail(email, 'Confirmar cuenta', html);


      return res.status(201).json(
      {  
         data_send: newUser,         
         num_status:0,
         msg_status: 'User created successfully, an email has been sent to confirm your account, check your spam folder.'
      });
      
   } catch (error) {
      return res.status(400).json({
         message: error
      })
   }
}

export const login = async (req: Request, res: Response) => {
   //validamos que los datos para hacer login sea los correctos y existan en la llamada
   const { email, clave } = req?.body
   if(!email || !clave){
      return res.status(409).json({
         data_send: "",         
         num_status:3,
         msg_status: 'Please. Send your email and password, to continue'
      })      
   }

   //validamos que el usuario exista
   const user = await User.findOne({email: email})
   if(!user) {
      return res.status(409).json({
         data_send: "",         
         num_status:4,
         msg_status: 'The user does not exist!'         
      })
   }

   //validamos que la clave sea correcta
   user.comparePassword(clave).then((match: boolean) => {
      if(!match) {
        return res.status(409).json({
          data_send: "",         
          num_status:5,
          msg_status: 'Credentials do not match!'         
        })
      }
    
      //generar token
      const token = getToken({ email, id: user._id, nombre: user.nombre, perfil: user.perfil});
    
      return res.status(200).json({
        data_send: {token, nombre: user.nombre, telefono: user.telefono, perfil: user.perfil},
        num_status:0,
        msg_status: 'Login successfully'
      })
   });   
}


export const modifyPassword = async (req: Request, res: Response): Promise<Response> => {
   const { email, oldPassword, newPassword } = req.body;

   try {
      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'User not found'
         });
      }

      // Check if the old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
         return res.status(409).json({
            data_send: "",
            num_status: 7,
            msg_status: 'Old password is incorrect'
         });
      }

      // Update the password
      user.clave = newPassword;
      await user.save();

      return res.status(200).json({
         data_send: "",
         num_status: 0,
         msg_status: 'Password modified successfully'
      });
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}

export const confirm = (req: Request, res: Response) => {
   res.send('confirm')   
}

export const home = (req: Request, res: Response) => {
   res.send('Bienvenido al inicio del sistema dominó')   
}

