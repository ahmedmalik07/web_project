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
    const regQuery = `
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
    db.run(regQuery, (err) => {
      if (err) {
        console.error('Error creating registrations table:', err.message);
        return reject(err);
      }
      
      const payQuery = `
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          registrationId TEXT NOT NULL,
          amount INTEGER NOT NULL,
          currency TEXT NOT NULL,
          method TEXT NOT NULL,
          status TEXT NOT NULL,
          txHash TEXT,
          paymentDate TEXT NOT NULL
        )
      `;
      db.run(payQuery, (err2) => {
        if (err2) {
          console.error('Error creating payments table:', err2.message);
          return reject(err2);
        }
        console.log('Registrations and Payments tables initialized successfully.');
        resolve();
      });
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

function getPayments() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM payments ORDER BY paymentDate DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getPaymentById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM payments WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function createPayment(payment) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO payments (id, registrationId, amount, currency, method, status, txHash, paymentDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      payment.id,
      payment.registrationId,
      payment.amount,
      payment.currency,
      payment.method,
      payment.status,
      payment.txHash || null,
      payment.paymentDate || new Date().toLocaleString()
    ];
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: payment.id, ...payment });
    });
  });
}

function deletePayment(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM payments WHERE id = ?`, [id], function(err) {
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
  deleteRegistration,
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment
};
