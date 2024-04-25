import express, { Request, Response } from "express";
import Partida from "../models/partida.model";
import User from "../models/users.model";
import Torneo from "../models/torneo.model";
import JugadorPartida from "../models/jugadorPartida.model";

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

    const partida = await Partida.findOne({ where: { id: id },
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

    const { sistema, cantidadJugadores, tipo, torneo, jugadores  } = req.body;

    if (!cantidadJugadores || !jugadores || !sistema ) {

        return res.status(409).json({
            data_send: "",
            num_status: 1,
            msg_status: 'Los campos "cantidad de jugadores, jugadores" son obligatorios'
        })
    }

    if ( tipo=='local' && torneo && torneo.id) {
        const user = await Torneo.findOne({ where: { id: torneo.id } })
        if (!user) {
            return res.status(404).json({
                data_send: "",
                num_status: 6,
                msg_status: 'torneo not found'
            });
        }
    }
    try {
        let jugadoresResult: JugadorPartida[] = []
    
        if (jugadores.length > 0){

            if (cantidadJugadores != jugadores.length){
                return res.status(409).json({
                    data_send: "",
                    num_status: 6,
                    msg_status: 'verifique la cantidad de jugadores y los jugadores'
                });
            }

            const partida = new Partida({
                sistema, cantidadJugadores, tipo, torneo
            });

            partida.save()

            
            jugadores.forEach((j:any)=> {

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

    jugadores.forEach(async (id:String) => {
        if(!partida.jugadores.find(jugador=> jugador.id == id)){
            console.log("*******************jugador no existe************************ id" ,id);
                    const JP = new JugadorPartida({
                        partidaId: partidaId,
                        userId: id
                    })

                    await JP.save()
        }else{
            console.log("jugador existe");
        }

    });

    return res.status(201).json(
        {
            data_send: partida,
            num_status: 0,
            msg_status: 'Partida creada correctamente.'
        });

}





