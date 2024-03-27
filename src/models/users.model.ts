/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir el schema de usuario
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
   nombre: string,
   email: string,
   telefono: string, 
   clave: string, 
   status: string, 
   origen: string, 
   tokenFacebook: string,
   tokenGoogle: string, 
   perfil: string,
   comparePassword: (clave: string) => Promise<boolean>;
}

const  bcrypt = require("bcryptjs");

const userSchema = new Schema({
   nombre: {
      type: String,
      required: [true, 'El nombre es requerido']
   },
   email: {
      type: String,
      unique: true,
      required: [true, 'El correo es requerido'],
      lowercase: true,
      trim: true
   },
   clave: {
      type: String,
      required: [true, 'La contraseña es necesaria']
   },
   telefono: {
      type: String,
      required: [true, 'La contraseña es necesaria']
   },
   status: {
      type: String,
      default: 'activo'
   },
   origen: {
      type: String, //(google, facebook)
      default: 'local'
   },
   tokenFacebook:{
      type: String
   },
   tokenGoogle:{
      type: String
   }, 
   perfil: { //status validos: admin,club, atleta
      type: String,
      default: 'atleta'   
   }
});

userSchema.pre<IUser>('save', async function(next) {
   const user = this;
   //si no modifica password no vuelve a hacer el hash del passw
   if (!user.isModified('clave')) return next();

   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(user.clave, salt);
   user.clave = hash;
   
});

userSchema.methods.comparePassword = async function(clave: string): Promise<boolean>{
   return await bcrypt.compare(clave, this.clave);
}

export default model<IUser>('User', userSchema);