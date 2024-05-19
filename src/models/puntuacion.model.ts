import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

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


    @Column({
        type: DataType.STRING
    })
    declare userId: string

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

    

}

export default Puntuacion