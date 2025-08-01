const express = require('express');
const { seedAppointments } = require('../controllers/seedUsers');
const { getAllAppointments, wipeAppointmentsData, updateAppointmentDates, getLast7DaysAppointments, getRecentAppointmentsWithPatientDetails } = require('../controllers/appointmentController');
const router = express.Router();

router.post('/seed', seedAppointments);
router.get('/', getAllAppointments);
router.delete('/wipe', wipeAppointmentsData);
router.post('/update', updateAppointmentDates);
router.get('/last-7days', getLast7DaysAppointments);
router.get('/recent-patients', getRecentAppointmentsWithPatientDetails);


module.exports = router;