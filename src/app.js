const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");
const { isValidKey, updateUser, connect, createUser, emailValidator, getUserByEmail } = require("./mongodb");
connect();

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

app.get("/usage", (req, res) => {
	const key = req.query.apikey
		? req.query.apikey
		: req.query.APIKEY
		? req.query.APIKEY
		: false;
	if (!key) {
		return res.status(405).json({
			status: false,
			message: "REQUIRE APIKEY"
		})
	}
	isValidKey(key).then((data) => {
		res.status(200).json({
			status: true,
			apikey: data.apikey,
			limit: data.limit
		})
	}).catch(() => {
		res.status(500).json({
			status: false,
			message: "Internal Server Error"
		})
	})
})
app.post("/createUser", async(req, res) => {
	const Token = req.headers.authorization;
	if (!Token && Token !== process.env.TOKEN_AUTH) {
		return res.status(403).json({
			status: false,
			message: "UnAuthorizationn Request !!"
		})
	}
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const limit = req.body.limit;
	const key = req.body.apikey;
	if (!name && !email && !password) {
		return res.status(403).json({
			status: false,
			message: "Missing Input"
		})
	}
	if (!emailValidator(email)) {
		return res.status(403).json({
			status: false,
			message: "INVALID EMAIL"
		})
	}
	const isEmailRegistered = await getUserByEmail(email, true)
	if (isEmailRegistered) {
		return res.status(403).json({
			status: false,
			message: "Email Already Registered"
		})
	}
	createUser(name, limit, email, password, key).then((data) => {
		res.status(200).json({
			status: true,
			user: data
		})
	}).catch(() => {
		res.status(500).json({
			status: false,
			message: "Internal Server Error"
		})
	})
})
app.use(
	"/api",
	async (req, res, next) => {
		const key = req.query.apikey
			? req.query.apikey
			: req.query.APIKEY
			? req.query.APIKEY
			: false;
		if (!key) {
			return res.status(405).json({
				status: false,
				message: "REQUIRE APIKEY",
			});
		}
		const _key = key;
		if (_key) {
			const isValid = await isValidKey(_key);
			if (isValid) {
				await updateUser(isValid.name, isValid.limit - 1, false);
				if (isValid.limit == 0) {
					return res.status(405).json({
						status: false,
						message: "LIMIT IS 0",
					});
				}
				next();
			} else {
				return res.status(405).json({
					status: false,
					message: "INVALID APIKEY",
				});
			}
		}
	},
	api
);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
