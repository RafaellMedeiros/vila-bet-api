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
      expiresIn: 10000
    });
}

router.post("/register",  async (req, res) => {
    const {name, email, last_name, telephone, CPF, address, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) 
        return res.status(400).send({ error: "user already registered" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        last_name,
        telephone,
        CPF,
        address,
        password: hash,
        permission: "SELLER"
    });

    newUser.password = undefined;

    res.status(200).send({newUser});
});



router.post("/autenticate", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) 
        return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ error: "invalid password" });

    user.password = undefined;

    res.status(200).send({permission: user.permission, fullname: `${user.name} ${user.last_name}`, token: generateToken({ permission: user.permission,  email: user.email})});
});

router.post("/validate", async (req, res) => {
    const token = req.headers.authorization;
    let permission;
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ isValid: false });
        permission = decoded.permission;
        return res.status(200).send({ isValid: true, permission: permission });
    });
    
});

router.get("/user", async (req, res) => {
    const token = req.headers.authorization;
    const email = jwt.decode(token).email;
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    res.send({fullName: `${user.name} ${user.last_name}`, cpf: user.CPF});
});




module.exports = app => app.use("/auth", router);