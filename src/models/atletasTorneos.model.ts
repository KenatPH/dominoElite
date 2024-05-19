import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from "./users.model";
import Torneo from './torneo.model';

@Table({
    timestamps: false,
    tableName: "atletas_torneos",
    modelName: "atletaTorneo"
})
class AtletasTorneos extends Model {
    @ForeignKey(() => Torneo)
    @Column
    declare torneoId: String;

    @ForeignKey(() => User)
    @Column
    declare userId: String;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    declare asistente: boolean

    @BelongsTo(() => User)
    declare atleta: User;

    
}

export default AtletasTorneos