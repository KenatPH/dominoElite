import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import User from "./users.model";
import AtletasTorneos from './atletasTorneos.model';
import PremiosTorneos from './premioTorneo.model';
import Club from './club.model';

@Table({
    timestamps: true,
    tableName: "torneos",
    modelName: "torneo"
})
class Torneo extends Model {

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
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'Nacional'
    })
    declare sistema: String
    //TODO 
    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'clubes' // federado
    })
    declare tipo: String

    @Column({
        type: DataType.INTEGER
    })
    declare duracionSegundos: number 
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare ubicacion: String
    
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare puntos: Number


    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare rondas: Number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    declare publico: boolean

    @Column({
        type: DataType.DATE 
    })
    declare fecha:any

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1
    })
    declare rondaActual: any

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING
    })
    declare arbitro: string;

    @ForeignKey(() => Club)
    @Column({
        type: DataType.STRING
    })
    declare clubId: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare entrada: number
    
    @Column({
        type: DataType.STRING
    })
    declare imagen: String

    @BelongsToMany(() => User, () => AtletasTorneos)
    declare atletas: User[];

    @HasMany(() => PremiosTorneos)
    declare premios: PremiosTorneos[];

    declare duracionMinutos:number;

}


export default Torneo
