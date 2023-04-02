const express = require('express');
const router = express.Router();
const CoffeeController = require('../app/controllers/CoffeeController');

router.get('/:slug', CoffeeController.show);

module.exports = router;
