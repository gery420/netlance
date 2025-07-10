const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", require("./routes/auth"));
app.use("/buyer", require("./routes/buyer"));

module.exports = app;
