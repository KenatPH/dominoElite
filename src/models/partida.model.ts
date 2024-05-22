import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from "./users.model";
import Torneo from './torneo.model';
import JugadorPartida from './jugadorPartida.model';

@Table({
    timestamps: true,
    tableName: "partidas",
    modelName: "partida"
})

class Partida extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'Nacional'
    })
    declare sistema: String

    @Column({
        type: DataType.INTEGER,
        defaultValue: 4
    })
    declare cantidadJugadores: number

    @Column({
        type: DataType.INTEGER
    })
    declare duracionSegundos: number 

    @Column({
        type: DataType.INTEGER,
        defaultValue: 100
    })
    declare puntos: number
    
    @Column({
        type: DataType.STRING,
        defaultValue: 'activo'//finalizado
    })
    declare estatus: String 

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'local'// torneo // club
    })
    declare tipo: String


    @Column({
        type: DataType.STRING
    })
    declare torneoId: String;

    @Column({
        type: DataType.STRING
    })
    declare clubId: String;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'Nacional'
    })
    declare mesa: String
    
    @BelongsToMany(() => User, () => JugadorPartida)
    declare jugadores: User[];

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING
    })
    declare ganador1: String;

    @BelongsTo(() => User, 'ganador1')
    declare ganador1Info: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING
    })
    declare ganador2: String;
// TODO falta agregar en BD
    @Column({
        type: DataType.STRING
    })
    declare nombreEquipo1: String;

    @Column({
        type: DataType.STRING
    })
    declare nombreEquipo2: String;

    @Column({
        type: DataType.STRING
    })
    declare firma1: String;

    @Column({
        type: DataType.STRING
    })
    declare firma2: String;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare puntajeGanador: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare puntajePerdedor: number
    

    @Column({
        type: DataType.TEXT('long'),
        defaultValue: `[]`
    })
    declare anotador: string

    @Column({
        type: DataType.STRING
    })
    declare creadorId: String;



    @BelongsTo(() => User, "ganador2")
    declare ganador2Info: User;

}

export default Partida