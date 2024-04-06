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

export const paisSchema = new Schema ({
   pais: {
      type: String,
      required: true
   },
   nombre: {
      type: String,
      required: true
   },
   bandera: {
      type: String,
      required: false
   },
   moneda: {
      type: String,
      required: true
   },
   zonahoraria: {
      type: String,      
   },
   idioma: {
      type: String,      
   },
   /* gps: {
      type: {
         type: String,
         enum: ['Point'],
         required: false
       },
   }, */
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
