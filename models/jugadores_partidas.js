'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jugadores_partidas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jugadores_partidas.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jugadores_partidas',
  });
  return jugadores_partidas;
};