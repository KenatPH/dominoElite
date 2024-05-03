import { Request, Response } from "express";

import Partida from "../models/partida.model";
import User from "../models/users.model";
import Torneo from "../models/torneo.model";
import JugadorPartida from "../models/jugadorPartida.model";
import { Sequelize } from 'sequelize-typescript';
import { Op } from "sequelize";
import { io } from "socket.io-client";
import config from "../config/config";


export const getListPartida = async (req: Request, res: Response): Promise<Response> => {
    const { torneo } = req.params;
        let partidas 
    if (torneo){
        partidas = await Partida.findAll({ where: { torneoId: torneo }, include: [{ model: User, as: 'ganador1Info' }, { model: User, as: 'ganador2Info' }] })
    }else
        partidas = await Partida.findAll({ include: [{ model: User, as: 'ganador1Info' }, { model: User, as: 'ganador2Info' }] })

    try {
        return res.status(201).json(partidas);
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getPartida = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const partida = await Partida.findOne({ 
        where: { id: id },
        include: [
            { model: User, as: 'ganador1Info' },
            { model: User, as: 'ganador2Info' },
            { model: User, as: 'jugadores', attributes:['id','nombre'] }
        ]
    })
    if(!partida){
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }

    try {

        return res.status(201).json(
            {
                data_send: partida,
                num_status: 0,
                msg_status: 'partida obtenida correctamente.'
            }
        );
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const create = async (req: Request, res: Response): Promise<Response> => {

    const { sistema, cantidadJugadores, tipo, torneo, jugadores, minutos, segundos  } = req.body;

    if (!cantidadJugadores || !jugadores || !sistema ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "cantidad de jugadores, jugadores" son obligatorios'
        })
    }

    let torneoDB = null
    if ( tipo != 'local' && torneo && torneo.id) {
         torneoDB = await Torneo.findOne({ where: { id: torneo.id } })
        if (!torneoDB) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'torneo not found'
            });
        }
    }

    try {
        let jugadoresResult: JugadorPartida[] = []

        let minutosAsegundos = (minutos) ? minutos * 60 : 0

        let duracionSegundos = ((segundos) ? segundos : 1200 ) + minutosAsegundos
    
        if (jugadores.length > 0){

            if (cantidadJugadores != jugadores.length){
                return res.status(409).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'verifique la cantidad de jugadores y los jugadores'
                });
            }

            const partida = new Partida({
                sistema, cantidadJugadores, duracionSegundos,  tipo, torneo: (torneo && torneo.id) ? torneo.id:null
            });

            partida.save()

            
            jugadores.forEach(async (j:any)=> {

                const JP = new JugadorPartida({
                    partidaId: partida.id,
                    userId:j
                })

                JP.save()

                jugadoresResult.push(JP)
            });

        }else{
            return res.status(409).json({
                data_send: "",
                num_status: 6,
                msg_status: 'Debe seleccionar al menos un jugador'
            });
        }

        return res.status(201).json(
            {
                data_send: jugadoresResult,
                num_status: 0,
                msg_status: 'Partida creada correctamente.'
            });

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const asignaJugadorAPartida = async (req: Request, res: Response): Promise<Response> => {
    const { partidaId, jugadores } = req.body;

    if (!partidaId || !jugadores ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "id partida, jugadores" son obligatorios'
        })
    }

    const partida = await Partida.findOne({
        where: { id: partidaId },
        include: [{
            model: User, as: 'jugadores', attributes: ['id', 'nombre']
        }]
    })

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }

    // falta validar cantidad de jugadores
    if (partida.jugadores.length === partida.cantidadJugadores){
        return res.status(409).json({
            data_send: "",
            num_status: 6,
            msg_status: 'no puede agregar mas jugadores a esta partida'
        });
    }

    let puestosFaltantes = partida.cantidadJugadores - partida.jugadores.length

    jugadores.forEach(async (id:String) => {
        if(!puestosFaltantes){
            return
        }
        if(!partida.jugadores.find(jugador => jugador.id === id)){

            const JP = new JugadorPartida({
                partidaId: partidaId,
                userId: id
            })
            await JP.save()
            puestosFaltantes--
        }

    });

    return res.status(201).json(
        {
            data_send: "",
            num_status: 0,
            msg_status: 'Exito.'
        });

}

export const resultadoPartida = async (req: Request, res: Response): Promise<Response> => {

    const { partidaId, ganador1, ganador2, puntajes } = req.body;

    if (!partidaId || !ganador1) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "id partida, ganador1" son obligatorios'
        })
    }

    const partida = await Partida.findOne({
        where: { id: partidaId }
    })

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    // valida si los ganadores estan jugando en esta partida
    const ganador1BD = await JugadorPartida.findOne({ where: { userId: ganador1, partidaId: partidaId }})

    if (!ganador1BD) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'jugador asignado como ganador1 no existe en esta partida'
        });
    }else{
        ganador1BD.resultado = 'ganado'
        ganador1BD.save()
    }

    if (ganador2){

        const ganador2BD = await JugadorPartida.findOne({ where: { userId: ganador1, partidaId: partidaId } })
    
        if (!ganador2BD) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'jugador asignado como ganador2 no existe en esta partida'
            });
        }else{
            ganador2BD.resultado = 'ganado'
            ganador2BD.save()
        }
    }


    partida.ganador1 = ganador1
    partida.ganador2 = (ganador2) ? ganador2 : partida.ganador2
    partida.estatus = "Finalizado"
    
    try {

        await partida.save()

        return res.status(201).json(
            {
                data_send: "",
                num_status: 0,
                msg_status: 'Exito.'
            });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }


}

export const rankingJugador = async (req: Request, res: Response): Promise<Response> => {

    let { tipo } = req.params;

    let selectClausule = ''

    if(!tipo){
        selectClausule = `AND (p.tipo = 'torneo') `
    }else{
        selectClausule = `AND p.tipo = '${tipo}'  `
    }

    const users = await User.findAll({
        attributes:  [
            'id',
            'nombre',
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` ' + selectClausule +' )'), 'partidasJugadas'],
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'ganado\' ' + selectClausule +'  )'), 'partidasGanadas'],
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'perdido\' ' + selectClausule +'  )'), 'partidasPerdidas'],
            [Sequelize.literal('averageGanadas(\`User\`.\`id\`, \'' + tipo +'\')'), 'average']
        ],
        having: [
            Sequelize.where(Sequelize.literal("partidasJugadas"), { [Op.gt]: 0 })
        ]
    }) 
    

    return res.status(201).json(
        {
            data_send: users,
            num_status: 0,
            msg_status: 'Exito.'
        });
}

export const iniciarPartida = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const partida = await Partida.findOne({
        where: { id: id }
    })

    let data = { gameId: id, action: "playGame", time: partida?.duracionSegundos }; // ID de la partida a la que te quieres unir

    var socket = io(config.WS.HOST + ':'+config.WS.PORT);

    socket.emit('joinGame', data);

    return res.status(201).json(
        {
            data_send: "",
            num_status: 0,
            msg_status: 'Exito.'
        });
}


