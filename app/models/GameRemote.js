const Sequelize = require("sequelize");
const connection = require("../../database/index");

const GameRemote = connection.define(
  "game-remote",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: function () {
        return Math.random().toString(36).substr(2, 4).toUpperCase();
      },
    },
    games: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeValidate: (instance, options) => {
        if (!instance.id) {
          instance.id = Math.random().toString(36).substr(2, 4).toUpperCase();
        }
      },
    },
  }
);

GameRemote.sync({ force: false });

module.exports = GameRemote;
