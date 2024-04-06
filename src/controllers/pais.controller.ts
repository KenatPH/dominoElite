/*
  Empresa         : Bioonix
  Aplicación      : Api de Dominó
  Módulo          : Archivo para crud de paises
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import express, { Request, Response } from "express";
import Pais from "../models/paises.models";


//mostrar un país por su codigo de país (pais=VE)
export const getPais = async (req: Request, res: Response): Promise<Response> => {
   const { id } = req.params; 
   const pais = await Pais.findById(id);
   //validamos que exista la información
   try {
      if(!pais){
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'No country found'
         });
      }
      return res.status(200).json({
         data_send: pais,
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

//mostrar todos los países
export const getDataPaises = async (req: Request, res: Response): Promise<Response> => {
   const paises = await Pais.find();
   
   //validamos que exista la información
   try {
      if(paises.length === 0){
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'No countries found'
         });
      }
      return res.status(200).json({
         data_send: paises,
         num_status: 0,
         msg_status: 'Countries found successfully!!!'
      });
   } catch (error) {
      return res.status(500).json({
         data_send: "",
         num_status: 501,
         msg_status: 'There was a problem with the server, try again later (pais)'+error         
      })
   }
   
}

//crear un pais
export const create = async (req: Request, res: Response): Promise<Response> => {
   //declaramos los parametros recibidos en el req.body
   const { pais, nombre, zonahoraria, bandera, idioma, moneda} = req?.body
   
   //validar el origen para saber si viene de local
   if(!pais || !nombre ){
      return res.status(409).json({
         data_send: "",         
         num_status:1,
         msg_status: 'Los campos pais, nombre, son obligatorios'
      })
   }

   //verificar si ya existe un usuario con ése email
   const pa = await Pais.findOne({pais: pais.toUpperCase()})
   if(pa) {
      return res.status(409).json({
         data_send: "",         
         num_status:2,
         msg_status: 'The country already exists!'         
      })
   }
      
   const newPais = new Pais({
      pais: pais.toUpperCase(), 
      nombre: nombre.toUpperCase(),       
      zonahoraria: zonahoraria.toUpperCase(), 
      bandera: bandera.toLowerCase(), 
      idioma: idioma.toUpperCase(),
      moneda: moneda.toUpperCase()
   });

   try {
      
      await newPais.save();
      
      return res.status(201).json(
      {  
         data_send: newPais,         
         num_status:0,
         msg_status: 'Country created successfully.'
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
      const { pais, nombre, zonahoraria, bandera, idioma, moneda } = req.body;

      // Find the pais by Id
      const pa = await Pais.findById(id);

      if (!pa) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'Pais not found'
         });
      }

      // Update the pais properties
      pa.nombre = nombre.toUpperCase();            
      pa.zonahoraria = zonahoraria.toUpperCase();
      pa.bandera = bandera.toLowerCase();
      pa.idioma = idioma.toUpperCase();
      pa.moneda = moneda.toUpperCase();
      
      

      // Save the updated pais
      await pa.save();

      return res.status(200).json({
         data_send: {"nombre": pa.nombre,
                     "activo": pa.activo,
                     "zonahoraria": pa.zonahoraria,
                     "bandera": pa.bandera,
                     "idioma": pa.idioma,
                     "moneda": pa.moneda
         },
         num_status: 0,
         msg_status: 'Pais updated successfully'
      });
   } catch (error) {
      return res.status(500).json({
         data_send: "",
         num_status: 501,
         msg_status: 'There was a problem trying to modify the country, try again later (pais)'+error         
      })
   }
}

export const deletePais = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;

      // Find the user by id and Delete the pais
      
      const user = await Pais.findByIdAndDelete(id);

      if (!user) {
         return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'Pais not found'
         });
      }else{
         return res.status(200).json({
            //data_send:user,
            num_status: 0,
            msg_status: 'Pais deleted successfully'
         });
      }
                  
   } catch (error) {
      return res.status(500).json({
         message: error
      });
   }
}
