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
    const { results, punter, user_id } = req.body;
    const user = await User.findOne({ where: { cpf: user_id }});
    if (!user) {
        res.status(400).send({ Error: "user invalid" });
        return;
    }
    
    const gamesWeek = await GamesWeek.findAll();
    const gamesWeekId = gamesWeek.map(games => games.id);
    const resultsId = results.map(result => result.id);
    if(_.isEqual(gamesWeekId, resultsId)) {
        res.status(400).send({ Error: "not informed all games" });
        return;
    }

    const game = await Game.create({
        name: punter.name,
        telephone: punter.telephone,
        address: punter.address,
        user_id: user.cpf
    });

    const resultsDetails = results.map(result => {
        return {
            gameWeek_id: result.id,
            game_id: game.id,
            result: result.result
        }
    });

    await GameDetails.bulkCreate(resultsDetails);
    res.status(200).send("game created");
});


module.exports = app => app.use("/games", router);