const express = require('express');
const { seedBeds, assignRoomsAndBeds } = require('../controllers/seedUsers');
const { getAllBeds, wipeBeds } = require('../controllers/bedController');
const router = express.Router();
router.post('/seed', seedBeds);
router.get('/', getAllBeds);
router.post('/assign-rooms-beds', assignRoomsAndBeds);
router.delete('/wipe', wipeBeds);

module.exports = router;