const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { Parser } = require('json2csv');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// DB SQLite
const db = new sqlite3.Database('./membres.db', (err) => {
  if (err) return console.error('Erreur ouverture DB:', err.message);
  console.log('Base de données SQLite connectée');
});

// Création de la table avec date automatique
db.run(`CREATE TABLE IF NOT EXISTS membres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  date_naissance TEXT,
  telephone TEXT,
  adress TEXT,
  anciennete TEXT,
  baptise TEXT,
  instrument TEXT,
  partition TEXT,
  second_choix TEXT,
  interets TEXT,
  eglise TEXT,
  temps_orchestre TEXT,
  etudes TEXT,
  competence TEXT,
  date_enregistrement TEXT DEFAULT CURRENT_TIMESTAMP
)`);

// Route pour ajouter un membre
app.post('/ajouter', (req, res) => {
  const data = req.body;

  const sql = `INSERT INTO membres (
    nom, date_naissance, telephone, adress, anciennete, baptise, instrument, partition,
    second_choix, interets, eglise, temps_orchestre, etudes, competence
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.nom, data.date_naissance, data.telephone, data.adress, data.anciennete,
    data.baptise, data.instrument, data.partition, data.second_choix, data.interets,
    data.eglise, data.temps_orchestre, data.etudes, data.competence
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erreur ajout membre :', err.message);
      return res.status(500).json({ error: 'Erreur ajout' });
    }
    console.log('Membre ajouté avec ID', this.lastID);
    res.json({ message: 'Membre ajouté', id: this.lastID });
  });
});

// Route pour récupérer tous les membres
app.get('/membres', (req, res) => {
  db.all('SELECT * FROM membres ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Erreur récupération membres :', err.message);
      return res.status(500).json({ error: 'Erreur récupération' });
    }
    res.json(rows);
  });
});

// Route d’export CSV
app.get('/export', (req, res) => {
  db.all('SELECT * FROM membres ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Erreur export CSV :', err.message);
      return res.status(500).json({ error: 'Erreur export' });
    }

    const fields = Object.keys(rows[0] || {});
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    fs.writeFileSync('./public/export.csv', csv, 'utf8');
    res.download('./public/export.csv', 'membres.csv');
  });
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`Serveur en ligne : http://localhost:${PORT}`);
});
