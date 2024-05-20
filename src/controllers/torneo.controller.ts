import express, { Request, Response } from "express";
import Torneo from "../models/torneo.model";
import User from "../models/users.model";
import AtletasTorneos from "../models/atletasTorneos.model";
import PremiosTorneos from "../models/premioTorneo.model";
import Partida from "../models/partida.model";
import JugadorPartida from "../models/jugadorPartida.model";
import Club from "../models/club.model";
import ColaNotificaciones from "../models/colaNotificaciones.model";
import { Op, Sequelize, where } from "sequelize";
import { emparejamiento } from "../classes/emparejamientosTorneo.class";
import { io } from "socket.io-client";
import config from "../config/config";

export const getListTorneo = async (req: Request, res: Response): Promise<Response> => {
    const torneos = await Torneo.findAll({
        where: { publico: true },
         order: [
            ['updatedAt', 'DESC'],
        ],
    })
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
            sistema, arbitro, minutos, segundos, premios, fecha, entrada } = req.body;
        
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

            await ColaNotificaciones.create({ tipo: 'esArbitro', userId: arbitro.id, contexto: JSON.stringify({ email: arbitroDB?.email, telefono: arbitroDB?.telefono, nombreTorneo: nombre }) })
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
            entrada,
            fecha,
            arbitro: (arbitroDB)? arbitro.id:null ,
            duracionSegundos,
            clubId: (clubDB)? club.id:null,
            
        });

    try {
  
        await torneo.save();

        if(premios){

            let arregloDepremios = premios.map((a: any) => { return { torneoId: torneo.id, descripcion: a } })
            await PremiosTorneos.bulkCreate(arregloDepremios)
        }

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

    const { nombre, ubicacion, puntos, rondas, publico, sistema, arbitro, minutos, segundos, fecha, entrada } = req.body;

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
    torneo.nombre = (fecha) ? fecha : torneo.fecha
    torneo.nombre = (entrada) ? entrada : torneo.entrada
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

    const torneo = await Torneo.findOne({
        where: { id: id }, include: [
            { model: User, as: 'atletas', attributes: ['id', 'nombre'] }
        ]
    })

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

        const jugadores = torneo.atletas.map((j) => { return j.id })

        const users = await User.findAll({ where: {  id: { [Op.notIn]: jugadores, [Op.in]: atletas },  } })
    
        users.forEach(async (user) => {
    
            arregloDeAtletasTorneo.push({ torneoId: id, userId: user.id })
            arregloDeAltetasNotif.push({ tipo: 'invitacionTorneo', userId: user.id, contexto: JSON.stringify({ torneoNombre: torneo.nombre, email: user.email, telefono: user.telefono }) })
            
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

export const addAtletasAsistentes = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { atletas } = req.body;

    if (!id || !atletas) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos id, atletas son obligatorios'
        })
    }

    const torneo = await Torneo.findOne({
        where: { id: id }
    })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no encontrado'
        });
    }


    try {


        const users = await AtletasTorneos.findAll({ where: { torneoId:id ,userId: { [Op.in]: atletas }, } })

        users.forEach(async (user) => {

           user.asistente = true
           await user.save()

        });

        
        return res.status(201).json(
            {
                data_send: users,
                num_status: 0,
                msg_status: 'atletas asistentes marcados con con exito.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }


}

export const iniciarTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const torneo = await Torneo.findOne({
        where: { id: id }
    })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {
        let data = { gameId: id, action: "initGame", time: torneo.duracionSegundos }; // ID de la partida a la que te quieres unir

        const urlSocket = config.WS.HOST + ':' + config.WS.PORT

        var socket = io(urlSocket);

        socket.emit('joinGame', data);

    } catch (error) {
        console.log(error);

    }


    return res.status(201).json(
        {
            data_send: "torneo Iniciado",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

export const pausarTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const torneo = await Torneo.findOne({
        where: { id: id }
    })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {
        let data = { gameId: id, action: "pauseGame", time: torneo.duracionSegundos }; // ID de la partida a la que te quieres unir

        const urlSocket = config.WS.HOST + ':' + config.WS.PORT

        var socket = io(urlSocket);

        socket.emit('joinGame', data);

    } catch (error) {
        console.log(error);

    }


    return res.status(201).json(
        {
            data_send: "torneo pausado",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

export const reanudarTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const torneo = await Torneo.findOne({
        where: { id: id }
    })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {
        let data = { gameId: id, action: "resumeGame" }; // ID de la partida a la que te quieres unir

        const urlSocket = config.WS.HOST + ':' + config.WS.PORT

        var socket = io(urlSocket);

        socket.emit('joinGame', data);

    } catch (error) {
        console.log(error);

    }


    return res.status(201).json(
        {
            data_send: "torneo continua",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

// editarpremios

//TODO eliminar atletas

export const generarPartidasTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    if (!id ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos id, mesas son obligatorios'
        })
    }

    const torneo = await Torneo.findOne({
        where: { id: id }
    })

    if (!torneo) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'torneo no encontrado'
        });
    }

    const partidasActivas =  await Partida.findAll({
        where: { torneoId: id, estatus: 'activo' },
        attributes: ["id"],
        include: [
            { model: User, as: 'jugadores', attributes: ['id'] }
        ]
    })


    if (partidasActivas.length > 0) {
        return res.status(402).json({
            data_send: partidasActivas,
            num_status: 6,
            msg_status: 'torneo ya tiene partidas activas'
        });
    }

    try {

        const atletas = await AtletasTorneos.findAll({
            where: { torneoId: id, asistente: true }, include: [
                { model: User,  attributes: ['id', 'nombre', 'email', 'telefono'] }
            ] } )

        // console.log(atletas);
        
        const mesas = agruparEnMesas(atletas,4)

        // console.log(mesas);
        
        
        mesas.forEach(async(users:any,i) => {
            
            const partida = new Partida({
                sistema: torneo.sistema,
                tipo: "torneo",
                torneoId: id,
                mesa: i
            });
    
            await partida.save()
    
    
            // arreglos para hacer bulkCreate
            const toCreatePartida = users.map((u: any) => { return { partidaId: partida.id, userId: u.atleta.id, mesa: i } })
    
            const toColaNotificacion = users.map((u: any) => { return { tipo: 'mesaEnTorneo', userId: u.atleta.id, contexto: JSON.stringify({ mesa: i, email: u?.email, telefono: u?.telefono }) } })
    
            // crea todas las relaciones con la partida en BD
            await JugadorPartida.bulkCreate(toCreatePartida)
            
            // // envia las notificaciones
            await ColaNotificaciones.bulkCreate(toColaNotificacion)
    
    
        });
    
    
        const partidas = await Partida.findAll({
            where: { torneoId: id },
            include: [
                { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
            ] 
        }).then(()=>{

        })
        return res.status(201).json(
            {
                data_send: "",
                num_status: 0,
                msg_status: 'Torneo Actualizado correctamente.'
            }
        );
    
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message: error
        });
    }
    

}


export const generarRondaTorneo = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const partidasActivas = await Partida.findAll({
        where: { torneoId: id, estatus: 'activo' },
        attributes: ["id"],
        include: [
            { model: User, as: 'jugadores', attributes: ['id'] }
        ]
    })


    if (partidasActivas.length > 0) {
        return res.status(402).json({
            data_send: partidasActivas,
            num_status: 6,
            msg_status: 'torneo ya tiene partidas activas'
        });
    }

    try {
        
        let e = new emparejamiento(id)
        await e.init()
        
        
        return res.status(201).json(
            {
                data_send: e.partidascreadas,
                num_status: 0,
                msg_status: 'Torneo Actualizado correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                data_send: error,
                num_status: 0,
                msg_status: 'error inesperado'
            }
        );
    }


}

//TODO eliminar partidas


function agruparEnMesas(jugadores:any, jugadoresPorMesa:any) {
    const mesas = [];
    let mesaActual = [];

    for (const jugador of jugadores) {
        mesaActual.push(jugador);

        if (mesaActual.length === jugadoresPorMesa) {
            mesas.push(mesaActual);
            mesaActual = [];
        }
    }

    // Si quedan jugadores sin asignar a mesas completas
    if (mesaActual.length > 0) {
        mesas.push(mesaActual);
    }

    return mesas;
}


