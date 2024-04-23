import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import Torneo from './torneo.model';

@Table({
    timestamps: false,
    tableName: "premios_torneos",
    modelName: "premioTorneo"
})
class PremiosTorneos extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.STRING
    })
    declare descripcion: String
    
    @ForeignKey(() => Torneo)
    @Column({
        type: DataType.STRING
    })
    declare torneoId: String;
    
    @BelongsTo(() => Torneo)
    declare torneo: Torneo;
}

export default PremiosTorneos