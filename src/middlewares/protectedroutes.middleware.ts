import express, { Request, Response } from "express";
import {Strategy, ExtractJwt, StrategyOptions}  from 'passport-jwt'
import config from '../config/config'
import  User  from '../models/users.model'

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET
};

export default new Strategy(opts, async (payload, done) => {
   try {
      console.log('data: ',JSON.stringify(payload))
      console.log('id: ',payload.data.id)
      const user = await User.findOne({ where: { id: payload.data.id }});
      if(user) {
         console.log('usuario autenticado');
         return done(null, user);
      }
      return done(null, false);     
   } catch (error) {
      console.log(error);
   }   
})
