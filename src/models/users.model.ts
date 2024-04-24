import { Table, Column, Model, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import Club from './club.model';

@Table({
   timestamps: true,
   tableName: "users",
   modelName: "User"
})
class User extends Model {
   @Column({
      primaryKey: true,
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
   })
   declare id:string;

   @Column({
      type: DataType.NUMBER,
      defaultValue: 0
   })
   declare afiliado:number

   @Column({
      type: DataType.STRING,
      defaultValue: 0
   })
   declare fbkgoog_id:String

   @Column({
      type: DataType.STRING,
      allowNull:false
   })
   declare nombre:String 

   @Column({
      type: DataType.STRING,
      allowNull: false
   })
   declare email: String

   @Column({
      type: DataType.STRING,
      allowNull: false
   })
   declare clave:String 

   @Column({
      type: DataType.STRING,
      allowNull: false
   })
   declare telefono:String

   @Column({
      type: DataType.STRING,
      defaultValue: 'activo'
   })
   declare estatus:String 

   @Column({
      type: DataType.STRING,
      defaultValue: 'local'
   })
   declare origen:String

   @Column({
      type: DataType.STRING,
   })
   declare tokenFacebook:String

   @Column({
      type: DataType.STRING
   })
   declare tokenGoogle:String

   @Column({
      type: DataType.STRING,
      defaultValue: 'atleta'
   })
   declare perfil:String  //status validos: admin,club, atleta=default

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: 0
   })
   declare esArbitro: boolean

   @ForeignKey(() => Club)
   @Column({
      type: DataType.STRING
   })
   declare clubId: String;

   @BelongsTo(() => Club)
   declare club: Club;


   comparePassword(clave:String){
      return new Promise<any>((resolve, reject) => {
            resolve(clave == this.clave)
      })
   }

}

export default User
