const express = require("express");
const request = require("request");

const router = express.Router();

const handler = require("../handler.js");

// library
const cecan = require("./db/cecan.json");

// endpoint
const images = [
	{
		name: "cecan",
		url: random(cecan),
	},
];
router.get("/:name", async (req, res) => {
	const { name } = req.params;
	const image = images.find((img) => img.name === name);
	if (!image) {
		return res.json(handler.error.notAllowed);
	}
	try {
		request(
			{
				url: image.url,
				encoding: null,
			},
			(error, response, buffer) => {
				if (!error && response.statusCode === 200) {
					res.set("Content-Type", "image/jpeg");
					res.send(response.body);
				} else {
					res.json(handler.error.default);
				}
			}
		);
	} catch (e) {
		res.json(handler.error.internalError);
	}
});
function random(_a) {
	return _a[Math.floor(_a.length * Math.random())];
}
module.exports = router;
