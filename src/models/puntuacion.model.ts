import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from './users.model';

@Table({
    timestamps: true,
    tableName: "puntuaciones",
    modelName: "puntuacion"
})
class Puntuacion extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;


    @ForeignKey(() => User)
    @Column
    declare userId: String;


    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare ganados: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare perdidos: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare jugados: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare average: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare ranking: number

    @BelongsTo(() => User)
    declare user: User;
    

}

export default Puntuacion