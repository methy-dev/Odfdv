// Importation des modules nécessaires
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour le parsing du body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Connexion via variable d'environnement
  ssl: {
    rejectUnauthorized: false, // Pour la connexion SSL dans Render
  },
});

// Créer la table si elle n'existe pas
const createTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS membres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    date_de_naissance DATE,
    telephone VARCHAR(15),
    adresse VARCHAR(255),
    anciennete VARCHAR(100),
    batise BOOLEAN,
    instrument VARCHAR(100),
    partiti VARCHAR(100),
    secondChoix VARCHAR(100),
    interets VARCHAR(100),
    eglise VARCHAR(100),
    tempsOrchestre VARCHAR(100),
    etudes VARCHAR(100),
    competence VARCHAR(255)
  );
  `;
  try {
    await pool.query(query);
    console.log('Table "membres" vérifiée/créée avec succès');
  } catch (err) {
    console.error('Erreur lors de la création de la table:', err);
  }
};

// Initialisation de la table au démarrage
createTable();

// Route POST pour enregistrer les données du formulaire dans PostgreSQL
app.post("/api/enregistrer", async (req, res) => {
  console.log('Données reçues :', req.body);

  const {
    nom,
    'date-de-naissance': dateDeNaissance,
    telephone,
    adresse,
    anciennete,
    batise,
    instrument,
    partiti,
    secondChoix,
    interets,
    eglise,
    tempsOrchestre,
    etudes,
    competence,
  } = req.body;

  // Conversion de "oui"/"non" en boolean pour la colonne "batise"
  const batiseBool = batise && batise.toLowerCase() === 'oui';

  const insertQuery = `
    INSERT INTO membres (
      nom, date_de_naissance, telephone, adresse, anciennete, batise, instrument, partiti,
      secondChoix, interets, eglise, tempsOrchestre, etudes, competence
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
  `;
// Route GET pour récupérer tous les membres
app.get("/api/membres", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM membres');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des membres:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des membres.' });
  }
});
// Route GET pour récupérer un membre spécifique par ID
app.get("/api/membres/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM membres WHERE id = $1', [id]);
    
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Membre non trouvé.' });
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du membre:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails du membre.' });
  }
});

// Route DELETE pour supprimer un membre
app.delete("/api/membres/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM membres WHERE id = $1', [id]);
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Membre supprimé avec succès.' });
    } else {
      res.status(404).json({ message: 'Membre non trouvé.' });
    }
  } catch (err) {
    console.error('Erreur lors de la suppression du membre:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
});

  try {
    // Insertion des données dans la base
    await pool.query(insertQuery, [
      nom, dateDeNaissance, telephone, adresse, anciennete, batiseBool, instrument, partiti,
      secondChoix, interets, eglise, tempsOrchestre, etudes, competence
    ]);
    res.status(200).json({ message: 'Données enregistrées avec succès.' });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des données:', err);
    res.status(500).json({
      message: 'Erreur lors de l\'enregistrement des données.',
      erreur: err.message,
    });
  }
});

// Servir les fichiers HTML statiques (formulaire)
app.use(express.static('public'));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});
