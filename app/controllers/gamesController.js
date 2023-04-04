const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();
router.use(authMiddleware);

router.get("/", (req, res) => {
    
});


module.exports = app => app.use("/games", router);