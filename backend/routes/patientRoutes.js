const express = require('express');
const { seedPatients } = require('../controllers/seedUsers');
const { getPatientById, getAllPatients, updatePatientStatuses, destroyAllPatients, wipePatientsData } = require('../controllers/patientController');

const router = express.Router();

router.post('/seed', seedPatients);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/update', updatePatientStatuses)
router.delete('/wipe', wipePatientsData)

module.exports = router;