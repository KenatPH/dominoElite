'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class premios_torneos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  premios_torneos.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'premios_torneos',
  });
  return premios_torneos;
};