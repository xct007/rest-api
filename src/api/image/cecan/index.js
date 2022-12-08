const express = require("express");
const request = require("request");

const router = express.Router();

const handler = require("../../handler.js");

const database = require("./cecan.json");

router.get("/", async (req, res) => {
	try {
		request(
			{
				url: database[Math.floor(database.length * Math.random())],
				encoding: null,
			},
			(error, response, buffer) => {
				if (!error && response.statusCode === 200) {
					res.set("Content-Type", "image/jpeg");
					res.send(response.body);
				}
			}
		);
	} catch (e) {
		res.json(handler.error.internalError);
	}
});

module.exports = router;
