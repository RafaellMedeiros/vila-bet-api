const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game.js");
const User = require("../models/User.js");

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    const { id, seller, date } = req.query;
    const where = {};

    if (id) { where.id = id}
    if (date) { where.createdAt = date}
    if (seller) {
        const user = await User.findOne({
            where: { name: seller }
        })
        where.user_id = user.cpf;
    }

    console.log(where);

    const gameBd = await Game.findAll({
        raw: true,
        where
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

router.get('/allUsers', async (req, res) => {
    const allUsers = await User.findAll({
        attributes: [ 'name', 'last_name'],
        where: { permission: 'SELLER' }
    });
    const allUserFullName = allUsers.map( user => { return `${user.name} ${user.last_name}`});
    res.status(200).json(allUserFullName);
});

module.exports = app => app.use("/analysis", router);