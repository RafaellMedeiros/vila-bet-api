const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();
router.use(authMiddleware);

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
      expiresIn: 1200
    });
}

router.post("/register", async (req, res) => {
    const {name, email, last_name, telephone, CPF, address, password } = req.body;
    const user = await User.findOne({ email });

    if (user) 
        return res.status(400).send({ Error: "user already registered" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        last_name,
        telephone,
        CPF,
        address,
        password: hash,
        permission: "USER"
    });

    res.status(200).send({newUser, token: generateToken({ id: newUser.id })});
});



router.post("/autenticate", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
        return res.status(400).send({ Error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ Error: "invalid password" });

    user.password = undefined;

    res.status(200).send({user, token: generateToken({ id: user.id })});
});




module.exports = app => app.use("/auth", router);