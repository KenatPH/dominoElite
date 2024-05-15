'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atletas_torneos', {
    torneoId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'torneos',
        key: 'id'
      }
    },
    userId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atletas_torneos');
  }
};