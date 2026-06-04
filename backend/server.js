const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database');

// Middleware
app.use(cors());
app.use(express.json());

// Import data
const players = require('./data/players');
const tournaments = require('./data/tournaments');
const teams = require('./data/teams');

// Routes
// GET /players - Get all players
app.get('/players', (req, res) => {
  const game = req.query.game;
  
  if (game) {
    // Filter players by game
    const filteredPlayers = players.filter(player => 
      player.game.toLowerCase() === game.toLowerCase()
    );
    return res.json(filteredPlayers);
  }
  
  // Return all players
  res.json(players);
});

// GET /tournaments - Get all tournaments
app.get('/tournaments', (req, res) => {
  res.json(tournaments);
});

// GET /teams - Get all teams
app.get('/teams', (req, res) => {
  res.json(teams);
});

// GET /players/:id - Get single player by ID
app.get('/players/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player);
});

// GET /teams/:id - Get single team by ID
app.get('/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.id));
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

// GET /registrations - Get all registrations
app.get('/registrations', async (req, res) => {
  try {
    const list = await db.getRegistrations();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /registrations/:id - Get specific registration
app.get('/registrations/:id', async (req, res) => {
  try {
    const reg = await db.getRegistrationById(req.params.id);
    if (!reg) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /registrations - Create tournament registration
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
    const created = await db.createRegistration(newReg);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /registrations/:id - Update tournament registration
app.put('/registrations/:id', async (req, res) => {
  try {
    const { name, nickname, mohalla, contactNumber, battingStyle, paymentMethod, paymentStatus } = req.body;
    const updated = await db.updateRegistration(req.params.id, {
      name,
      nickname,
      mohalla,
      contactNumber,
      battingStyle,
      paymentMethod,
      paymentStatus
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /registrations/:id - Delete tournament registration
app.delete('/registrations/:id', async (req, res) => {
  try {
    await db.deleteRegistration(req.params.id);
    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 3000;
db.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Players API: http://localhost:${PORT}/players`);
    console.log(`🏆 Tournaments API: http://localhost:${PORT}/tournaments`);
    console.log(`👥 Teams API: http://localhost:${PORT}/teams`);
    console.log(`🎮 Filter by game: http://localhost:${PORT}/players?game=Tapeball`);
  });
}).catch(err => {
  console.error("Failed to initialize database:", err.message);
});
