import express, { Request, Response } from "express";
import Torneo from "../models/torneo.model";
import User from "../models/users.model";
import AtletasTorneos from "../models/atletasTorneos.model";
import PremiosTorneos from "../models/premioTorneo.model";

export const getListTorneo = async (req: Request, res: Response): Promise<Response> => {
    const torneos = await Torneo.findAll()
    try {

        return res.status(201).json(torneos);
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }

}

export const getTorneo = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const torneo = await Torneo.findOne({ where: { id: id }, include: [User, PremiosTorneos] })
    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no Encontrado'
        });
    }

    try {

        return res.status(201).json(
            {
                data_send: torneo,
                num_status: 0,
                msg_status: 'Torneo Actualizado correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const create = async (req: Request, res: Response): Promise<Response> => {

        const { nombre, ubicacion, puntos, rondas, publico, 
            sistema, arbitro, minutos, segundos, premios } = req.body;
        
        if (!nombre || !ubicacion || !puntos || !rondas || !sistema ){

            return res.status(409).json({
                data_send: "",
                num_status: 1,
                msg_status: 'Los campos nombre, ubicacion, puntos, rondas, sistema son obligatorios'
            })
        }
        
        if(arbitro && arbitro.id){
            const user = await User.findOne({ where: { id: arbitro.id } })
            if (!user) {
                return res.status(404).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'arbitro not found'
                });
            }
        }

        let minutosAsegundos = (minutos)? minutos*60 : 0

        let duracionSegundos = segundos + minutosAsegundos

        const torneo = new Torneo({
            nombre,
            ubicacion,
            puntos,
            rondas,
            sistema,
            publico,
            arbitro,
            duracionSegundos
        });

    try {
  
        await torneo.save();

        let arregloDepremios = premios.map((a: any) => { return { torneoId: torneo.id, descripcion: a.descripcion } })
        await PremiosTorneos.bulkCreate(arregloDepremios)

        return res.status(201).json(
            {
                data_send: torneo,
                num_status: 0,
                msg_status: 'Torneo creado correctamente.'
            });
        
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
    
    const { id } = req.params;

    const { nombre, ubicacion, puntos, rondas, publico, sistema, arbitro, minutos, segundos } = req.body;

    const torneo = await Torneo.findOne({where: {id:id}})

    if(!torneo){
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no Encontrado'
        });
    }

    let minutosAsegundos = (minutos) ? minutos * 60 : 0

    let duracionSegundos = (segundos ? segundos:0) + minutosAsegundos
    
    torneo.nombre = (nombre)? nombre: torneo.nombre
    torneo.ubicacion = (ubicacion)? ubicacion: torneo.ubicacion
    torneo.puntos = (puntos)? puntos: torneo.puntos
    torneo.rondas = (rondas)? rondas: torneo.rondas
    torneo.publico = (publico)? publico: torneo.publico
    torneo.sistema = (sistema)? sistema: torneo.sistema
    torneo.arbitro = (arbitro)? arbitro: torneo.arbitro
    torneo.duracionSegundos = duracionSegundos

    try {
        await torneo.save()

        return res.status(201).json(
            {
                data_send: torneo,
                num_status: 0,
                msg_status: 'Torneo Actualizado correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const addAtletas = async (req: Request, res: Response): Promise<Response> => {
    
    const { id } = req.params;
    const {  atletas } = req.body;

    const torneo = await Torneo.findOne({ where: { id: id } })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no encontrado'
        });       
    }

    let arregloDeAtletas = atletas.map((a:any) => { return { torneoId: id, userId:a}})

    try {
        await AtletasTorneos.bulkCreate(arregloDeAtletas)

        return res.status(201).json(
            {
                data_send: torneo,
                num_status: 0,
                msg_status: 'Torneo Actualizado correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }


}



