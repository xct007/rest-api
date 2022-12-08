const express = require("express");

const router = express.Router();

// library
const xnxx = require("./xnxx");

router.use("/xnxx", xnxx);

module.exports = router;
