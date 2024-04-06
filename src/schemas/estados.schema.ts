/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir el schema de paises
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Schema, Document } from "mongoose";

export const estadoSchema = new Schema ({
   pais: {
      type: String,
      required: true
   },
   paisid: {
      type: Schema.Types.ObjectId,
      ref: 'Pais'
    },
   estado: {
      type: String,
      required: true
   },
   nombre: {
      type: String,
      required: true
   },      
   timezone: {
      type: String,      
   },
   offset_timezone: {
      type: Number,
      default: -18000
   },
   activo: {
      type: Number,
      default:1
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   updateAt: {
      type: Date,
      default: Date.now
   }
   
   
});
