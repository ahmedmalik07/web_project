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
