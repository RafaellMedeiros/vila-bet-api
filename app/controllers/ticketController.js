const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game.js");
const GameDetails = require("../models/GameDetails.js");
const User = require("../models/User.js");
const GamesWeek = require("../models/GamesWeek.js");
const Utils = require("../../utils/utils.js");

const router = express.Router();

router.get("/", async (req, res) => {
    const { id } = req.query;

    const gameBd = await Game.findOne({raw: true, where: { id, removed: false }});
    const gameDetails = await GameDetails.findAll({where: {game_id: gameBd.id, removed: false}});
    const gamesWeek = await GamesWeek.findAll({ attributes: ['id', 'time_home', 'time_away', 'limit_date'], where: {removed: false}});
    const data = [];
    gamesWeek.forEach( game => {
        let result;
        gameDetails.forEach(det => {
            if (det.gameWeek_id == game.id) {
                if (det.result == "away") {
                    result = game.time_home;
                } else if (det.result == "draw") {
                    result = "Empate";
                } else {
                    result = game.time_away;
                }
            }
        })
        const aux = {
            time_home: game.time_home,
            time_away: game.time_away,
            result
        }
        data.push(aux);
    });

    const ranking = [];
    const gameWeek = await GamesWeek.findAll({ attributes: [ 'id', 'result'], raw: true, where: { removed: false } });
    const games = await Game.findAll({ where: { removed: false } });
    for await (const game of games) {
        const user = await User.findOne({where: { cpf: game.user_id}});
        const details = await GameDetails.findAll({ where: { game_id: game.id, removed: false}, attributes: [ 'gameWeek_id', 'result']});
        const points = Utils.gamePoints(gameWeek, details);
        const date = new Date(game.createdAt);
        ranking.push({
            id: game.id,
            seller: `${user.name} ${user.last_name}`,
            name: game.name,
            telephone: game.telephone,
            address: game.address,
            date: ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(),
            points
        })
    }
    ranking.sort((a, b) => { return b.points - a.points });
    const position = ranking.findIndex(pos => pos.id === id) + 1;


    res.status(200).send({
        table: data,
        name: gameBd.name,
        position
    });
})

module.exports = app => app.use("/ticket", router);