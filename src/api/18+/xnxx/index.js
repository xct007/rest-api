const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");

const router = express.Router();

const handler = require("../../handler.js");

async function search(query) {
	return new Promise(async (resolve, reject) => {
		axios
			.request({
				url: `https://www.xnxx.com/search/${query}`,
				method: "GET",
				headers: {
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				},
			})
			.then(({ data }) => {
				const $ = cheerio.load(data);
				const __result = [];
				$(".mozaique")
					.find("div.thumb-block")
					.each((i, e) => {
						const __html = $(e).html();
						const __url = `https://www.xnxx.com${$(e).find("a").attr("href")}`;
						const __thumb = $(e).find("div.thumb > a > img").attr("data-src");
						const __title = $(e).find("p > a").text();
						const __views = $(e)
							.find("p.metadata > span.right")
							.text()
							.replace(/\n/g, "");
						const __quality = $(e)
							.find("p.metadata > span.video-hd")
							.text()
							.replace(/ - {2}/g, "");
						const __duration = $(e)
							.find("div.thumb-under > p.metadata")
							.text()
							.replace(__views, "")
							.replace(__quality, "")
							.replace(/\n\n/g, "")
							.replace(/\n - {2}/g, "");
						__result.push({
							title: __title,
							thumb: __thumb,
							views: __views,
							quality: __quality,
							duration: __duration,
							url: __url,
						});
					});
				resolve(__result);
			})
			.catch(reject);
	});
}
async function dl(url) {
	return new Promise(async (resolve, reject) => {
		axios
			.request({
				url,
				method: "GET",
				headers: {
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
					cookie:
						"PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
				},
			})
			.then(({ data }) => {
				const $ = cheerio.load(data);
				const __dl = $("#video-player-bg > script:nth-child(6)").get()[0]
					.children[0].data;
				const __url = __dl.match(/(((https?:\/\/)|(www\.))[^\s]+)/g);
				const __sd = __url[0].replace("');", "");
				const __hd = __url[1].replace("');", "");
				const __hls = __url[2].replace("');", "");
				const __title = $(".clear-infobar > strong:nth-child(1)").text();
				const __info = $("span.metadata")
					.text()
					.replace("\t\t\t\t\t", " ")
					.replace(" \t\t\t\t", "")
					.replace(/\n/, "")
					.replace(/\n/, " ")
					.replace("\t\t\t\t\t", "");
				const __description = $("p.metadata-row").text().replace(/\n/g, "");
				resolve({
					title: __title,
					info: __info,
					description: __description,
					downloads: {
						sd: __sd,
						hd: __hd,
						hls: __hls,
					},
				});
			})
			.catch(reject);
	});
}
router.get("/", (req, res) => {
	res.json(handler.error.notAllowed);
});
router.get("/search", (req, res) => {
	const q = req.query.query;
	if (!q) {
		return res.json(handler.error.query);
	}
	search(q)
		.then((data) => {
			res.json({
				status: handler.success.default,
				creator: handler.creator,
				result: data,
			});
		})
		.catch(() => {
			res.json(handler.error.internalError);
		});
});
router.get("/download", (req, res) => {
	const q = req.query.url;
	if (!q) {
		return res.json(handler.error.url);
	}
	dl(q)
		.then((data) => {
			res.json({
				status: handler.success.default,
				creator: handler.creator,
				result: data,
			});
		})
		.catch(() => {
			res.json(handler.error.internalError);
		});
});
module.exports = router;
