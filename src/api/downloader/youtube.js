const axios = require("axios");

const express = require("express");

const router = express.Router();

const handler = require("../handler.js");

function bytesToSize(bytes) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "n/a";
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	if (i === 0) resolve(`${bytes} ${sizes[i]}`);
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
function youtube(url) {
	return new Promise((resolve, reject) => {
		let start = Date.now(),
			Url = url.replace(/www./g, "") + "&feature=youtu.be&app=m&persist_app=1",
			config = {
				url: Url,
				method: "GET",
				headers: {
					"upgrade-insecure-requests": 1,
					"user-agent":
						"Mozilla/5.0 (Linux; Android 10; CPH1825 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36",
					accept:
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"x-requested-with": "devian.tubemate.v3",
					"sec-fetch-site": "none",
					"sec-fetch-mode": "navigate",
					"sec-fetch-user": "?1",
					"sec-fetch-dest": "document",
					"accept-encoding": "gzip, deflate",
					"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
					cookie: "YSC=hpwoX3d49Dw",
					cookie: "PREF=app=m",
					cookie: "VISITOR_INFO1_LIVE=YF_zZKL80r0",
				},
			};
		axios
			.request(config)
			.then(({ data }) => {
				let regex_1 = /ytcfg.set\((.*)\);window.ytcfg/,
					regex_2 = /var ytInitialPlayerResponse = {(.*)};<\/script>/,
					parser_json = JSON.parse("{" + data.match(regex_2)[1] + "}"),
					default_output = [],
					full_output = [];
				for (let i of parser_json.streamingData.formats) {
					default_output.push({
						url: i.url || i.signatureCipher.match(/&url=(.*)/)[1] || false,
						length: i.contentLength ? bytesToSize(i.contentLength) : false,
						quality: i.qualityLabel || false,
						fps: i.fps || false,
						mimeType: i.mimeType || false,
					});
				}
				for (let i of parser_json.streamingData.adaptiveFormats) {
					full_output.push({
						url: i.url || i.signatureCipher.match(/&url=(.*)/)[1] || false,
						length: i.contentLength ? bytesToSize(i.contentLength) : false,
						bitrate: i.bitrate || false,
						quality: i.qualityLabel || i.quality || false,
						fps: i.fps || false,
						mimeType: i.mimeType || false,
					});
				}
				let result = {
						videoId: parser_json.videoDetails.videoId,
						title: parser_json.videoDetails.title,
						videoLength:
							Math.floor((parser_json.videoDetails.lengthSeconds % 3600) / 60)
								.toString()
								.padStart(2, "0") + " Minutes",
						views: parser_json.videoDetails.viewCount,
						desc: parser_json.videoDetails.shortDescription,
						author: parser_json.videoDetails.author,
						thumbnail:
							parser_json.videoDetails.thumbnail.thumbnails[
								parser_json.videoDetails.thumbnail.thumbnails.length - 1
							].url,
					},
					res = {
						short: [...default_output],
						full: [...full_output],
					};
				resolve({
					process_time: Date.now() - start,
					...result,
					urls: { ...res },
				});
			})
			.catch((e) => {
				reject(e);
			});
	});
}
router.get("/", (req, res) => {
	const urlQuery = req.query.url;
	if (urlQuery) {
		youtube(urlQuery)
			.then((data) => {
				res.json(data);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else {
		res.json(handler.error.url);
	}
});
router.post("/", (req, res) => {
	const urlBody = req.body.url;
	if (urlBody) {
		youtube(urlBody)
			.then((data) => {
				res.json(data);
			})
			.catch((e) => {
				res.json(handler.error.default);
			});
	} else {
		res.json(handler.error.url);
	}
});
module.exports = router;
