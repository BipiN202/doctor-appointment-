// server/models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availableSlots: [{ type: Date }],
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
});

availableSlots: [{
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  booked: { type: Boolean, default: false }
}]

module.exports = mongoose.model('Doctor', doctorSchema);