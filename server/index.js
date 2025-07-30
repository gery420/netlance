const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");

app.use(
cors({
	origin: ["https://netlance.vercel.app", "http://localhost:3000"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
})
);

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

	next();
}, express.static(path.join(__dirname, "uploads")));

app.use("/auth", require("./routes/auth"));
app.use("/buyer", require("./routes/buyer"));
app.use("/seller", require("./routes/seller"));
app.use("/common", require("./routes/common"));
app.use("/gig", require("./routes/gig"));
app.use("/order", require("./routes/order"));
app.use("/chat", require("./routes/chat"));
app.use("/review", require("./routes/review"));

module.exports = app;
