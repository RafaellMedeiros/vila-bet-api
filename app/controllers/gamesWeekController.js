const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const GamesWeek = require("../models/GamesWeek.js");
const Game = require("../models/Game.js");
const GameDetails = require("../models/GameDetails.js");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Utils = require("../../utils/utils.js");

const router = express.Router();
router.use(authMiddleware);

router.post("/new-games-week", async (req, res) => {
  const { gamesWeek, dataLimit } = req.body;

  if (!(Array.isArray(gamesWeek) || dataLimit)) {
    res.status(400).send({ error: "data error" });
    return;
  }

  const gamesWeekFullData = gamesWeek.map((game) => {
    const { timeHome, timeAway, ligue, date_game } = game;
    return {
      time_home: timeHome,
      time_away: timeAway,
      ligue: ligue,
      date_game: date_game,
      limit_date: dataLimit,
      removed: false,
    };
  });

  await GamesWeek.bulkCreate(gamesWeekFullData);
  res.status(200).send({ msg: "week created successfully" });
});

router.post("/result-games-week", async (req, res) => {
  const { results } = req.body;
  const idResults = results.map((result) => result.id);
  const bdGamesWeek = await GamesWeek.findAll({
    where: { id: { [Op.in]: idResults }, removed: false },
  });

  if (bdGamesWeek.length !== idResults.length) {
    res.status(400).send({ error: "data error" });
    return;
  }

  results.forEach(async (result) => {
    await GamesWeek.update(
      { result: result.result },
      {
        where: {
          id: result.id,
        },
      }
    );
  });

  res.status(200).send({ msg: "update successfully" });
});

router.get("/result-games-week", async (req, res) => {
  const bdGamesWeek = await GamesWeek.findAll({
    where: { removed: false },
    raw: true,
  });
  res.status(200).send(bdGamesWeek);
});

router.get("/", async (req, res) => {
  let allowed = false;

  let gamesWeek = await GamesWeek.findAll({
    where: { removed: false },
  });

  if (gamesWeek.length == 0) {
    res.status(200).send({ msg: "games week not found", info: { allowed } });
    return;
  }

  gamesWeek = gamesWeek.map((game) => {
    const date = Utils.convertDate(game.date_game);
    return { ...game.dataValues, date_game: `${date.fullDate} ${date.hours}` };
  });

  const limitDate = new Date(gamesWeek[0].limit_date);
  limitDate.setHours(limitDate.getHours() + 3);

  if (
    gamesWeek.length !== 0 &&
    limitDate.toISOString() > new Date().toISOString()
  ) {
    allowed = true;
  }

  const date = gamesWeek[0].limit_date;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  res.status(200).send({
    gamesWeek,
    info: {
      allowed,
      date: {
        date: day + "/" + month + "/" + year,
        hours: hours + ":" + minutes,
      },
    },
  });
});

router.delete("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "invalid password" });
  await GamesWeek.update({ removed: true }, { where: {} });
  await Game.update({ removed: true }, { where: {} });
  await GameDetails.update({ removed: true }, { where: {} });
  res.status(200).send({ msg: "Week deleted" });
});

module.exports = (app) => app.use("/games-week", router);
