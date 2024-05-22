import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: "noticias",
    modelName: "noticias"
})
class Noticia extends Model {

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
        type: DataType.STRING
    })
    declare nombre: string

    @Column({
        type: DataType.STRING,
        defaultValue: 1
    })
    declare descripcion: string


}

export default Noticia