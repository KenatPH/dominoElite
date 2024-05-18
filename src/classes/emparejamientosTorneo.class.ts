import { Op, Sequelize } from "sequelize";
import User from "../models/users.model";
import Partida from "../models/partida.model";



export class emparejamiento{

    jugadores: any = []
    partidasjugadas: any[] = []

    constructor(torneiId:string){
        // this.generarGrupos()
        this.obtenerUsuarios(torneiId)
    }

    async obtenerUsuarios(id:string){
       let selectClausule = ` and p.torneoId = '${id}' `
       this.jugadores = await User.findAll({
            include: [],
            attributes: [
                'id',
                'nombre',
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
        this.partidasjugadas = await Partida.findAll({
            where: { torneoId: id },
            attributes: ["id"],
            include: [
                { model: User, as: 'jugadores', attributes: ['id', 'nombre'] }
            ]
        })
    }

    generarSubGrupos( jugadores: string[],jugadoresFlotantes: any[],){
            let S1: string[] = [];
            let S2: string[] = [];

            // M0 es el número de JJDD que vienen del grupo anterior. 
            const NumeroJugGrupAntertior = jugadoresFlotantes.length

            // M1 es el valor máximo de JJDD que se pueden emparejar en el grupo 
            // si NumeroJugGrupAntertior es mayor que el número de jugadores residentes, M1 es cómo máximo igual al número de jugadores residentes.
            const JJDDporEmparejar = (NumeroJugGrupAntertior > jugadores.length) ? jugadores.length : Math.floor((jugadoresFlotantes.length + jugadores.length) / 2) 
            
            // numero maximo de parejas en este grupo
            // si NumeroJugGrupAntertior es mayor que el número de jugadores residentes, MaxPairs será como máximo igual al número de jugadores residentes.
            const MaxPairs = (NumeroJugGrupAntertior > jugadores.length) ? NumeroJugGrupAntertior / 2 : Math.floor( jugadores.length / 2)

            // Un grupo (de emparejamiento) es homogéneo si todos los jugadores tienen la misma puntuación; en caso contrario es heterogéneo.
            const tipoGrupo = (jugadoresFlotantes.length > 0)? 'heterogéneo':'homogéneo'

            const N1 = (tipoGrupo === 'heterogéneo')? JJDDporEmparejar:MaxPairs

            if (tipoGrupo === 'homogéneo') {
                S1 = jugadores.slice(0, N1);
                S2 = jugadores.slice(N1);
                if (S2.length > S1.length) {
                    jugadoresFlotantes = S2.splice(-1, 1);
                    jugadoresFlotantes = jugadoresFlotantes.map((j:any) => { return {flotante:true ,j} });
                }
                // jugadoresFlotantes = []
            }else{

                jugadores = jugadoresFlotantes.concat(jugadores)
                jugadoresFlotantes = []
                S1 = jugadores.slice(0, N1);
                S2 = jugadores.slice(N1);
                if (S2.length > S1.length) {
                    jugadoresFlotantes = S2.splice(-1, 1);
                }
            }
            

            const jugadoresEnLimbo = jugadoresFlotantes;


        return { S1, S2, jugadoresEnLimbo };
    }

    preparacionDeCandidatos(S1: any[],S2: any[] ){
        const candidatos: string[] = [];

        // validar que no hayan jugado antes
        let transposicion = false
        const permutaciones = this.calcularPermutaciones(S2)
        let transposicionesRealizadas = 0
        do {

            if(transposicion){
                S2.sort(() => Math.random() - 0.5)
                transposicion = false
                transposicionesRealizadas++
                
            }
            
            for (let i = 0; i < S1.length; i++) {
    
                let hanJugado = this.yaJugoConJugador(this.partidasjugadas, S1[i]['id'], S2[i]['id']  )

                if (hanJugado){    
                    transposicion=true
                    break;
                }
                candidatos.push(`${S1[i]['nombre']} vs ${S2[i]['nombre']}`);
                this.partidasjugadas.push({ jugador1: S1[i]['id'], jugador2: S2[i]['id'] })
    
            }

  

        } while (transposicion && transposicionesRealizadas < permutaciones);
        
        return candidatos;
    }



    generarGrupos(){
       
        do {
            let jugadoresFlotantes:any = []

            
            const objetosMaxPuntaje:any = this.obtenerYEliminarMaxPuntaje(this.jugadores,'puntos' )        
            
            let result = this.generarSubGrupos(objetosMaxPuntaje, jugadoresFlotantes);

            jugadoresFlotantes = result.jugadoresEnLimbo

            console.log(this.preparacionDeCandidatos(result.S1, result.S2));   

                    

        } while (this.jugadores.length > 0);


    }
    
    
    obtenerYEliminarMaxPuntaje<T>(array: T[], propiedad: keyof T): T[] {
        
        const maxPuntaje = Math.max(...this.jugadores.map((obj:any) => obj[propiedad]));

        const objetosMaxPuntaje = this.jugadores.filter((obj:any) => obj[propiedad] === maxPuntaje);

        this.jugadores = this.jugadores.filter((obj:any) => obj[propiedad] !== maxPuntaje);

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
// modoficar para verificar los 4 jugadores
    yaJugoConJugador(partidas:any, jugador1:string, jugador2:string) {
        return partidas.some((partida:any) =>
            (partida.jugador1 === jugador1 && partida.jugador2 === jugador2) ||
            (partida.jugador1 === jugador2 && partida.jugador2 === jugador1)
        );
    }



}