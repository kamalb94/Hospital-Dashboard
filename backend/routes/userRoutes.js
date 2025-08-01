const express = require('express');
const { seedUsers, seedPatients } = require('../controllers/seedUsers');
const { getAllUsers, getAllDoctors, getAllNurses, getAllReceptionists, getAllLabs, getAllAdmins, getAllPatients } = require('../controllers/UserController');
const router = express.Router();


router.post('/seed', seedUsers);
router.get('/', getAllUsers);
router.get('/doctors', getAllDoctors);
router.get('/nurses', getAllNurses);
router.get('/receptionists', getAllReceptionists);
router.get('/labs', getAllLabs);
router.get('/admins', getAllAdmins);
router.get('/patients', getAllPatients);

module.exports = router;
