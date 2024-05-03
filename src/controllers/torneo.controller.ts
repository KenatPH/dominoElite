import express, { Request, Response } from "express";
import Torneo from "../models/torneo.model";
import User from "../models/users.model";
import AtletasTorneos from "../models/atletasTorneos.model";
import PremiosTorneos from "../models/premioTorneo.model";
import Partida from "../models/partida.model";
import JugadorPartida from "../models/jugadorPartida.model";
import Club from "../models/club.model";

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
    const torneo = await Torneo.findOne({ 
        where: { id: id },
        include: [
            { model: User, as: 'atletas', attributes: ['id', 'nombre'] },
             PremiosTorneos
        ] 
    })
    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no Encontrado'
        });
    }

    const partidas = await Partida.findAll({
        where: { torneoId: id },
        include: [
            { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
        ]
    })

    try {

        return res.status(201).json(
            {
                data_send: { torneo, partidas },
                num_status: 0,
                msg_status: 'Torneo obtenido correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const create = async (req: Request, res: Response): Promise<Response> => {

        const { nombre, ubicacion, puntos, rondas, publico, club,
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
    let clubDB = null
        if (club && club.id) {
            clubDB = await Club.findOne({ where: { id: club.id } })
            if (!clubDB) {
                return res.status(404).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'club not found'
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
            duracionSegundos,
            clubId: (clubDB)? club.id:null
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
    const { atletas } = req.body;

    if (!id || !atletas ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos id, atletas son obligatorios'
        })
    }

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

export const generarPartidasTorneo = async (req: Request, res: Response): Promise<Response> => {

    const {  torneoId, mesas } = req.body;

    if (!torneoId || !mesas) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos torneoId, mesas son obligatorios'
        })
    }

    const torneo = await Torneo.findOne({ where: { id: torneoId } })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no encontrado'
        });
    }


    if(!mesas && !mesas.length){
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'parametro mesas requerido'
        });
    }
    

    mesas.forEach(async(mesa:any) => {
        
        const partida = new Partida({
            sistema: torneo.sistema,
            tipo: "torneo",
            torneoId: torneoId
        });

        await partida.save()

        mesa.jugadores.forEach((j: any) => {

            const JP = new JugadorPartida({
                partidaId: partida.id,
                userId: j
            })

            JP.save()
        });

    });


    const partidas = await Partida.findAll({
        where: { torneoId: torneoId },
        include: [
            { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
        ] 
    })

    return res.status(201).json(
        {
            data_send: partidas,
            num_status: 0,
            msg_status: 'Torneo Actualizado correctamente.'
        }
    );
}


