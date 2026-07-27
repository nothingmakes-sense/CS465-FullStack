var express = require('express');
var router = express.Router();

const tripsController = require('../controllers/trips');

router.get('/trips', tripsController.tripsList);
router.get('/trips/:tripCode', tripsController.tripsFindByCode);
module.exports = router;