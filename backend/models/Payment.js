const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  registrationId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, required: true },
  txHash: { type: String },
  paymentDate: { type: String, default: () => new Date().toLocaleString() }
});

module.exports = mongoose.model('Payment', paymentSchema);
