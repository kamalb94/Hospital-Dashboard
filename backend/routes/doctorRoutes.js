const express = require('express');
const { seedDoctors } = require('../controllers/seedUsers');
const { getDoctorById, getAllDoctors, wipeDoctorsData } = require('../controllers/doctorController');

const router = express.Router();

router.post('/seed', seedDoctors);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.delete('/wipe', wipeDoctorsData);

module.exports = router; 