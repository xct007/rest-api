const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extend: false }));

app.get("/", (req, res) => {
	res.status(403).json({
		message: "method not allowed",
	});
});
app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
