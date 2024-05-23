import express, { Request, Response } from "express";
import User from "../models/users.model";
import Club from "../models/club.model";
import SolicitudMembresia from "../models/solicitudMembresia.model";
import { where } from "sequelize";
import { Op } from "sequelize";
import Notificacion from "../models/notificacion.model";

export const getListNotidificacion = async (req: Request, res: Response): Promise<Response> => {

    const { pag, id } = req.params;
    let where = {}

    const notificaciones = await Notificacion.findAll({
            where: {userId:id},
            offset: (pag) ? (parseInt(pag) - 1) * 5 : 1, limit: 10,
            order: [
                ['leida', 'ASC'],
                ['createdAt', 'ASC']
            ],
        }
    )


    try {

        const notificiacionesNoLeidas = await Notificacion.count({
            where: { userId: id, leida:false } 
            }
        )

        return res.status(200).json({
            data_send: { notificaciones, notificiacionesNoLeidas },
            num_status: 1,
            msg_status: 'completado'
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }

}

export const getnotificacion = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const notificacion = await Notificacion.findOne(
        {
            where:{id:id}
        })

    if (!notificacion) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'club no Encontrado'
        });
    }


    try {
        return res.status(201).json(
            {
                data_send: notificacion,
                num_status: 0,
                msg_status: 'club Actualizado correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const create = async (req: Request, res: Response): Promise<Response> => {

    const { userId, cuerpo, titulo, link } = req.body;

    if (!userId || !cuerpo || !titulo) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'El campos userId, cuerpo, titulo son obligatorio'
        })
    }


    const notificacion = new Notificacion({

    });

    try {

        await notificacion.save();

        return res.status(201).json(
            {
                data_send: notificacion,
                num_status: 0,
                msg_status: 'notificacion creado correctamente.'
            });

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}