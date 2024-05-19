import { Op, Sequelize } from "sequelize";
import User from "../models/users.model";
import Partida from "../models/partida.model";
import { torneo } from "../models";
import Torneo from "../models/torneo.model";
import JugadorPartida from "../models/jugadorPartida.model";
import ColaNotificaciones from "../models/colaNotificaciones.model";


class handleError extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "Error " + mensaje;
    }
}



export class emparejamiento{

    // jugadores: any = [
    //     { "id": "d8860527-9ca6-40d7-8e21-f5f7f86058b4", "nombre": "Roda", "puntos": 3 },
    //     { "id": "9a179fda-957a-4efc-882f-dbe27d885a1f", "nombre": "Currie", "puntos": 1 },
    //     { "id": "e491dc04-30a6-4a01-b72d-329cda2d6aee", "nombre": "Anderson", "puntos": 2 },
    //     { "id": "626b423b-6faa-4fb2-98aa-d365f10870b8", "nombre": "Heindrick", "puntos": 1 },
    //     { "id": "b9e2d987-764f-4ce2-b21a-6fd59dd2f2fa", "nombre": "Smith", "puntos": 1 },
    //     { "id": "c72c762a-efbc-492e-92d5-b633fef3f9e7", "nombre": "Milissent", "puntos": 1 },
    //     { "id": "f064ed73-2bc7-4142-b876-b00e58fedd35", "nombre": "Nicki", "puntos": 3 },
    //     { "id": "2434ca35-c1ca-4ca7-9ae2-702201eb25c3", "nombre": "Selma", "puntos": 1 },
    //     { "id": "d7fb1996-fe28-4ad0-b24e-3fb48f467ba3", "nombre": "Vinny", "puntos": 2 },
    //     { "id": "cc3efd8a-bfc4-4edb-b601-cc6b2922d72c", "nombre": "Cara", "puntos": 1 },
    //     { "id": "cafe19d5-3a26-4ff2-adcf-a390e0d85bd5", "nombre": "Torrey", "puntos": 1 },
    //     { "id": "458c5ce1-4c1a-44d2-9c33-1ef84d6bbfe0", "nombre": "Christoforo", "puntos": 1 },
    //     { "id": "53bb1888-3557-4f60-88f2-1f6e3bb4925c", "nombre": "Edeline", "puntos": 2 },
    //     { "id": "89335a49-6818-40d2-bf78-c4faf4d7a118", "nombre": "Shelly", "puntos": 3 },
    //     { "id": "c53a55bb-fc0d-4cf8-9843-a7c1a25b32b0", "nombre": "Sancho", "puntos": 1 },
    //     { "id": "76fd1e4c-0ebf-4c39-b0e4-e726234343a9", "nombre": "Berton", "puntos": 3 },
    //     { "id": "9c335b74-f2c4-4005-8220-9669d4088dd6", "nombre": "Enriqueta", "puntos": 3 },
    //     { "id": "bbbed58a-48d1-4745-a694-425142fb36ba", "nombre": "Amy", "puntos": 3 },
    //     { "id": "129c26c5-e3bd-4029-b5d4-fd80647b2826", "nombre": "Rafaello", "puntos": 2 },
    //     { "id": "d7cbd7d0-bf76-413e-843f-dd900ff12fc5", "nombre": "Angelika", "puntos": 1 },
    //     { "id": "a3d295d4-8bf6-4825-a85f-cf49d1f40642", "nombre": "Kathye", "puntos": 3 },
    //     { "id": "eb71c8a4-3ffc-402d-b430-2cd1e8e7bb74", "nombre": "Tabbie", "puntos": 3 },
    //     { "id": "98fa3089-6548-4ee3-aaa0-90c63894212b", "nombre": "Gray", "puntos": 3 },
    //     { "id": "7b160d1c-28ed-4b1a-b5bd-da7ecbc920a1", "nombre": "Petey", "puntos": 2 },
    //     { "id": "88a10d0f-4761-4d60-bbb7-ca578d101674", "nombre": "Dosi", "puntos": 3 },
    //     { "id": "9e8b5099-d7d4-4323-8a84-ba337a132f61", "nombre": "Bili", "puntos": 1 },
    //     { "id": "b5ab2a9e-9eac-446b-9b14-250cc4cb391b", "nombre": "Donnie", "puntos": 2 }
    // ]
    // partidasjugadas: any[] = [
    //     {
    //         "jugadores": [
    //             {
    //                 "id": "d8860527-9ca6-40d7-8e21-f5f7f86058b4",
    //                 "nombre": "Roda",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "bbbed58a-48d1-4745-a694-425142fb36ba",
    //                 "nombre": "Amy",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "f064ed73-2bc7-4142-b876-b00e58fedd35",
    //                 "nombre": "Nicki",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "a3d295d4-8bf6-4825-a85f-cf49d1f40642",
    //                 "nombre": "Kathye",
    //                 "puntos": 3
    //             }
    //         ]
    //     },
    //     {
    //         "jugadores": [
    //             {
    //                 "id": "89335a49-6818-40d2-bf78-c4faf4d7a118",
    //                 "nombre": "Shelly",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "eb71c8a4-3ffc-402d-b430-2cd1e8e7bb74",
    //                 "nombre": "Tabbie",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "76fd1e4c-0ebf-4c39-b0e4-e726234343a9",
    //                 "nombre": "Berton",
    //                 "puntos": 3
    //             },
    //             {
    //                 "id": "98fa3089-6548-4ee3-aaa0-90c63894212b",
    //                 "nombre": "Gray",
    //                 "puntos": 3
    //             }
    //         ]
    //     }
    // ]

    jugadores: User[] = []
    partidasjugadas: any[] = []
    torneoId:string=''
    torneo:any
    partidascreadas: any = []
    mesasIndex = 0
    constructor(torneoId:string){
        // this.generarGrupos()
        //await this.obtenerUsuarios(torneoId)
        this.torneoId = torneoId
    }

    async init(){
        await this.obtenerTorneo()
        await this.obtenerUsuarios(this.torneoId)
        await this.obtenerPartidas(this.torneoId)
        await this.generarGrupos()
        // console.log(this.partidasjugadas);
        
    }
    async obtenerTorneo(){
        this.torneo = await Torneo.findOne({ where: { id: this.torneoId } })
    }

    async obtenerUsuarios(id:string){
       let selectClausule = ` and p.torneoId = '${id}' `
       this.jugadores = await User.findAll({
            include: [],
            attributes: [
                'id',
                'nombre',
                'telefono',
                'email',
                [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` ' + selectClausule + ' )'), 'partidasJugadas'],
                [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'ganado\' ' + selectClausule + '  )'), 'partidasGanadas'],
                [Sequelize.literal('(SELECT COUNT(jp.id) FROM jugadores_partidas jp inner join partidas p on p.id = jp.partidaId WHERE jp.userId = `User`.`id` AND jp.resultado = \'perdido\' ' + selectClausule + '  )'), 'partidasPerdidas'],
                [Sequelize.literal('averageGanadasTorneo(\`User\`.\`id\`, \'' + id + '\')'), 'average']
            ],
            having: [
                Sequelize.where(Sequelize.literal("partidasJugadas"), { [Op.gt]: 0 })
            ]
        })
        
        
    }

    async obtenerPartidas(id: string){
        this.partidasActivas = await Partida.findAll({
            where: { torneoId: id, estatus:'activo' },
            attributes: ["id"],
            include: [
                { model: User, as: 'jugadores', attributes: ['id'] }
            ]
        })

        this.partidasjugadas = await Partida.findAll({
            where: { torneoId: id },
            attributes: ["id"],
            include: [
                { model: User, as: 'jugadores', attributes: ['id'] }
            ]
        })
    }

    generarSubGrupos(jugadores: User[],jugadoresFlotantes: any[],){
        let S1: User[] = [];
        let S2: User[] = [];

        // M0 es el número de JJDD que vienen del grupo anterior. 

        // M1 es el valor máximo de JJDD que se pueden emparejar en el grupo 
        // si NumeroJugGrupAntertior es mayor que el número de jugadores residentes, M1 es cómo máximo igual al número de jugadores residentes.

        // numero maximo de parejas en este grupo
        // si NumeroJugGrupAntertior es mayor que el número de jugadores residentes, MaxPairs será como máximo igual al número de jugadores residentes.

        // Un grupo (de emparejamiento) es homogéneo si todos los jugadores tienen la misma puntuación; en caso contrario es heterogéneo.

        const maximoPartidas = Math.floor((jugadoresFlotantes.length + jugadores.length) / 4)

        console.log("partidas", maximoPartidas,  'jugadores.length', jugadoresFlotantes.length + jugadores.length);


        jugadores = jugadoresFlotantes.concat(jugadores)
        
        S1 = jugadores.slice(0, Math.floor(jugadores.length / 2));
        S2 = jugadores.slice(Math.floor(jugadores.length / 2) );
              
        
        console.log("s2 tiene "+S2.length," registros");
        console.log("s1 tiene " + S1.length, " registros");
        
        return { S1, S2 , maximoPartidas};
    }

    async preparacionDeCandidatos(S1: User[], S2: User[], maximoPartidas:number ){
        const candidatos: any[] = [];
        let flotantes: User[]=[]
        let transposicion = false
        const permutaciones = this.calcularPermutaciones(S2) + this.calcularPermutaciones(S1)
        let transposicionesRealizadas = 0
        console.log("permutaciones", permutaciones);

        if(S1.length+S2.length < 4){
            console.log("todos los jugadores son flotantes");
            S2.forEach((e:User) => {
                flotantes.push(e)
            });

            S1.forEach((e: User) => {
                flotantes.push(e)
            });
            
        }else{

            let index = 0
            do {
    
                if(transposicion){
                    // console.log("permuto");
                    let esFlotante = false
                    do {
    
                        // Obtener índices aleatorios para los jugadores
                        const indiceJugador1 = Math.floor(Math.random() * S1.length);
                        const indiceJugador2 = Math.floor(Math.random() * S2.length);
                        
                        const jugador1:any = S1[indiceJugador1];
                        const jugador2:any = S2[indiceJugador2];
    

                        S1[indiceJugador1] = jugador2;
                        S2[indiceJugador2] = jugador1;
    
                        
                    } while (esFlotante);
                  
                    // Intercambiar los jugadores
                    transposicion = false
                    transposicionesRealizadas++
                    
                }

                for (index; index < maximoPartidas+1; index++) {
                    
        
                    const prospectoMesa:any= []
    
                    let jugador1:any, jugador2: any, jugador3: any, jugador4 :any
                        
                    if (S1.length > 0) {
                        jugador1 = S1[0];
                        prospectoMesa.push(jugador1)
                    } 
                    if (S2.length > 0) {
                        jugador2 = S2[0];
                        prospectoMesa.push(jugador2)
                    }
                    if (S1.length > 1) {
                        jugador3 = S1[1];
                        prospectoMesa.push(jugador3)
                    }
                    if (S2.length > 1) {
                        jugador4 = S2[1];
                        prospectoMesa.push(jugador4)
                    } 
    
                    // console.log(jugador1, jugador2, jugador3, jugador4);
                    
                    
                    if (prospectoMesa.length === 4) {
    
                        const prop = prospectoMesa.map( (j:any)=>{return j.id} )
                        
                        let hanJugado = await  this.hanJugadoAnteriormente(prop, this.partidasjugadas) 
        
        
                        if (hanJugado && transposicionesRealizadas<permutaciones){    
                            // console.log("mesa no permitida");
    
                            transposicion = true
                            break;
                        }
    
                        if (S1.length > 0) {
                            S1.shift();
                        }
                        if (S2.length > 0) {
                            S2.shift();
                        }
                        if (S1.length > 0) {
                           S1.shift();
                        }
                        if (S2.length > 0) {
                           S2.shift();
                        } 
                        // console.log(prop);
                        
                        candidatos.push(prospectoMesa);
    
                    }else{
                        console.log("No crea la mesa");
                        // if (jugador1) flotantes.push({...jugador1, flotantes:true})
                        // if (jugador2) flotantes.push({ ...jugador2, flotantes: true })
                        // if (jugador3) flotantes.push({ ...jugador3, flotantes: true })
                        // if (jugador4) flotantes.push({ ...jugador4, flotantes: true })

                        if (jugador1) flotantes.push(jugador1)
                        if (jugador2) flotantes.push(jugador2)
                        if (jugador3) flotantes.push(jugador3)
                        if (jugador4) flotantes.push(jugador4)
                        
                    }
    
        
                }//end for
    
                
                if (candidatos.length === maximoPartidas){
                    break
                }
            // se repite si requiere transposicion y no a cumplido sus transposiciones maximas
            } while (transposicion && transposicionesRealizadas < permutaciones );
    
           console.log("permuto :",transposicionesRealizadas," veces ");
           console.log("mesas :", candidatos.length );
           console.log("flotantes :", flotantes.length);
            
            if(S1.length > 0){
                flotantes.concat(S1)
    
            }
            if (S2.length > 0) {
                flotantes.concat(S2)
    
            }
        }
        

        return {candidatos, flotantes};
    }

    crearPartidas(candidatos:any){
        console.log("partidas posibles ",candidatos.lenth);

        candidatos.forEach(async(usuarios:any, index:number) => {
            this.mesasIndex++
            const partida = new Partida({
                sistema: this.torneo.sistema,
                tipo: "torneo",
                torneoId: this.torneoId,
                mesa: this.mesasIndex
            });

            // await partida.save()

            // arreglos para hacer bulkCreate
            const toCreatePartida = usuarios.map((u: any) => { return { partidaId: partida.id, userId: u.id, mesa: this.mesasIndex } })
            // console.log(toCreatePartida);
            const toColaNotificacion = usuarios.map((u: any) => { return { tipo: 'mesaEnTorneo', userId: u.id, contexto: JSON.stringify({ mesa: this.mesasIndex, email: u?.email, telefono: u?.telefono }) } })
            
            // console.log(toColaNotificacion);

            // crea todas las relaciones con la partida en BD
            await JugadorPartida.bulkCreate(toCreatePartida)

            // envia las notificaciones
            await ColaNotificaciones.bulkCreate(toColaNotificacion)
            this.partidascreadas.push(partida)
            
        });


        
    }

    async generarGrupos(){
        this.mesasIndex = 0
        let jugadoresFlotantes:any = []
        let candidatos:any[] = [] 
        let j = 0 
        do {
            console.log("++++++++++++++++++++++++++++++++++inicia una vuelta+++++++++++++++++++++++++++++++++");
            if (jugadoresFlotantes.length>0){
                console.log("jugadores flotantes: " , jugadoresFlotantes.length);
                // console.log(jugadoresFlotantes);             
            }
            
            j++
            const objetosMaxPuntaje: any = this.obtenerYEliminarMaxPuntaje('average' ) 

            
            let grupos = this.generarSubGrupos(objetosMaxPuntaje, jugadoresFlotantes);

            // console.log(grupos);
            
            let result = await this.preparacionDeCandidatos(grupos.S1, grupos.S2, grupos.maximoPartidas)
            
            jugadoresFlotantes = result.flotantes

            
           this.crearPartidas(result.candidatos)  

        } while (this.jugadores.length > 0);

       if (jugadoresFlotantes.length){
           console.log("quedaron jugadores: ", jugadoresFlotantes.length);

            let prospecto:any = []

            jugadoresFlotantes.forEach((j:User) => {
                
                prospecto.push(j)
            });

            candidatos.push(prospecto)

            this.crearPartidas(candidatos)
        }

        console.log("partidas creadas en total: ", this.partidascreadas.length);
        

    }
      
    obtenerYEliminarMaxPuntaje<T>( propiedad: keyof T) {

        
        const maxPuntaje = Math.max(...this.jugadores.map((obj: any) => parseFloat(obj.dataValues.average)));

        console.log("puntaje de grupo: ",maxPuntaje);
        
        
        const objetosMaxPuntaje = this.jugadores.filter((obj: any) => parseFloat(obj.dataValues.average) === maxPuntaje);

        console.log("jugadores en grupo: ", objetosMaxPuntaje.length);
        

        this.jugadores = this.jugadores.filter((obj: any) => parseFloat(obj.dataValues.average) !== maxPuntaje);

        return objetosMaxPuntaje;
    }

    calcularPermutaciones(arr:any) {
        const n = arr.length;
        let permutaciones = 1;

        for (let i = 1; i <= n; i++) {
            permutaciones *= i;
        }

        return permutaciones;
    }

    async hanJugadoAnteriormente(participantes:any, partidasJugadas:any) {


        // console.log(participantes);
        

        if (partidasJugadas.length===0) {
            return false
        }

        // Crear un conjunto para almacenar las combinaciones de jugadores
        const combinacionesJugadores = new Set();

        // Recorrer las partidas jugadas
        for (const partida of partidasJugadas) {
            const jugadores = partida.jugadores.map((jugador:any) => jugador.id);
            for (let i = 0; i < jugadores.length; i++) {
                for (let j = i + 1; j < jugadores.length; j++) {
                    // Crear una cadena única para representar la combinación de jugadores
                    const combinacion = [jugadores[i], jugadores[j]].sort().join('-');
                    combinacionesJugadores.add(combinacion);
                }
            }
        }

        // console.log(combinacionesJugadores);
        

        // Verificar si los participantes han jugado anteriormente entre sí
        for (let i = 0; i < participantes.length; i++) {
            for (let j = i + 1; j < participantes.length; j++) {
                const combinacion = [participantes[i], participantes[j]].sort().join('-');
                // console.log(combinacionesJugadores.has(combinacion));
                
                if (combinacionesJugadores.has(combinacion)) {
                    return true; // Han jugado anteriormente
                }
            }
        }

        return false; // No han jugado anteriormente
    }



}