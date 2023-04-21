const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const GamesWeek = require("../models/GamesWeek.js");
const Game = require("../models/Game.js");
const GameDetails = require("../models/GameDetails.js");
const { Op } = require("sequelize");

const router = express.Router();
router.use(authMiddleware);

router.post("/new-games-week", async (req, res) => {
    
    const { gamesWeek, dataLimit } = req.body;

    
    if (!(Array.isArray(gamesWeek) || dataLimit)) {
        res.status(400).send({ error: "data error" });
        return;
    }

    const gamesWeekFullData = gamesWeek.map(game => {
        const { timeHome, timeAway } = game;
        return {
            time_home: timeHome,
            time_away: timeAway,
            limit_date: dataLimit,
            removed: false
        }
    })

    await GamesWeek.bulkCreate(gamesWeekFullData);
    res.status(200).send("week created successfully");    
});

router.post("/result-games-week", async (req, res) => {
    const { results } = req.body;
    const idResults = results.map(result => result.id);
    const bdGamesWeek = await GamesWeek.findAll({ where: { id: { [Op.in]: idResults }, removed: false }});
    
    if (bdGamesWeek.length !== idResults.length) {
        res.status(400).send({ error: "data error" });
        return;
    }

    results.forEach( async result => {
        await GamesWeek.update({ result: result.result }, {
            where: {
              id: result.id
            }
        });
    });

    res.status(200).send({msg:'update successfully'});
});

router.get("/result-games-week", async (req, res) => {
    const bdGamesWeek = await GamesWeek.findAll({ where: { removed: false }});
    res.status(200).send(bdGamesWeek);
});

router.get("/", async (req, res) => {

    let allowed = false;

    const gamesWeek = await GamesWeek.findAll({
        attributes: ['id', 'time_home', 'time_away', 'limit_date'],
        where: { removed: false }
    });
    
    if (gamesWeek.length !== 0 && new Date(gamesWeek[0].limit_date.getTime() > new Date().getTime())) {
        allowed = true;
    }

    res.status(200).send({
        gamesWeek
    });
});

router.delete("/", async () => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
        return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ error: "invalid password" });

    await GamesWeek.update({ removed: true });
    await Game.update({ removed: true });
    await GameDetails.update({ removed: true });
    res.status(200).send({ msg:"Week deleted" });
});


module.exports = app => app.use("/games-week", router);