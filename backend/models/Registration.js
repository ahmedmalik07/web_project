const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  mohalla: { type: String, required: true },
  contactNumber: { type: String, required: true },
  battingStyle: { type: String, required: true },
  paymentMethod: { type: String, default: 'Traditional' },
  paymentStatus: { type: String, default: 'Pending' },
  registeredAt: { type: String, default: () => new Date().toLocaleString() }
});

module.exports = mongoose.model('Registration', registrationSchema);
