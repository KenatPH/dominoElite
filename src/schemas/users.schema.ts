/*
  Aplicación      : Api de Dominó
  Módulo          : Archivo para definir el schema de usuario
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Dominó
*/

/* import { Schema, model, Document } from "mongoose";

const  bcrypt = require("bcryptjs");
const userSchema = new Schema({
   name: {
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
   password: {
      type: String,
      required: [true, 'La contraseña es necesaria']
   },
   phone: {
      type: String,
      required: [true, 'La contraseña es necesaria']
   },
   avatar: {
      type: String,
      default: 'av-1.png'
   },
   perfil: {
      type: String,
      default: 'USER_ROLE'   
   }
});

userSchema.pre('save', async function(next) {
   const user = this;
   //si no modifica password no vuelve a hacer el hash del passw
   if (!user.isModified('password')) return next();
         
   await bcrypt.genSalt(10, (err: Error, salt: "Strimg") => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err: Error, hash: "String") => {
         if (err) return next(err);
         user.password = hash;
         next();
      });
   });
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean>{
   return await bcrypt.compare(password, this.password);
}

export default model('User', userSchema); */