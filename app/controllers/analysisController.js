const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game.js");
const User = require("../models/User.js");

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    const gameBd = await Game.findAll({
        raw: true
    });

    let games = [];
    for await (const game of gameBd) {
        const user = await User.findOne({where: { cpf: game.user_id}});
        const date = new Date(game.createdAt);
        games.push({
            id: game.id,
            seller: `${user.name} ${user.last_name}`,
            name: game.name,
            telephone: game.telephone,
            address: game.address,
            date: ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(),
        })
    }

    res.status(200).json(games);
});

module.exports = app => app.use("/analysis", router);