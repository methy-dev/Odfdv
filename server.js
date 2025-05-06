const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Pour servir le HTML, CSS, JS

// Connexion à la base SQLite
const db = new sqlite3.Database('./membres.db', (err) => {
  if (err) return console.error('Erreur DB:', err.message);
  console.log('Connexion réussie à SQLite');
});

// Création de la table si elle n'existe pas
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
  competence TEXT
)`);

// Route pour traiter le formulaire
app.post('/enregistrer', (req, res) => {
  const {
    nom,
    "date-de-naissance": date_naissance,
    telephone,
    adress,
    anciennete,
    baptise,
    instrument,
    partition,
    secondChoix,
    "second-choix": interets, // Champ mal nommé dans HTML → à corriger si possible
    eglise,
    tempsOrchestre,
    etudes,
    competence
  } = req.body;

  const sql = `INSERT INTO membres (
    nom, date_naissance, telephone, adress, anciennete, baptise, instrument,
    partition, second_choix, interets, eglise, temps_orchestre, etudes, competence
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    nom, date_naissance, telephone, adress, anciennete, baptise, instrument,
    partition, secondChoix, interets, eglise, tempsOrchestre, etudes, competence
  ], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur lors de l\'enregistrement.');
    } else {
      console.log(`Nouveau membre inséré avec ID ${this.lastID}`);
      res.send('Enregistrement réussi !');
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
