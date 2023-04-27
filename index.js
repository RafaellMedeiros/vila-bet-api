const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Global = require("./utils/global");
require('dotenv').config()

const app = express();

// const corsOptions = {
//     origin: 'https://vila-bet.herokuapp.com/'
// };
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/index")(app);

app.listen(Global.PORT, () => {
    console.log(`Server listening on ${Global.PORT}`);
});