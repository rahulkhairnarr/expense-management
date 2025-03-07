const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
var cors = require('cors')
const router = require("./routers/index");
const logging = require("./middleware/logging");

const app = express();
app.use(cors());
app.use(logging);
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);


app.use('/', router);

module.exports = app;
