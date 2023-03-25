// File tuyến đường nào cũng cần tuyến đường này
const express = require("express");
const router = express.Router();
const siteControllers = require("../app/controllers/SiteController");

router.use("/search", siteControllers.search);

router.use("/", siteControllers.home);

module.exports = router;
