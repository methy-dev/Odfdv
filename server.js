const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new Database('./membres.db');

// Création de la table avec date_enregistrement
db.prepare(`
  CREATE TABLE IF NOT EXISTS membres (
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
    date_enregistrement TEXT DEFAULT (datetime('now', 'localtime'))
  )
`).run();

// Route POST pour enregistrer un membre
app.post('/enregistrer', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`
    INSERT INTO membres (
      nom, date_naissance, telephone, adress, anciennete, baptise, instrument,
      partition, second_choix, interets, eglise, temps_orchestre, etudes, competence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    data.nom, data["date-de-naissance"], data.telephone, data.adress, data.anciennete, data.baptise,
    data.instrument, data.partition, data.secondChoix, data.interets, data.eglise,
    data.tempsOrchestre, data.etudes, data.competence
  ]);
  res.sendStatus(200);
});

// Route GET pour récupérer tous les membres
app.get('/membres', (req, res) => {
  const membres = db.prepare('SELECT * FROM membres ORDER BY id DESC').all();
  res.json(membres);
});

// Route DELETE pour supprimer un membre
app.delete('/membres/:id', (req, res) => {
  db.prepare('DELETE FROM membres WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

// Route PUT pour modifier un membre
app.put('/membres/:id', (req, res) => {
  const data = req.body;
  db.prepare(`
    UPDATE membres SET
      nom = ?, date_naissance = ?, telephone = ?, adress = ?, anciennete = ?,
      baptise = ?, instrument = ?, partition = ?, second_choix = ?, interets = ?,
      eglise = ?, temps_orchestre = ?, etudes = ?, competence = ?
    WHERE id = ?
  `).run([
    data.nom, data.date_naissance, data.telephone, data.adress, data.anciennete,
    data.baptise, data.instrument, data.partition, data.second_choix, data.interets,
    data.eglise, data.temps_orchestre, data.etudes, data.competence,
    req.params.id
  ]);
  res.sendStatus(200);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
