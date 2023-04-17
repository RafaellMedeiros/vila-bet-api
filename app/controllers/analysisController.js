const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game.js");
const GameDetails = require("../models/GameDetails.js");
const User = require("../models/User.js");
const GamesWeek = require("../models/GamesWeek.js");


const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    const gameBd = await Game.findAll({raw: true});

    let a = [];
    for await (const game of gameBd) {
        const b = await GameDetails.findAll({where: {game_id: game.id}});
        const c = await User.findOne({where: { cpf: game.user_id}});
        a.push({
            id: game.id,
            seller: `${c.name} ${c.last_name}`,
            name: game.name,
            telephone: game.telephone,
            address: game.address,
            data: new Date(game.createdAt).getDate() ,
            datails: b
        })
    }


    res.status(200).json(a);
});



module.exports = app => app.use("/analysis", router);