const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createDoctor } = require('../controllers/doctorController');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @route   POST /api/doctors
// @desc    Create new doctor (Admin only)
// @access  Private/Admin
router.post(
  '/',
  auth,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  createDoctor
);

// @route   POST /api/doctors/:id/availability
// @desc    Add availability slots
// @access  Private (Doctor/Admin)
router.post('/:id/availability', auth, async (req, res) => {
  try {
    // Validate request body
    if (!req.body.slots || !Array.isArray(req.body.slots)) {
      return res.status(400).json({ error: 'Invalid slots data' });
    }

    // Find doctor and verify ownership/admin
    const user = await User.findById(req.user.id);
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id }, // Doctor owner
        { role: 'admin' } // Admin override
      ]
    });

    if (!doctor && user.role !== 'admin') {
      return res.status(404).json({ error: 'Doctor not found or unauthorized' });
    }

    // Prepare slots
    const newSlots = req.body.slots.map(slot => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
      booked: false
    }));

    // Update availability
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $push: { availableSlots: { $each: newSlots } } },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      availableSlots: updatedDoctor.availableSlots
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: err.name === 'CastError' ? 'Invalid doctor ID' : 'Server error' 
    });
  }
});

module.exports = router;