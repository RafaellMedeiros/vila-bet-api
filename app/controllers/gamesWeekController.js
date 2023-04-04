const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const GamesWeek = require("../models/GamesWeek.js");

const router = express.Router();
router.use(authMiddleware);

router.post("/new-games-week", async (req, res) => {
    const { gamesWeek, dataLimit } = req.body;
    if (!(Array.isArray(gamesWeek) || dataLimit)) res.status(400).send({ Error: "data error" });

    const gamesWeekFullData = gamesWeek.map(game => {
        const { timeHome, timeAway } = game;
        if (!(timeHome || timeAway)) res.status(400).send({ Error: "data error" })

        return {
            time_home: timeHome,
            time_away: timeAway,
            limit_date: dataLimit
        }
    })

    await GamesWeek.bulkCreate(gamesWeekFullData);
    res.status(200).send("week created successfully");    
});

router.get("/", async (req, res) => {
    res.status(200).send(await GamesWeek.findAll())
});


module.exports = app => app.use("/games-week", router);