import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from "./users.model";
import SolicitudMembresia from './solicitudMembresia.model';

@Table({
    timestamps: true,
    tableName: "clubes",
    modelName: "club"
})
class Club extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @Column({
        type: DataType.STRING
    })
    declare nombre: String

    @Column({
        type: DataType.STRING
    })
    declare descripcion: String

    @Column({
        type: DataType.STRING
    })
    declare imagen: String

    @HasMany(() => User)
    declare atletas: User[];

    @HasMany(() => SolicitudMembresia)
    // @BelongsToMany(() => User, () => SolicitudMembresia)
    declare solicitudes: User[];


}

export default Club