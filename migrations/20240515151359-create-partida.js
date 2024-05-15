'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('partidas', {
 id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    sistema: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    cantidadJugadores: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "local"
    },
    torneoId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    ganador1: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    ganador2: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    puntos: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    estatus: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "activo"
    },
    clubId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    duracionSegundos: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1200
    },
    mesa: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('partidas');
  }
};