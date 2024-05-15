'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cola_notificaciones', {
 id: {
      autoIncrement: true,
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    correo: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true
    },
    sms: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true
    },
    webpush: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true
    },
    contexto: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cola_notificaciones');
  }
};