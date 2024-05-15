'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscripcionespush', {
    subscription: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscripcionespush');
  }
};