'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    afiliado: DataTypes.STRING,
    fbkgoog_id: DataTypes.STRING,
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    clave: DataTypes.STRING,
    telefono: DataTypes.STRING,
    estatus: DataTypes.STRING,
    origen: DataTypes.STRING,
    tokenFacebook: DataTypes.STRING,
    tokenGoogle: DataTypes.STRING,
    perfil: DataTypes.STRING,
    clubId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};