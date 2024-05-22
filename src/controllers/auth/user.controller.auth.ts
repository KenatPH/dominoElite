
import express, { Request, Response } from "express";
import User from "../../models/users.model";
import {getToken, getTokenData} from "../../config/config.jwt";
import {sendMail, getTemplateHtml} from "../../config/config.mail";


export const register = async (req: Request, res: Response): Promise<Response> => {
   //declaramos los parametros recibidos en el req.body
   const { nombre, email, telefono, clave, estatus, origen, fbkgoog_id, tokenFacebook, tokenGoogle, perfil, esArbitro } = req?.body
   
   //validar el origen para saber si viene de local
   if(!email || !clave || !telefono || !nombre ){

      return res.status(409).json({
         data_send: "",         
         num_status:1,
         msg_status: 'Los campos email, password, phone, name, son obligatorios'
      })
   }

   //verificar si ya existe un usuario con ése email
   const user = await User.findOne({ where: { email: email } })
   if(user) {
      return res.status(409).json({
         data_send: "",         
         num_status:2,
         msg_status: 'The user already exists!'         
      })
   }
   
   const lastUser = await User.findOne({ order: [['afiliado', 'desc']]});
   const lastUserId = lastUser ? lastUser.afiliado : 0;
   let afiliado: number = lastUserId + 1;
   const newUser = new User({
      afiliado: afiliado,
      fbkgoog_id: "0",
      nombre,
      email,
      telefono, 
      clave, 
      estatus, 
      origen, 
      tokenFacebook,
      tokenGoogle, 
      perfil,
      esArbitro
   });

   try {
      
      await newUser.save();
      const userId = newUser.id;   
      
      //obtenemos un token
      const token = getToken({ email, userId, afiliado });
   
      //Obtener template html      
      const html = getTemplateHtml(nombre, token, afiliado);

      //Enviar email
      // await sendMail(email, 'Confirmar cuenta', html);


      return res.status(201).json(
      {  
         data_send: newUser,         
         num_status:0,
         msg_status: 'User created successfully'
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
   const user = await User.findOne({ where: { email: email } })
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
        return res.status(200).json({
          data_send: "",         
          num_status:5,
          msg_status: '¡Contraseña invalida!'         
        })
      }
    
      //generar token
      const token = getToken({ email, id: user.id, nombre: user.nombre, perfil: user.perfil});
    
      return res.status(200).json({
        data_send: {token, nombre: user.nombre, telefono: user.telefono, perfil: user.perfil, id:user.id},
        num_status:0,
        msg_status: 'Login successfully'
      })
   });   
}


export const modifyPassword = async (req: Request, res: Response): Promise<Response> => {
   const { email, oldPassword, newPassword } = req.body;

   try {
      // Find the user by email
      const user = await User.findOne({ where: { email: email } });

      // Check if the user exists
      if (!user) {
         return res.status(410).json({
            data_send: "",
            num_status: 6,
            msg_status: 'usuario no encontrado'
         });
      }

      // Check if the old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
         return res.status(409).json({
            data_send: "",
            num_status: 7,
            msg_status: 'clave actual es incorrecta'
         });
      }

      // Update the password
      user.clave = newPassword;
      await user.save();

      return res.status(200).json({
         data_send: "",
         num_status: 0,
         msg_status: 'clave modificada con exito'
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

