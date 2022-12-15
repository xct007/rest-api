const express = require("express");
const request = require("request");

const router = express.Router();

const handler = require("../handler.js");

// endpoint

router.get("/:name", async (req, res) => {
	const { name } = req.params;
	try {
		const image = require(`./db/${name}.json`);
		request(
			{
				url: image[Math.floor(image.length * Math.random())],
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
	} catch {
		res.json(handler.error.internalError);
	}
});
/* POST METHOD ?
router.post("/:name", async (req, res) => {
	const { name } = req.params;
	try {
		const image = require(`./db/${name}.json`)
		request(
			{
				url: image[Math.floor(image.length * Math.random())],
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
	} catch {
		res.json(handler.error.internalError);
	}
});
*/
module.exports = router;

function random(a) {
	return a[Math.floor(a.length * Math.random())];
}
