// server/controllers/statsController.js
const Appointment = require('../models/Appointment');

exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalAppointments: await Appointment.countDocuments(),
      upcomingAppointments: await Appointment.countDocuments({
        date: { $gte: new Date() },
        status: { $ne: 'cancelled' }
      }),
      completedAppointments: await Appointment.countDocuments({
        status: 'completed'
      })
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};