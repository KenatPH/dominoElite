import express, { Request, Response } from "express";
import Torneo from "../models/torneo.model";
import User from "../models/users.model";
import AtletasTorneos from "../models/atletasTorneos.model";
import PremiosTorneos from "../models/premioTorneo.model";
import Partida from "../models/partida.model";
import JugadorPartida from "../models/jugadorPartida.model";
import Club from "../models/club.model";
import ColaNotificaciones from "../models/colaNotificaciones.model";
import { where } from "sequelize";

export const getListTorneo = async (req: Request, res: Response): Promise<Response> => {
    const torneos = await Torneo.findAll({where:{ publico: true}})
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
        
        if ( !ubicacion || !puntos || !rondas || !sistema ){

            return res.status(409).json({
                data_send: "",
                num_status: 1,
                msg_status: 'Los campos  ubicacion, puntos, rondas, sistema son obligatorios'
            })
        }
        
        let arbitroDB = null
        if(arbitro && arbitro.id){
            const arbitroDB = await User.findOne({ where: { id: arbitro.id } })
            if (!arbitroDB) {
                return res.status(404).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'arbitro not found'
                });
            }

            await ColaNotificaciones.create({ tipo: 'esArbitro', userId: arbitro.id, contexto: JSON.stringify({ email: arbitroDB?.email, nombreTorneo: nombre }) })
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
            arbitro: (arbitroDB)? arbitro.id:null ,
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

    let arbitroDB = null
    if (arbitro && arbitro.id) {
        const arbitroDB = await User.findOne({ where: { id: arbitro.id } })
        if (!arbitroDB) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'arbitro not found'
            });
        }
    }

    let minutosAsegundos = (minutos) ? minutos * 60 : 0

    let duracionSegundos = (segundos ? segundos:0) + minutosAsegundos
    
    torneo.nombre = (nombre)? nombre: torneo.nombre
    torneo.ubicacion = (ubicacion)? ubicacion: torneo.ubicacion
    torneo.puntos = (puntos)? puntos: torneo.puntos
    torneo.rondas = (rondas)? rondas: torneo.rondas
    torneo.publico = (publico)? publico: torneo.publico
    torneo.sistema = (sistema)? sistema: torneo.sistema
    torneo.arbitro = (arbitroDB)? arbitro.id : torneo.arbitro
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

    
    try {
        let arregloDeAtletasTorneo:any[] = []
        let arregloDeAltetasNotif:any[] = []
        // let arregloDeAtletasTorneo = atletas.map((a: any) => { return { torneoId: id, userId: a } })
        // let arregloDeAltetasNotif = atletas.map((a: any) => { return { tipo: 'invitacionTorneo', userId: a, contexto: JSON.stringify({ torneoNombre: torneo.nombre }) } })

        const users = await User.findAll({ where: { id: atletas } })
    
        users.forEach(async (user) => {
    
            if (!user){
                return res.status(404).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'usuario no encontrado'
                });      
            }
    
            arregloDeAtletasTorneo.push({ torneoId: id, userId: user.id })
            arregloDeAltetasNotif.push({ tipo: 'invitacionTorneo', userId: user.id, contexto: JSON.stringify({ torneoNombre: torneo.nombre, email:user.email }) })
            
        });
    


        await AtletasTorneos.bulkCreate(arregloDeAtletasTorneo)

        await ColaNotificaciones.bulkCreate(arregloDeAltetasNotif)

        return res.status(201).json(
            {
                data_send: torneo,
                num_status: 0,
                msg_status: 'atletas agregados con con exito.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }


}

//TODO eliminar atletas

export const generarPartidasTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const {  mesas } = req.body;

    if (!id || !mesas) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos id, mesas son obligatorios'
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
            torneoId: id
        });

        await partida.save()

        mesa.jugadores.forEach(async(jugador: any) => {

            const JP = new JugadorPartida({
                partidaId: partida.id,
                userId: jugador,
                mesa: mesa.nombre
            })

            await JP.save()

            await ColaNotificaciones.create({ tipo: 'mesaEnTorneo', userId: jugador, contexto: JSON.stringify({ mesa: mesa.nombre }) })

        });

    });


    const partidas = await Partida.findAll({
        where: { torneoId: id },
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

//TODO eliminar partidas


