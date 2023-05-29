const Sequelize = require("sequelize");
const connection = require("../../database/index");

const GamesWeek = connection.define("games-week", {
  time_home: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time_away: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  result: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  limit_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  removed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ligue: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: false,
  },
  date_game: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: false,
  },
});

GamesWeek.sync({ force: false });

module.exports = GamesWeek;
