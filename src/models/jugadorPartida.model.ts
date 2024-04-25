import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import Partida from './partida.model';
import User from './users.model';


@Table({
    timestamps: false,
    tableName: "jugadores_partidas",
    modelName: "jugadoresPartida"
})
class JugadorPartida extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @ForeignKey(() => Partida)
    @Column
    declare partidaId: String;

    @ForeignKey(() => User)
    @Column
    declare userId: String;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: 0
    })
    declare puesto: String

}

export default JugadorPartida