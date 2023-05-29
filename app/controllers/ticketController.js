const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const _ = require("lodash");
const Op = require("sequelize");

const Game = require("../models/Game.js");
const GameDetails = require("../models/GameDetails.js");
const User = require("../models/User.js");
const GamesWeek = require("../models/GamesWeek.js");
const Utils = require("../../utils/utils.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const { id } = req.query;

  const gameBd = await Game.findOne({
    raw: true,
    where: { id },
  });
  if (!gameBd) {
    res.status(404).send({ msg: "Game not found" });
    return;
  }
  const gameDetails = await GameDetails.findAll({
    where: { game_id: gameBd.id },
  });
  const idsGameWeek = gameDetails.map((game) => game.gameWeek_id);
  const gamesWeek = await GamesWeek.findAll({
    raw: true,
    attributes: [
      "id",
      "time_home",
      "time_away",
      "limit_date",
      "result",
      "ligue",
      "date_game",
    ],
    where: {
      id: idsGameWeek,
    },
  });
  const data = [];
  let count = 0;
  gamesWeek.forEach((game) => {
    let result;
    let color = "red";
    gameDetails.forEach((det) => {
      if (det.gameWeek_id == game.id) {
        if (det.result == "home") {
          result = game.time_home;
        } else if (det.result == "draw") {
          result = "Empate";
        } else {
          result = game.time_away;
        }
        if (game.result === null) {
          color = "white";
        }

        if (game.result == det.result) {
          color = "green";
          count = count + 1;
        }
      }
    });
    const date = Utils.convertDate(game.date_game);
    const aux = {
      time_home: game.time_home,
      time_away: game.time_away,
      ligue: game.ligue,
      date_game: `${date.fullDate} ${date.hours}`,
      result,
      color,
    };
    data.push(aux);
  });

  res.status(200).send({
    table: data,
    name: gameBd.name,
    count,
  });
});

router.delete("/", async (req, res) => {
  const id = req.body.id;
  const game = await Game.findOne({ raw: true, where: { id, removed: false } });

  if (!game) {
    res.status(404).send({ codeError: 404, info: "Game not found" });
    return;
  }
  await Game.update({ removed: true }, { where: { id } });
  res.send({});
});

module.exports = (app) => app.use("/ticket", router);
