const express = require("express");

const router = express.Router();

// library
const cecan = require("./cecan");

router.use("/cecan", cecan);

module.exports = router;
