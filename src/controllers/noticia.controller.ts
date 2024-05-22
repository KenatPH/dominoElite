import express, { Request, Response } from "express";
import User from "../models/users.model";
import Noticia from "../models/noticia.model";

export const getListNoticia = async (req: Request, res: Response): Promise<Response> => {
    const noticias = await Noticia.findAll()
    try {

        return res.status(201).json(noticias);
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }

}

export const getNoticia = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const noticia = await Noticia.findOne(
        {
            where: { id: id },
            include: [
                {
                    model: User,
                    as: 'atletas',
                    attributes: ['id', 'nombre']
                }
            ]
        })
    if (!noticia) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'noticia no Encontrada'
        });
    }


    try {
        return res.status(201).json(
            {
                data_send: noticia,
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

    const { nombre, descripcion, userId } = req.body;

    if (!nombre || descripcion || userId) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos nombre, descripcion son obligatorios'
        })
    }


    const noticia = new Noticia({
        nombre,
        descripcion,
        userId
    });

    try {

        await noticia.save();

        return res.status(201).json(
            {
                data_send: noticia,
                num_status: 0,
                msg_status: 'club creado correctamente.'
            });

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const { nombre, descripcion } = req.body;


    const noticia = await Noticia.findOne({ where: { id: id } })

    if (!noticia) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'noticia no Encontrada'
        });
    }



    noticia.nombre = (nombre) ? nombre : noticia.nombre
    noticia.descripcion = (descripcion) ? descripcion : noticia.descripcion


    try {
        await noticia.save()

        return res.status(201).json(
            {
                data_send: noticia,
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

