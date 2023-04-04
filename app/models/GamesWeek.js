const Sequelize = require('sequelize');
const connection = require('../../database/index');

const GamesWeek = connection.define("games-week", {
    time_home: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time_away: {
        type: Sequelize.STRING,
        allowNull: false
    },
    result: {
        type: Sequelize.STRING,
        allowNull: true
    },
    limit_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

GamesWeek.sync({force: false});

module.exports = GamesWeek;