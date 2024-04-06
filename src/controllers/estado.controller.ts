/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para crud de estados
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { Request, Response } from "express";
import Estado from "../models/estados.models";


//mostrar estados que pertenecen a un país por su codigo de país (pais=VE o paisid)


//mostrar un estado por su id de estado (_id)
export const getEstado = async (req: Request, res: Response): Promise<Response> => {
   const { id } = req.params; 
   const edo = await Estado.findById(id);
   //validamos que exista la información
   try {
      if(!edo){
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'No country found'
         });
      }
      return res.status(200).json({
         data_send: edo,
         num_status: 0,
         msg_status: 'Countries found successfully'
      });
   } catch (error) {
      return res.status(500).json({
         data_send: "",
         num_status: 0,
         msg_status: 'There was a problem with the server, try again later '+error         
      })
   }   
}

//mostrar todos los estados de un país por su codigo de país (pais=VE o _id)
export const getDataEdos = async (req: Request, res: Response): Promise<Response> => {
   const edo = await Estado.find();
   
   //validamos que exista la información
   try {
      if(edo.length === 0){
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'No state found'
         });
      }
      return res.status(200).json({
         data_send: edo,
         num_status: 0,
         msg_status: 'States found successfully!!!'
      });
   } catch (error) {
      return res.status(500).json({
         data_send: "",
         num_status: 501,
         msg_status: 'There was a problem with the server, try again later (estado)'+error         
      })
   }   
}


export const create = async (req: Request, res: Response): Promise<Response> => {
   //declaramos los parametros recibidos en el req.body
   const { pais, estado, nombre,  timezone, paisid } = req?.body

   //validar el origen para saber si viene de local
   if(!pais || !nombre ){
      return res.status(409).json({
         data_send: "",         
         num_status:12,
         msg_status: 'Los campos pais, nombre, son obligatorios (estado)'
      })
   }

   //verificar si ya existe un usuario con ése email
   const edo = await Estado.findOne({pais: pais.toUpperCase(), nombre: nombre.toUpperCase()})
   if(edo) {
      return res.status(409).json({
         data_send: "",         
         num_status:2,
         msg_status: 'the state is already added to this country!'         
      })
   }
      
   const newEdo = new Estado({
      pais: pais.toUpperCase(),
      paisid,
      estado: estado.toUpperCase(), 
      nombre: nombre.toUpperCase(), 
      timezone: timezone.toUpperCase(),       
   });

   try {
      
      await newEdo.save();
      
      return res.status(201).json(
      {  
         data_send: newEdo,         
         num_status:0,
         msg_status: 'State created successfully.'
      });
      
   } catch (error) {
      return res.status(400).json({
         message: error
      })
   }
}


export const update = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;
      const { pais, estado, nombre, timezone } = req.body;

      // Find the pais by Id
      const edo = await Estado.findById(id);

      if (!edo) {
         return res.status(404).json({
            data_send: "",
            num_status: 15,
            msg_status: 'State not found'
         });
      }

      // Update the estado properties
      edo.nombre = nombre.toUpperCase();      
      edo.estado = estado.toUpperCase();      
      edo.timezone = timezone.toUpperCase();
      edo.pais = pais.toUpperCase();
      
      // Save the updated pais
      await edo.save();

      return res.status(200).json({
         data_send: {"pais": edo.pais.toUpperCase(),
                     "nombre": edo.nombre.toUpperCase(),
                     "estado": edo.estado.toUpperCase(),
                     "timezone": edo.timezone.toUpperCase()                     
         },
         num_status: 0,
         msg_status: 'State updated successfully'
      });
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}

export const deleteEstado = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;

      // Find the state by id and Delete the state
      
      const edo = await Estado.findByIdAndDelete(id);

      if (!edo) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'Pais not found'
         });
      }else{
         return res.status(200).json({
            //data_send:user,
            num_status: 0,
            msg_status: 'State deleted successfully'
         });
      }
                  
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}
