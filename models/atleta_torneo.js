'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class atleta_torneo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  atleta_torneo.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'atleta_torneo',
  });
  return atleta_torneo;
};