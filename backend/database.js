const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
  }
});

function initDb() {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nickname TEXT NOT NULL,
        mohalla TEXT NOT NULL,
        contactNumber TEXT NOT NULL,
        battingStyle TEXT NOT NULL,
        paymentMethod TEXT,
        paymentStatus TEXT DEFAULT 'Pending',
        registeredAt TEXT NOT NULL
      )
    `;
    db.run(query, (err) => {
      if (err) {
        console.error('Error creating registrations table:', err.message);
        reject(err);
      } else {
        console.log('Registrations table initialized successfully.');
        resolve();
      }
    });
  });
}

function getRegistrations() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM registrations ORDER BY registeredAt DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getRegistrationById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM registrations WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function createRegistration(reg) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO registrations (id, name, nickname, mohalla, contactNumber, battingStyle, paymentMethod, paymentStatus, registeredAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      reg.id,
      reg.name,
      reg.nickname,
      reg.mohalla,
      reg.contactNumber,
      reg.battingStyle,
      reg.paymentMethod || null,
      reg.paymentStatus || 'Pending',
      reg.registeredAt || new Date().toLocaleString()
    ];
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: reg.id, ...reg });
    });
  });
}

function updateRegistration(id, reg) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE registrations
      SET name = ?, nickname = ?, mohalla = ?, contactNumber = ?, battingStyle = ?, paymentMethod = ?, paymentStatus = ?
      WHERE id = ?
    `;
    const params = [
      reg.name,
      reg.nickname,
      reg.mohalla,
      reg.contactNumber,
      reg.battingStyle,
      reg.paymentMethod,
      reg.paymentStatus,
      id
    ];
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id, ...reg });
    });
  });
}

function deleteRegistration(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM registrations WHERE id = ?`, [id], function(err) {
      if (err) reject(err);
      else resolve({ success: true });
    });
  });
}

module.exports = {
  initDb,
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration
};
