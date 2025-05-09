document.getElementById('enregistrementForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche la soumission classique du formulaire

  // Récupérer toutes les données du formulaire
  const formData = new FormData(event.target);
  const data = {};

  // Transformer FormData en un objet simple
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Log des données envoyées pour vérifier
  console.log('Données envoyées:', data);

  // Envoi de la requête POST à l'API
  try {
    const response = await fetch('http://localhost:3000/api/enregistrer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convertir l'objet data en JSON
    });

    const result = await response.json();

    // Vérification de la réponse du serveur
    if (result.success) {
      alert('Enregistrement réussi !');
      document.getElementById('enregistrementForm').reset(); // Réinitialiser le formulaire après succès
    } else {
      alert('Erreur : ' + result.message);
    }
  } catch (error) {
    console.error('Erreur d\'enregistrement:', error);
    alert('Erreur d\'enregistrement');
  }
});
