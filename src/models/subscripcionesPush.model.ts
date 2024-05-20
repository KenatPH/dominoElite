import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from "./users.model";

@Table({
    timestamps: false,
    tableName: "subscripciones_push",
    modelName: "subPush"
})
class SubscripcionesPush extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.TEXT('long')
    })
    declare subscription: string


}

export default SubscripcionesPush