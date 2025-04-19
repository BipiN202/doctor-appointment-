
const express = require('express');
const { createAppointment, getAppointments } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createAppointment);
router.get('/', auth, getAppointments);

module.exports = router;