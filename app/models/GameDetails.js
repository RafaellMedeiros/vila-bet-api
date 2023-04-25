const Sequelize = require('sequelize');
const connection = require('../../database/index');

const GameDetails = connection.define("Game_details", {
    gameWeek_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    game_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    result: {
        type: Sequelize.STRING,
        allowNull: false
    },
    removed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

GameDetails.sync({force: true});

module.exports = GameDetails;