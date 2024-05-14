import express, { Request, Response } from "express";
import SubscripcionesPush from "../models/subscripcionesPush.model";
import { NotificacionPush } from "../classes/NotificacionPush.Class";
import User from "../models/users.model";



export const suscribe = async (req: Request, res: Response): Promise<Response> => {

    const { userId, subscription } = req.body;

    if (!userId || !subscription) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'El campos userId, subscription es obligatorio'
        })
    }

    const [subs, created] = await SubscripcionesPush.upsert({ 
        id: userId ,
        subscription: JSON.stringify(subscription)
    });


    try {


        if (created) {
            return res.status(201).json(
                {
                    data_send: 'suscripcion exitosa',
                    num_status: 0,
                    msg_status: 'club creado correctamente.'
                }); 
        }


        return res.status(201).json(
            {
                data_send: 'suscripcion encontrada',
                num_status: 0,
                msg_status: 'club creado correctamente.'
            });

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const enviarNotificacion = async (req: Request, res: Response): Promise<Response> => {

    const { userId } = req.body;
    if(!userId){
        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'El campos userId es obligatorio'
        })
    }
    const user = await User.findOne({ where:{id:userId}}) 

    const NotPus = new NotificacionPush(userId, 'invitacionTorneo', JSON.stringify({ email: 'krtabares@gmail.com', torneoNombre:"Gran torneo" })  )

    NotPus.enviarNotificacion()

    return res.status(201).json(
        {
            data_send: 'suscripcion encontrada',
            num_status: 0,
            msg_status: 'club creado correctamente.'
        });


}