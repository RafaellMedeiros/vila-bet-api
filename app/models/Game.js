const Sequelize = require("sequelize");
const connection = require("../../database/index");

const Game = connection.define(
  "game",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: function () {
        return Math.random().toString(36).substr(2, 7).toUpperCase();
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    removed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    game_details: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeValidate: (instance, options) => {
        if (!instance.id) {
          instance.id = Math.random().toString(36).substr(2, 7).toUpperCase();
        }
      },
    },
  }
);

Game.sync({ alter: true });

module.exports = Game;
