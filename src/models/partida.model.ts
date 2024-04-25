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
        allowNull: false
    })
    declare sistema: String

    @Column({
        type: DataType.INTEGER
    })
    declare cantidadJugadores: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 100
    })
    declare puntos: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'local'// torneo
    })
    declare tipo: String


    @Column({
        type: DataType.STRING
    })
    declare torneoId: String;
    
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

    @BelongsTo(() => User, "ganador2")
    declare ganador2Info: User;

}

export default Partida