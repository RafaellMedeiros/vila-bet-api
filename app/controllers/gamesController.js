const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game");
const GameDetails = require("../models/GameDetails");
const User = require("../models/User");
const GamesWeek = require("../models/GamesWeek");


const router = express.Router();
router.use(authMiddleware);

router.post("/new-game", async (req, res) => {
    const { results, punter } = req.body;
    const user = await User.findOne({ where: { cpf: punter.cpf }});
    if (!user) {
        res.status(400).send({ error: "user invalid" });
        return;
    }
    
    const gamesWeek = await GamesWeek.findAll();
    const gamesWeekId = gamesWeek.map(games => games.id);
    const resultsId = results.map(result => result.id);
    if(!_.isEqual(gamesWeekId, resultsId)) {
        res.status(400).send({ error: "not informed all games" });
        return;
    }

    const date = new Date();

    const game = await Game.create({
        name: punter.name,
        telephone: punter.telephone,
        address: punter.address,
        user_id: punter.cpf,
        date: date.getFullYear() + "-" + ((date.getMonth() + 1)) + "-" + ((date.getDate() ))
    });

    const resultsDetails = results.map(result => {
        return {
            gameWeek_id: result.id,
            game_id: game.id,
            result: result.result
        }
    });

    await GameDetails.bulkCreate(resultsDetails);
    res.status(200).send({msg: "game created", id: game.id});
});

router.post("/", async (req, res) => {
    const a = await Game.findAll();
    res.status(200).send(a);
});


router.get("/my", async (req, res) => {
    const { id } = req.query;

    const gameBd = await Game.findOne({raw: true, where: { id }});
    const gameDetails = await GameDetails.findAll({where: {game_id: gameBd.id}});
    const gamesWeek = await GamesWeek.findAll({ attributes: ['id', 'time_home', 'time_away', 'limit_date'], where: {removed: false}})
    const data = []
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

    res.status(200).send({ data });
});

module.exports = app => app.use("/games", router);