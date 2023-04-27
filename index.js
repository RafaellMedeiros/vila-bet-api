const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Global = require("./utils/global");
require('dotenv').config()

const app = express();

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Groups', 'ActiveUserSessionId'],
    origin: '*'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/index")(app);

app.listen(Global.PORT, () => {
    console.log(`Server listening on ${Global.PORT}`);
});