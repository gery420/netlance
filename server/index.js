const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    allowedOrigins: ["https://netlance.vercel.app", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/auth", require("./routes/auth"));
app.use("/buyer", require("./routes/buyer"));

module.exports = app;
