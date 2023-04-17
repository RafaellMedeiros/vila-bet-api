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
    const gameBd = await Game.findAll();
    const data = gameBd.map((game) => {
        return {...game, teste: "teste"}
    })
    res.status(200).json(data);
});



module.exports = app => app.use("/analysis", router);