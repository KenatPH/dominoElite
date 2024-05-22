import express, { Request, Response } from "express";
import User from "../models/users.model";
import Club from "../models/club.model";
import SolicitudMembresia from "../models/solicitudMembresia.model";
import { where } from "sequelize";
import { Op } from "sequelize";

export const getListClub = async (req: Request, res: Response): Promise<Response> => {

    const { pag, filtro } = req.params;
    let where = {}

    // console.log(filtro);
    

    if(filtro){
        where = { nombre: {[Op.like]: `%${filtro}%`} }
    }

    const clubes = await Club.findAndCountAll({
            where:where,
            offset: (pag) ? parseInt(pag) : 0, limit: 30 
        }
    )

    


    try {

        return res.status(200).json({
            data_send: clubes,
            num_status: 1,
            msg_status: 'completado'
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }

}

export const getClub = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const club = await Club.findOne(
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
        if (!club) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'club no Encontrado'
            });
        }
    const solicitudes = await SolicitudMembresia.findAll({
        where: { clubId: id, estatus: 'En espera' }, attributes:['id','estatus'], include: [
            {
                model: User,
                attributes: [ "id",'nombre']
            }
        ]
    })

    try {
        return res.status(201).json(
            {
                data_send: { club, solicitudes },
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

    const { nombre, descripcion, imagen } = req.body;

    if (!nombre) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'El campos nombre es obligatorio'
        })
    }


    const club = new Club({
        nombre,
        descripcion,
        imagen
    });

    try {

        await club.save();

        return res.status(201).json(
            {
                data_send: club,
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

    const { nombre, descripcion, imagen } = req.body;


    const club = await Club.findOne({ where: { id: id } })

    if (!club) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'club no Encontrado'
        });
    }



    club.nombre = (nombre) ? nombre : club.nombre
    club.descripcion = (descripcion) ? descripcion : club.descripcion
    club.imagen = (imagen) ? imagen : club.imagen


    try {
        await club.save()

        return res.status(201).json(
            {
                data_send: club,
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

export const createSolicitud = async (req: Request, res: Response): Promise<Response> => {

    const { userId, clubId } = req.body;

    if (!userId || !clubId) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'El campos nombre es obligatorio'
        })
    }

    const solMem = new SolicitudMembresia({
        userId,
        clubId
    });

    try {

        await solMem.save();

        return res.status(201).json(
            {
                data_send: solMem,
                num_status: 0,
                msg_status: 'club creado correctamente.'
            });

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }


}

export const updateSolicitud = async (req: Request, res: Response): Promise<Response> => {
    
    const { id, estatus } = req.params;

    const solMem = await SolicitudMembresia.findOne({ where: { id: id } })

    if (!solMem) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'solicitud no Encontrada'
        });
    }

    if (estatus == 'aceptar' || estatus == 'rechazar'){

        solMem.estatus = (estatus == "aceptar") ? "Aceptada" : "Rechazada"
        
        
        try {          
            if (estatus == "aceptar"){
                const user = await User.findOne({ where: { id: solMem.userId } })
                if (!user){
                    return res.status(404).json({
                        data_send: "",
                        num_status: 6,
                        msg_status: 'usuario no Encontrado'
                    });
                }
                user.clubId = solMem.clubId
                await user.save()
            }  
            await solMem.save()
    
            return res.status(201).json(
                {
                    data_send: solMem,
                    num_status: 0,
                    msg_status: 'solicitud aceptada correctamente.'
                }
            );
        } catch (error) {
            return res.status(500).json({
                message: error
            });
        }
        

    }else{
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'valor de estatus invalido'
        });
    }



}
