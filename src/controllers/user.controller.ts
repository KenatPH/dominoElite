/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para crud de usuarios
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { Request, Response } from "express";
import User from "../models/users.model";
import {getToken, getTokenData} from "../config/config.jwt";
import {sendMail, getTemplateHtml} from "../config/config.mail";


export const update = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;
      const { nombre, telefono, estatus, perfil } = req.body;

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
      user.nombre = nombre;      
      user.telefono = telefono;      
      user.perfil = perfil;
      user.estatus = estatus;
      /* user.email = email || user.email;
      user.clave = clave || user.clave;
      user.origen = origen || user.origen;
      user.tokenFacebook = tokenFacebook || user.tokenFacebook;
      user.tokenGoogle = tokenGoogle || user.tokenGoogle; */
      

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
