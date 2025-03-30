const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    
    // Check doctor availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor.availableSlots.includes(new Date(date))) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date
    });

    // Remove slot from doctor's availability
    doctor.availableSlots = doctor.availableSlots.filter(slot => 
      slot.toString() !== new Date(date).toString()
    );
    await doctor.save();

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id } // For doctors to see their appointments
      ]
    }).populate('patient doctor', 'name email specialization');
    
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
// controllers/appointmentController.js
exports.updateAppointment = async (req, res) => {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // Send status update email
    res.json(appointment);
  };
  // Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization email')
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization hospital');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
  