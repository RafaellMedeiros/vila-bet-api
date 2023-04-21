const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require('lodash');

const Game = require("../models/Game.js");
const User = require("../models/User.js");
const GameDetail = require("../models/GameDetails.js");
const GameWeek = require("../models/GamesWeek.js");
const Utils = require("../../utils/utils.js");

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    const { id, seller, date } = req.query;
    const arraySeller = seller.split(' ');
    const name = arraySeller[0];
    const last_name = arraySeller[1];
    console.log(name, last_name);

    const where = {};

    if (id) { where.id = id}
    if (date) { where.date = date}
    if (name && last_name) {
        const user = await User.findOne({
            where: { name, last_name }
        })
        where.user_id = user.CPF;
    }

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

router.get('/ranking', async (req, res) => {
    const data = [];
    const gameWeek = await GameWeek.findAll({ attributes: [ 'id', 'result'], raw: true });
    const games = await User.findAll({});
    for await (const game of games) {
        const user = await User.findOne({where: { cpf: game.user_id}});
        const details = await GameDetail.findAll({ where: { game_id: game.id}, attributes: [ 'gameWeek_id', 'result']});
        const points = Utils.gamePoints(gameWeek, details);
        const date = new Date(game.createdAt);
        data.push({
            id: game.id,
            seller: `${user.name} ${user.last_name}`,
            name: game.name,
            telephone: game.telephone,
            address: game.address,
            date: ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(),
            points
        })
    }
    data.sort((a, b) => { return a.points - b.points })
    return data;
});

module.exports = app => app.use("/analysis", router);