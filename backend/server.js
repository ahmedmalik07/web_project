require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import static data
const players = require('./data/players');
const tournaments = require('./data/tournaments');
const teams = require('./data/teams');

// Database selection: MongoDB preferred, SQLite fallback
const MONGODB_URI = process.env.MONGODB_URI;
let useMongo = false;
let mongoDb = null;
let sqliteDb = null;

// Try loading MongoDB module
if (MONGODB_URI) {
  try {
    mongoDb = require('./database-mongo');
  } catch (err) {
    console.warn('MongoDB module not found, will use SQLite:', err.message);
  }
}

// Try loading SQLite module
try {
  sqliteDb = require('./database');
} catch (err) {
  console.warn('SQLite module not found:', err.message);
}

// Helper to get the active DB
function db() {
  return useMongo ? mongoDb : sqliteDb;
}

// ── Static JSON Routes ─────────────────────────────────────────────

app.get('/players', (req, res) => {
  const game = req.query.game;
  if (game) {
    const filtered = players.filter(p => p.game.toLowerCase() === game.toLowerCase());
    return res.json(filtered);
  }
  res.json(players);
});

app.get('/tournaments', (req, res) => {
  res.json(tournaments);
});

app.get('/teams', (req, res) => {
  res.json(teams);
});

app.get('/players/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) return res.status(404).json({ error: 'Player not found' });
  res.json(player);
});

app.get('/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.id));
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

// ── Registration CRUD ──────────────────────────────────────────────

app.get('/registrations', async (req, res) => {
  try {
    const list = await db().getRegistrations();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/registrations/:id', async (req, res) => {
  try {
    const reg = await db().getRegistrationById(req.params.id);
    if (!reg) return res.status(404).json({ error: 'Registration not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/registrations', async (req, res) => {
  try {
    const { name, nickname, mohalla, contactNumber, battingStyle, paymentMethod, paymentStatus } = req.body;
    if (!name || !nickname || !mohalla || !contactNumber || !battingStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newReg = {
      id: Date.now().toString(),
      name,
      nickname,
      mohalla,
      contactNumber,
      battingStyle,
      paymentMethod: paymentMethod || 'Traditional',
      paymentStatus: paymentStatus || 'Pending',
      registeredAt: new Date().toLocaleString()
    };
    const created = await db().createRegistration(newReg);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/registrations/:id', async (req, res) => {
  try {
    const { name, nickname, mohalla, contactNumber, battingStyle, paymentMethod, paymentStatus } = req.body;
    const updated = await db().updateRegistration(req.params.id, {
      name, nickname, mohalla, contactNumber, battingStyle, paymentMethod, paymentStatus
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/registrations/:id', async (req, res) => {
  try {
    await db().deleteRegistration(req.params.id);
    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Payment API & CRUD ──────────────────────────────────────────────

app.post('/payments/process', async (req, res) => {
  try {
    const { player, payment } = req.body;
    
    // 1. Validation
    if (!player || !payment) {
      return res.status(400).json({ error: 'Missing player or payment details' });
    }
    
    const { name, nickname, mohalla, contactNumber, battingStyle } = player;
    if (!name || !nickname || !mohalla || !contactNumber || !battingStyle) {
      return res.status(400).json({ error: 'Missing required player registration fields' });
    }
    
    const { method, amount, currency } = payment;
    if (!method || !amount || !currency) {
      return res.status(400).json({ error: 'Missing payment method or amount information' });
    }
    
    // Custom Validation depending on payment method
    if (method === 'JazzCash' || method === 'EasyPaisa') {
      const { mobileNumber } = payment;
      if (!mobileNumber || !/^(03|923|\+923)\d{9}$/.test(mobileNumber.replace(/\s+/g, ''))) {
        return res.status(400).json({ error: 'Invalid Pakistani mobile number format for wallet checkout' });
      }
    } else if (method === 'Stripe' || method === 'PayPal') {
      const { cardNumber, expiry, cvc } = payment;
      const cleanCard = (cardNumber || '').replace(/\s+/g, '');
      if (!cleanCard || cleanCard.length < 15 || cleanCard.length > 16 || isNaN(cleanCard)) {
        return res.status(400).json({ error: 'Invalid credit card number format (must be 15 or 16 digits)' });
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        return res.status(400).json({ error: 'Invalid card expiry date (must be in MM/YY format)' });
      }
      if (!cvc || cvc.length < 3 || cvc.length > 4 || isNaN(cvc)) {
        return res.status(400).json({ error: 'Invalid card verification code (CVC must be 3 or 4 digits)' });
      }
    } else if (method === 'USDT' || method === 'BTC' || method === 'ETH') {
      const { txHash } = payment;
      if (!txHash || txHash.trim().length < 10) {
        return res.status(400).json({ error: 'Invalid cryptocurrency transaction hash / block ID' });
      }
    }
    
    // Mock authorization simulation
    if (payment.cardNumber && payment.cardNumber.endsWith('0000')) {
      return res.status(402).json({ error: 'Card transaction was declined by issuing bank (insufficient funds)' });
    }
    if (payment.mobileNumber && payment.mobileNumber.endsWith('000')) {
      return res.status(402).json({ error: 'Mobile wallet transaction failed (incorrect PIN or account locked)' });
    }
    
    // 2. Database Insertion
    const registrationId = Date.now().toString();
    const newReg = {
      id: registrationId,
      name: name.trim(),
      nickname: nickname.trim(),
      mohalla,
      contactNumber: contactNumber.trim(),
      battingStyle,
      paymentMethod: method,
      paymentStatus: 'Paid',
      registeredAt: new Date().toLocaleString()
    };
    
    const createdReg = await db().createRegistration(newReg);
    
    const paymentId = 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newPayment = {
      id: paymentId,
      registrationId,
      amount: parseInt(amount),
      currency,
      method,
      status: 'Paid',
      txHash: payment.txHash || 'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      paymentDate: new Date().toLocaleString()
    };
    
    const createdPayment = await db().createPayment(newPayment);
    
    res.status(201).json({
      success: true,
      message: 'Payment verified and registration recorded successfully!',
      registration: createdReg,
      payment: createdPayment
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/payments', async (req, res) => {
  try {
    const list = await db().getPayments();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/payments/:id', async (req, res) => {
  try {
    await db().deletePayment(req.params.id);
    res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health & DB Info ───────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    database: useMongo ? 'MongoDB' : 'SQLite',
    timestamp: new Date()
  });
});

// ── Start Server ───────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Try MongoDB first
  if (mongoDb) {
    try {
      await mongoDb.connectMongo();
      useMongo = true;
      console.log('✅ Using MongoDB for registrations');
    } catch (err) {
      console.warn('❌ MongoDB connection failed:', err.message);
      console.log('Falling back to SQLite...');
    }
  }

  // Fall back to SQLite if MongoDB is not available
  if (!useMongo && sqliteDb) {
    try {
      await sqliteDb.initDb();
      console.log('✅ Using SQLite for registrations');
    } catch (err) {
      console.error('❌ SQLite initialization failed:', err.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Players API: http://localhost:${PORT}/players`);
    console.log(`🏆 Tournaments API: http://localhost:${PORT}/tournaments`);
    console.log(`👥 Teams API: http://localhost:${PORT}/teams`);
    console.log(`📝 Registrations API: http://localhost:${PORT}/registrations`);
  });
}

startServer();
