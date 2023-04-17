const Sequelize = require('sequelize');
const connection = require('../../database/index');

const GameDetails = connection.define("Game_details", {
    gameWeek_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    result: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

GameDetails.sync({force: false});

module.exports = GameDetails;