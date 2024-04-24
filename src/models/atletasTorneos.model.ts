import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey } from 'sequelize-typescript';
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
}

export default AtletasTorneos