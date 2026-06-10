require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('./models/Registration');
const Payment = require('./models/Payment');

const MONGODB_URI = process.env.MONGODB_URI;

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
}

async function disconnectMongo() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

async function getRegistrations() {
  return await Registration.find().sort({ registeredAt: -1 });
}

async function getRegistrationById(id) {
  return await Registration.findById(id);
}

async function createRegistration(reg) {
  const newReg = new Registration({
    name: reg.name,
    nickname: reg.nickname,
    mohalla: reg.mohalla,
    contactNumber: reg.contactNumber,
    battingStyle: reg.battingStyle,
    paymentMethod: reg.paymentMethod || 'Traditional',
    paymentStatus: reg.paymentStatus || 'Pending',
    registeredAt: reg.registeredAt || new Date().toLocaleString()
  });
  await newReg.save();
  return newReg;
}

async function updateRegistration(id, reg) {
  return await Registration.findByIdAndUpdate(
    id,
    {
      name: reg.name,
      nickname: reg.nickname,
      mohalla: reg.mohalla,
      contactNumber: reg.contactNumber,
      battingStyle: reg.battingStyle,
      paymentMethod: reg.paymentMethod,
      paymentStatus: reg.paymentStatus
    },
    { new: true }
  );
}

async function deleteRegistration(id) {
  await Registration.findByIdAndDelete(id);
  return { success: true };
}

async function getPayments() {
  return await Payment.find().sort({ paymentDate: -1 });
}

async function getPaymentById(id) {
  return await Payment.findById(id);
}

async function createPayment(pay) {
  const newPay = new Payment({
    registrationId: pay.registrationId,
    amount: pay.amount,
    currency: pay.currency,
    method: pay.method,
    status: pay.status,
    txHash: pay.txHash,
    paymentDate: pay.paymentDate || new Date().toLocaleString()
  });
  await newPay.save();
  // Return structure matching SQLite for ID
  return { id: newPay._id.toString(), ...pay };
}

async function deletePayment(id) {
  await Payment.findByIdAndDelete(id);
  return { success: true };
}

module.exports = {
  connectMongo,
  disconnectMongo,
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment
};
