document.getElementById('enregistrement-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    fetch('/enregistrer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);

      // Reinistialiser les chapmps du formulaires
      document.getElementById('enregistrement-form').reset();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  