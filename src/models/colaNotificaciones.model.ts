import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table({
    timestamps: false,
    tableName: "cola_notificaciones",
    modelName: "queue"
})
class ColaNotificaciones extends Model {

    @Column({
        primaryKey: true,
        type: DataType.INTEGER
    })
    declare id: number;

    @Column({
        type: DataType.STRING
    })
    declare userId: string

    @Column({
        type: DataType.STRING
    })
    declare tipo: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: 1
    })
    declare correo: boolean


    @Column({
        type: DataType.BOOLEAN,
        defaultValue: 1
    })
    declare sms: boolean


    @Column({
        type: DataType.BOOLEAN,
        defaultValue: 1
    })
    declare webpush: boolean

    @Column({
        type: DataType.TEXT('long')
    })
    declare contexto: string




}

export default ColaNotificaciones