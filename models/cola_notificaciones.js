'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cola_notificaciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cola_notificaciones.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cola_notificaciones',
  });
  return cola_notificaciones;
};