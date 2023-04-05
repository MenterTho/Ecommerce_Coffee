const express = require("express");
const router = express.Router();
const CoffeeController = require("../app/controllers/CoffeeController");
router.get("/create", CoffeeController.create);
router.post("/store", CoffeeController.store);
router.get("/:slug", CoffeeController.show);

module.exports = router;
