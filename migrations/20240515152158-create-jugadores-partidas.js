'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jugadores_partidas', {
 id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    partidaId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    userId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    puesto: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: true
    },
    resultado: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Perdido"
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jugadores_partidas');
  }
};