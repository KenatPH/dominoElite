import { Request, Response } from "express";

import Partida from "../models/partida.model";
import User from "../models/users.model";
import Torneo from "../models/torneo.model";
import JugadorPartida from "../models/jugadorPartida.model";
import { Sequelize } from 'sequelize-typescript';
import { Op } from "sequelize";
import { io } from "socket.io-client";
import config from "../config/config";
import ColaNotificaciones from "../models/colaNotificaciones.model";
import Puntuacion from "../models/puntuacion.model";


export const getListPartida = async (req: Request, res: Response): Promise<Response> => {
    
    const { torneo } = req.params;
        let partidas 
    if (torneo){
        partidas = await Partida.findAll({ where: { torneoId: torneo }, 
            include: [
            { model: User, as: 'ganador1Info' },
            { model: User, as: 'ganador2Info' },
            { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
        ] })
    }else
        partidas = await Partida.findAll({ 
            include: [
                { model: User, as: 'ganador1Info' },
                { model: User, as: 'ganador2Info' },
                { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
            ] 
        })

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

    if (!id ) {
        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "id" son obligatorios'
        })
    }

    const partida = await Partida.findOne({ 
        where: { id: id },
        include: [
            // { model: User, as: 'ganador1Info' },
            // { model: User, as: 'ganador2Info' },
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
        
        console.log(partida.tipo,"*********************************************");
        
        let jugadores
        // todo agregar minusculas
        if (partida.tipo == 'Local') {
            jugadores = await JugadorPartida.findAll({ where: { partidaId:id }})
            return res.status(201).json(
                {
                    data_send: { partida, jugadores },
                    num_status: 0,
                    msg_status: 'partida obtenida correctamente.'
                }
            );
        }else{
            return res.status(201).json(
                {
                    data_send: {partida, jugadores:partida.jugadores},
                    num_status: 0,
                    msg_status: 'partida obtenida correctamente.'
                }
            );
        }

    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getpartidaActivaPorUsuario = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    let partidas = await JugadorPartida.findAll({
        where: { userId: userId },
        include: [
            { model: Partida, as: 'partida', where: { estatus:'activo' } }
        ]
    })

    if (partidas.length === 0){
        partidas = await JugadorPartida.findAll({
            include: [
                { model: Partida, as: 'partida', where: { creadorId: userId } }
            ]
        })
    }
   
    try {

        return res.status(201).json(
            {
                data_send: partidas,
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

    const { sistema, tipo, torneo, jugadores, minutos, segundos, puntos, creadorId } = req.body;

    if (  !jugadores || !sistema ) {

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

        let duracionSegundos = ((segundos) ? segundos : 0 ) + minutosAsegundos
    
        if (jugadores.length > 0){


            const partida = new Partida({
                sistema,
                cantidadJugadores: jugadores.length,
                duracionSegundos,
                tipo,
                torneo: (torneo && torneo.id) ? torneo.id:null,
                puntos:puntos,
                anotador: JSON.stringify({ puntajes:[{ equipo1: 0, borrado1: false, equipo2: 0, borrado2: false, info: "" } ], totales:{ equipo1:0, equipo2:0 } }),
                creadorId
            });

            await partida.save()

            
            jugadores.forEach(async (j:any)=> {
                let JP
                // todo agregarminusculas
                if (tipo != 'Local'){

                    JP = new JugadorPartida({
                        partidaId: partida.id,
                        userId:j
                    })
                }else{
                    JP = new JugadorPartida({
                        partidaId: partida.id,
                        userId: null,
                        nombre: j
                    })
                }


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


    if (partida.jugadores.length === 4){
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
        // Verifica si el jugafor existe en la partida y si existe no lo agrega
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

    const { partidaId, ganador1, ganador2, puntajes, firma1,firma2, puntajeGanador, puntajePerdedor } = req.body;
    

    if (!partidaId || !ganador1 || !puntajeGanador ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "id partida, ganador1" son obligatorios'
        })
    }

    const partida = await Partida.findOne({
        where: { id: partidaId , estatus:'activo' },
        include: [
            { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
        ]
    })

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }

    partida.puntajeGanador = puntajeGanador
    partida.puntajePerdedor = puntajePerdedor
    
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
        await ganador1BD.save()

        const u2 =  await User.findOne({ where: { id: ganador1 }})

        if (partida.tipo ==='torneo'){
            guardarpuntaje(ganador1, "ganador")
        }

        await ColaNotificaciones.create({ tipo: 'ganadorPartida', userId: ganador1, contexto: JSON.stringify({ email: u2?.email, telefono:u2?.telefono })})
    }
    // valida si tiene un segundo ganador
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

            const u1 = await User.findOne({ where: { id: ganador2 } })

            if (partida.tipo === 'torneo') {
                guardarpuntaje(ganador2, "ganador")
            }

            await ColaNotificaciones.create({ tipo: 'ganadorPartida', userId: ganador2, contexto: JSON.stringify({ email: u1?.email, telefono: u1?.telefono }) })
        }
    }

    const jugadores = partida.jugadores.map((j) => { return j.id })

    // notificaciones para perdedores
    const perdedores = await User.findAll({
        where:{
            id: { [Op.notIn]: [ganador1, ganador2], [Op.in]: jugadores  },
            
        }
    })

    perdedores.forEach(async(user) => {
        if (partida.tipo === 'torneo') {
            guardarpuntaje(ganador1)
        }
        await ColaNotificaciones.create({ tipo: 'perdedorPartida', userId: user.id, contexto: JSON.stringify({ email: user?.email, telefono: user?.telefono }) })
    });


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

    let { tipo, id } = req.params;

    let selectClausule = ''

    // if(!tipo){
        selectClausule = `AND (p.tipo = 'torneo') `
    // }else{
    //     selectClausule = `AND p.tipo = '${tipo}'  `
    // }
    let where = {}

    if(id){

        const user = await User.findOne({ where: { id: id } });
    
        if (!user) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'User not found'
            });
        }

        where = { id: id }

    }

        // Find the user by userId
    
    const users = await User.findAll({
        where:where,
        attributes:  [
            'id',
            'nombre',
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` ' + selectClausule +' )'), 'partidasJugadas'],
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'ganado\' ' + selectClausule +'  )'), 'partidasGanadas'],
            [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'perdido\' ' + selectClausule +'  )'), 'partidasPerdidas'],
            [Sequelize.literal('averageGanadas(\`User\`.\`id\`, \'' + 'torneo' +'\')'), 'average']
        ],
        having: [
            Sequelize.where(Sequelize.literal("partidasJugadas"), { [Op.gt]: 0 })
        ],
        order: [
            ['average', 'DESC'],
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

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {
        let data = { gameId: id, action: "initGame", time: partida.duracionSegundos }; // ID de la partida a la que te quieres unir

        const urlSocket = 'http://'+config.WS.HOST + ':' + config.WS.PORT
        
        var socket = io(urlSocket);

        socket.emit('joinGame', data);
        
    } catch (error) {
        console.log(error);
        
    }


    return res.status(201).json(
        {
            data_send: "Partida Iniciada",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

export const agregarPuntosMano = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { equipo, puntos } = req.body;

    if (!equipo || !puntos) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "equipo, puntos" son obligatorios'
        })
    }

    const partida = await Partida.findOne({
        where: { id: id }
    })

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {
        
        let anotador = JSON.parse(partida.anotador)
        
        if (anotador && !anotador.puntajes){

            anotador = { puntajes: [], totales: {} }
        }
                

        let mano
        if(equipo===1){
            mano = { equipo1: puntos, borrado1: false, equipo2: 0, borrado2: false, info: '' }
        } else if (equipo === 2){
            mano = { equipo1: 0, borrado1: false, equipo2: puntos, borrado2: false, info: '' }
        }

        
        // console.log(anotador);
        let auxpuntaje: any[] = anotador.puntajes
        
        if (auxpuntaje.length === 1){
            auxpuntaje[1] = mano
        }else{
            auxpuntaje.push(mano)
        }
        
        let totales = await calcularPuntosManos(auxpuntaje)
        

        anotador.puntajes = auxpuntaje
        anotador.totales = totales
            
        let data = { partidaId: id, action: "actualizarPuntos", puntaje: anotador }; // ID de la partida a la que te quieres unir
        
        const urlSocket = config.WS.HOST + ':' + config.WS.PORT
        console.log(urlSocket);
        
        var socket = io(urlSocket);

        socket.emit('unirseAPartida', data);
        socket.close

        partida.anotador = JSON.stringify(anotador)
        await partida.save()

    } catch (error) {
        console.log(error);
        
    }
    return res.status(201).json(
        {
            data_send: "puntos agregados",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

export const tacharPuntosMano = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { equipo, indice, jugador } = req.body;

    if (!equipo || !indice) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "equipo, puntos" son obligatorios'
        })
    }

    const partida = await Partida.findOne({
        where: { id: id }
    })

    if (!partida) {
        return res.status(404).json({
            data_send: "",
            num_status: 6,
            msg_status: 'partida no Encontrada'
        });
    }
    try {

        let anotador = JSON.parse(partida.anotador)

        let tachar 
        if (equipo === 1) {
            // mano = { equipo1: puntos, borrado1: false, equipo2: 0, borrado2: false, info: '' }
            tachar = 'borrado1'
        } else if (equipo === 2) {
            // mano = { equipo1: 0, borrado1: false, equipo2: puntos, borrado2: false, info: '' }
            tachar = 'borrado2'
        }

        // console.log(anotador);
        
        let auxpuntaje: any[] = anotador.puntajes

        // console.log(auxpuntaje);
        
        if (tachar){
            console.log(auxpuntaje[parseInt(indice)]);
            
            auxpuntaje[parseInt(indice)][tachar] = true
            auxpuntaje[parseInt(indice)].info = 'borro '+ jugador
        }


        let totales = await calcularPuntosManos(auxpuntaje)

        // console.log(totales);
        anotador.puntajes = auxpuntaje
        anotador.totales = totales

        let data = { partidaId: id, action: "actualizarPuntos", puntaje: anotador }; // ID de la partida a la que te quieres unir

        const urlSocket = config.WS.HOST + ':' + config.WS.PORT
        // console.log(urlSocket);

        var socket = io(urlSocket);

        socket.emit('unirseAPartida', data);
        socket.close

        partida.anotador = JSON.stringify(anotador)

        await partida.save()

    } catch (error) {
        console.log(error);

    }
    return res.status(201).json(
        {
            data_send: "puntos actualizada",
            num_status: 0,
            msg_status: 'Exito.'
        });
}

async function guardarpuntaje(usuario:any, tipo:string='') {
    const puntuacion = await Puntuacion.findOne({
        where: { userId: usuario }
    });
    

    if (puntuacion) {
        if(tipo==='ganador'){
            puntuacion.jugados = puntuacion.jugados++
            puntuacion.ganados = puntuacion.ganados++
            puntuacion.save()
        }else{
            puntuacion.jugados = puntuacion.jugados++
            puntuacion.perdidos = puntuacion.perdidos++
            puntuacion.save()
        }
    } else {
        if (tipo === 'ganador') {
            await Puntuacion.create({
                userId: usuario,
                ganados: 1,
                jugados: 1
            })
        }else{
            await Puntuacion.create({
                userId: usuario,
                perdidos: 1,
                jugados: 1
            })
        }
    }
}

const calcularPuntosManos = async(data:any)=>{
    let equipo1 = 0;
    let equipo2 = 0;

    for (const obj of data) {
        if (!obj.borrado1) {
            equipo1 += obj.equipo1;
        }
        if (!obj.borrado2) {
            equipo2 += obj.equipo2;
        }
    }

    return { equipo1, equipo2 };
}