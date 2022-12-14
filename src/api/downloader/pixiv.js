const axios = require("axios");

const express = require("express");

const router = express.Router();

const handler = require("../handler.js");

function search(query, random, r18) {
	return new Promise((res, rej) => {
		axios
			.get(
				`https://api.lolicon.app/setu/v2?size=regular&r18=${
					r18 || 0
				}&num=20&keyword=${query}`
			)
			.then(({ data }) => {
				const Data = data.data;
				const result = [];
				if (Data.length == 0) rej(false);
				for (const i of Data) {
					result.push({
						title: i.title,
						author: i.author,
						url: i.urls.regular,
						ext: i.ext,
					});
				}
				if (random == 1) {
					res(result[Math.floor(result.length * Math.random())]);
				} else {
					res(result);
				}
			})
			.catch((e) => {
				rej(false);
			});
	});
}
function pixiv(idOrQuery) {
	return new Promise((res, rej) => {
		axios
			.get(`https://api.lolicon.app/setu/v2?pid=${idOrQuery}`)
			.then(({ data }) => {
				const Data = data.data;
				Data.length == 0
					? rej(false)
					: res({
							url: Data.urls.original,
					  });
			});
	});
}
router.get("/", (req, res) => {
	const { mode } = req.query;
	const { query } = req.query;
	const { random } = req.query;
	const { r18 } = req.query;
	if (mode == "search") {
		search(query, random, r18)
			.then((data) => {
				res.json(data);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else if (mode == "get" && query) {
		pixiv(query)
			.then((a) => {
				res.json(a);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else {
		res.json({
			...handler.error.missing,
			example: {
				mode: "search",
				r18: "1",
				random: "1",
				query: "fgo",
				eg: "/api/pixiv?mode=search&query=fgo&random=1&r18=1",
			},
			notes: [
				"value 1 mean true and 0 mean false default false, mode can be 'search' or 'get', if mode is 'get' and the query is not id from pixiv it will return random",
			],
		});
	}
});
router.post("/", (req, res) => {
	const { mode } = req.body;
	const { query } = req.body;
	const { random } = req.body;
	const { r18 } = req.body;
	if (mode == "search") {
		search(query, random, r18)
			.then((data) => {
				res.json(data);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else if (mode == "get" && query) {
		pixiv(query)
			.then((a) => {
				res.json(a);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else {
		res.json({
			...handler.error.missing,
			example: {
				mode: "search",
				r18: "1",
				random: "1",
				query: "fgo",
				eg: "/api/pixiv?mode=search&query=fgo&random=1&r18=1",
			},
			notes: [
				"value 1 mean true and 0 mean false default false, mode can be 'search' or 'get', if mode is 'get' and the query is not id from pixiv it will return random",
			],
		});
	}
});
module.exports = router;
