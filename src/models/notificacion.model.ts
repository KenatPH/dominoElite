import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: "notificaciones",
    modelName: "notificaion"
})
class Notificacion extends Model {

    @Column({
        primaryKey: true,
        type: DataType.INTEGER
    })
    declare id: number ; 

    @Column({
        type: DataType.STRING
    })
    declare userId: string

    @Column({
        type: DataType.STRING
    })
    declare cuerpo: string

    @Column({
        type: DataType.BOOLEAN
    })
    declare titulo: boolean


    @Column({
        type: DataType.BOOLEAN,
        defaultValue: 1
    })
    declare leida: boolean


    @Column({
        type: DataType.STRING
    })
    declare link: string


}

export default Notificacion