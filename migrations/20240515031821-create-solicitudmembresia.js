'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('solicitudmembresia', {
    id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    clubId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
      
    },
    userId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
      
    },
    estatus: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "En espera"
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('solicitudmembresia');
  }
};