const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware pour parser les données JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour enregistrer les données du formulaire
app.post('/enregistrer', (req, res) => {
  console.log('Données reçues :', req.body);

  // Vérifier si les données sont présentes dans la requête
  if (!req.body) {
    return res.status(400).json({ message: "Aucune donnée reçue" });
  }

  // Chemin vers le fichier d'enregistrement
  const filePath = path.join(__dirname, 'enregistrements.json');

  // Lire le fichier pour récupérer les enregistrements existants
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier :', err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    let enregistrements = [];
    if (data) {
      enregistrements = JSON.parse(data);  // Convertir enregistrements existants en tableau
    }

    // Ajouter les nouvelles données du formulaire
    enregistrements.push(req.body);

    // Sauvegarder les nouvelles données dans le fichier JSON
    fs.writeFile(filePath, JSON.stringify(enregistrements, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement" });
      }

      // Retourner une réponse après l'enregistrement réussi
      res.status(200).json({ message: "Formulaire enregistré avec succès !" });
    });
  });
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Le serveur fonctionne sur http://localhost:3000');
});
