const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

app.use(cookieParser());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
cors({
	allowedOrigins: ["https://netlance.vercel.app", "http://localhost:3000","https://netlance-dkay.vercel.app/"],
	AccessControlAllowOrigin: true,
	allowedHeaders: [
		"Content-Length",
		"X-Requested-With",
		"Authorization",
		"Content-Type",	
		"Cookie",
		"Set-Cookie",
		"Access-Control-Allow-Origin",
		"Access-Control-Allow-Credentials",
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Methods",
		"Access-Control-Expose-Headers",
	],
	allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	origin: ["https://netlance.vercel.app", "http://localhost:3000", "https://netlance-dkay.vercel.app/"],
	exposedHeaders: ["Content-Length", "X-Requested-With", "Authorization", "Content-Type", "Cookie", "Set-Cookie", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Expose-Headers"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
})
);

app.use("/auth", require("./routes/auth"));
app.use("/buyer", require("./routes/buyer"));
app.use("/common", require("./routes/common"));

module.exports = app;
