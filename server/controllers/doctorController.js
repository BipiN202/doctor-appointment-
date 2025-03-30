const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Search doctors
// @route   GET /api/doctors/search
exports.searchDoctors = async (req, res) => {
  try {
    const { specialty, name } = req.query;
    const query = {};
    
    if (specialty) query.specialization = specialty;
    if (name) query.name = { $regex: name, $options: 'i' };

    const doctors = await Doctor.find(query).populate('userId', 'name email');
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create doctor profile (Admin only)
// @route   POST /api/doctors
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, hospital, availableSlots } = req.body;
    
    // Validate required fields
    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        error: 'Name and specialization are required fields'
      });
    }

    const newDoctor = await Doctor.create({
      name,
      specialization,
      hospital: hospital || 'General Hospital', // Default value
      availableSlots: availableSlots || [],
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newDoctor
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};