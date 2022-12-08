const express = require("express");

const router = express.Router();

const tiktok = require("./downloader/tiktok");
const youtube = require("./downloader/youtube");
const pixiv = require("./downloader/pixiv");
const image = require("./image");
const _18 = require("./18+");

router.use("/tiktok", tiktok);
router.use("/youtube", youtube);
router.use("/pixiv", pixiv);
router.use("/image", image);
router.use("/18", _18);

module.exports = router;
