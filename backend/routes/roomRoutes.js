const express = require('express');
const { seedRooms } = require('../controllers/seedUsers');
const { deleteAllRooms, getAllRooms } = require('../controllers/roomControllers');
const router = express.Router();

router.post('/seed', seedRooms);
router.get('/', getAllRooms);
router.delete('/wipeout', deleteAllRooms);

module.exports = router;