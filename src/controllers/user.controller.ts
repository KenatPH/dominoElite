import express, { Request, Response } from "express";
import User from "../models/users.model";
import {getToken, getTokenData} from "../config/config.jwt";
import {sendMail, getTemplateHtml, transporter} from "../config/config.mail";
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize";
import Club from "../models/club.model";
import { saveImage } from "../utils/utils";


export const update = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;
      const { nombre, telefono, estatus, perfil, imagen  } = req.body;

      if (!id) {
         return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "id" son obligatorios'
         })
      }

      // Find the user by userId
      const user = await User.findOne({ where: { id: id } });

      if (!user) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'User not found'
         });
      }

      // Update the user properties
      user.nombre = (nombre)? nombre:user.nombre;      
      user.telefono = (telefono)? telefono:user.telefono;      
      user.perfil = (perfil)? perfil:user.perfil;
      user.estatus = (estatus)? estatus:user.estatus;


      if(imagen){
       await saveImage(user.imagen, imagen).then((nombreImagen:any)=>{
         user.imagen = nombreImagen
       })
      }

      

      // Save the updated user
      await user.save();

      return res.status(200).json({
         data_send: {"nombre": user.nombre,
                     "email": user.email,
                     "telefono": user.telefono,
                     "perfil": user.perfil,
                     "estatus": user.estatus,
         },
         num_status: 0,
         msg_status: 'User updated successfully'
      });
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;

      // Find the user by userId and Delete the user
      
      const user = await User.destroy({ where: { id: id } });

      if (!user) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'User not found'
         });
      }else{
         return res.status(200).json({
            //data_send:user,
            num_status: 0,
            msg_status: 'User deleted successfully'
         });
      }
                  
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}


export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
   
   const { email } = req.body;

   const token = uuidv4();
   // Encuentra al usuario basado en el correo electrónico proporcionado
   const user = await User.findOne({ where: { email: email } });

   if (!user) {
      return res.status(404).json({
         data_send: "",
         num_status: 6,
         msg_status: 'User not found'
      });
   }

   // Establece los campos de restablecimiento de contraseña en el usuario
   user.resetPasswordToken = token;
   user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
   await user.save();

   // Configura el servicio de correo electrónico

   // Configura el correo electrónico
   
   // Envía el correo electrónico
   await transporter.sendMail({
      to: user.email,
      from: 'tuCorreo@gmail.com',
      subject: 'Restablecimiento de contraseña',
      text: `Recibiste este correo electrónico porque tú (u otra persona) solicitaste el restablecimiento de la contraseña de tu cuenta.\n\n
           Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
           http://dominoelite.com/reset/${token}\n\n
           Si no solicitaste este cambio, ignora este correo electrónico y tu contraseña permanecerá sin cambios.\n`,
   });

   return res.status(200).json({
      data_send: "",
      num_status: 0,
      msg_status: 'Correo electrónico de restablecimiento de contraseña enviado'
   });

}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {

   const { token } = req.params;

   const user = await User.findOne({
      where: {
         resetPasswordToken: token,
         resetPasswordExpires: { [Op.gt]: Date.now() },
      },
   });

   if (!user) {
      return res.status(404).json({
         data_send: "",
         num_status: 6,
         msg_status: 'El token de restablecimiento de contraseña es inválido o ha expirado'
      });
   }

   // Establece la nueva contraseña
   user.clave = req.body.clave;
   user.resetPasswordToken = '';
   user.resetPasswordExpires = 0;

   await user.save();


   return res.status(200).json({
      data_send: "",
      num_status: 0,
      msg_status: 'Contraseña cambiada con éxito'
   });


}

export const getListUsuarios = async (req: Request, res: Response): Promise<Response> => {
   const { arbitro } = req.params;
   let where={}
   if(arbitro){
      where = { esArbitro:true }
   }
   const usuarios = await User.findAll({ 
      where:where,
      order: [
         ['updatedAt', 'ASC'],
      ],
      // offset: (pag) ? parseInt(pag) : 1, limit: 30
   })
   try {

      return res.status(201).json(usuarios);
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }

}


export const getUser = async (req: Request, res: Response): Promise<Response> => {
   const { id } = req.params;

   const usuario = await User.findOne({
      where: { id: id }
   })
   if (!usuario) {
      return res.status(404).json({
         data_send: "",
         num_status: 6,
         msg_status: 'usuario no Encontrado'
      });
   }

   try {

      if (usuario.perfil === 'club'){

         const club = await Club.findOne(
            {
               where: { id: id },
               include: [
                  {
                     model: User,
                     as: 'atletas',
                     attributes: ['id', 'nombre']
                  }
               ]
            })


         return res.status(201).json(
            {
               data_send: { usuario, club },
               num_status: 0,
               msg_status: 'partida obtenida correctamente.'
            }
         );

      }

      return res.status(201).json(
         {
            data_send: { usuario },
            num_status: 0,
            msg_status: 'partida obtenida correctamente.'
         }
      );



   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}