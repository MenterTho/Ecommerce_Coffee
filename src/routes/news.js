// File tuyến đường nào cũng cần tuyến đường này
const express = require("express");
const router = express.Router();
const newControllers = require("../app/controllers/NewControllers");

router.use("/:slug", newControllers.show);
router.use("/", newControllers.index);

module.exports = router;
