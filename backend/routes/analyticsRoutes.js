const express = require('express');
const { getAdmissionsDischarges, getRoomOccupancy, getAppointmentsBreakdown, getBedTurnoverRate, getAdmissionGrowthRate, getDoctorUtilization, getAverageLengthOfStay, getBedOccupancyTrend, getNoShowRate, getDoctorLoad } = require('../controllers/analyticsController');
const router = express.Router();


router.get('/discharges', getAdmissionsDischarges); 
router.get('/room-occupancy', getRoomOccupancy);//working
router.get('/appointments-breakdown', getAppointmentsBreakdown);//working
router.get('/doctor-load', getDoctorLoad);
router.get('/bed-turnover-rate', getBedTurnoverRate);
router.get('/admission-growth-rate', getAdmissionGrowthRate);
router.get('/doctor-utilization', getDoctorUtilization);
router.get('/average-length-of-stay', getAverageLengthOfStay);
router.get('/bed-occupancy-trend', getBedOccupancyTrend);
router.get('/no-show-rate', getNoShowRate);

module.exports = router;
