const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Global = require("./utils/global");

const connection = require("./database/index");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/index")(app);


app.listen(Global.PORT, () => {
    console.log(`Server listening on ${Global.PORT}`);
});