import { Table, Column, Model, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import Club from './club.model';
import SolicitudMembresia from './solicitudMembresia.model';
import Partida from './partida.model';
import JugadorPartida from './jugadorPartida.model';

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
   declare email: string

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

   @Column({
      type: DataType.STRING
   })
   declare resetPasswordToken: String

   @Column({
      type: DataType.DATE
   })
   declare resetPasswordExpires: number

   @Column({
      type: DataType.STRING
   })
   declare imagen: String

   @BelongsTo(() => Club)
   declare club: Club;

   @BelongsToMany(() => Partida, () => JugadorPartida)
   declare partidas: Partida[];

   // @BelongsTo(() => SolicitudMembresia)
   // declare solicitud: SolicitudMembresia;


   comparePassword(clave:String){
      return new Promise<any>((resolve, reject) => {
            resolve(clave === this.clave)
      })
   }

}

export default User
