/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir el model de estados
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/


import { Schema, model, Document, ObjectId } from "mongoose";
import {estadoSchema} from "../schemas/estados.schema";

export interface IEstado extends Document {
   pais: string,
   paisid: Schema.Types.ObjectId,
   estado: string,
   nombre: string,   
   timezone: string,
   offset_timezone: number,
   activo: number,
   createdAt: Date,
   updateAt: Date
}

export default model<IEstado>('Estado', estadoSchema);