const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { func } = require("joi");

app.use(cookieParser());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
cors({
	origin: ["https://netlance.vercel.app", "http://localhost:3000"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
})
);

app.use("/auth", require("./routes/auth"));
app.use("/buyer", require("./routes/buyer"));
app.use("/common", require("./routes/common"));

module.exports = app;
