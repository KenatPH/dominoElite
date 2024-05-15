'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
 id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    afiliado: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    fbkgoog_id: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "0"
    },
    nombre: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    clave: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    estatus: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "activo"
    },
    origen: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "local"
    },
    tokenFacebook: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    tokenGoogle: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    perfil: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "atleta"
    },
    clubId: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
    },
    esArbitro: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
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
    await queryInterface.dropTable('Users');
  }
};