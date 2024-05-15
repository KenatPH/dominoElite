'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Torneos', {
    id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    ubicacion: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    puntos: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    rondas: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    publico: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    arbitro: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
    },
    duracionSegundos: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    sistema: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    fecha: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    tipo: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    clubId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Torneos');
  }
};