/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir el model de paises
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/


import { Schema, model, Document } from "mongoose";
import { paisSchema } from "../schemas/paises.schema";
import {estadoSchema} from "../schemas/estados.schema";

export interface IPais extends Document {
   pais: string,
   nombre: string,
   bandera: string,
   moneda: string,
   zonahoraria: string,
   idioma: string,
   activo: number,
   createdAt: Date,
   updateAt:Date
}

export default model<IPais>('Pais', paisSchema);