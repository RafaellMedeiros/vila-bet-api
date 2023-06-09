const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");
const Global = require("../../utils/global");

module.exports = (req, res, next) => {
  if (req.originalUrl === Global.ROUTER_AUTH) return next();
  if (req.originalUrl === Global.ROUTER_GAME_WEEK) return next();

  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: "Token was not informed" });

  jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "invalid token" });

    req.userId = decoded.id;
    return next();
  });
};
