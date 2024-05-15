'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clubes', {
    id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    imagen: {
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
    await queryInterface.dropTable('clubes');
  }
};