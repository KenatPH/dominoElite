import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import Club from './club.model';
import User from './users.model';

@Table({
    timestamps: false,
    tableName: "solicitudMembresia",
    modelName: "solicitud"
})
class SolicitudMembresia extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @ForeignKey(() => Club)
    @Column
    declare clubId: String;

    @BelongsTo(() => Club)
    declare club: Club;

    @ForeignKey(() => User)
    @Column
    declare userId: String;

    @Column({
        type: DataType.STRING,
        defaultValue: 'En espera'
    })
    declare estatus: String;
}

export default SolicitudMembresia