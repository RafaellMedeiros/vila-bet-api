const Sequelize = require('sequelize');
const connection = require('../../database/index');

const Game = connection.define("game", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telephone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Game.sync({force: false});

module.exports = Game;