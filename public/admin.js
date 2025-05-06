// Récupérer les enregistrements depuis le serveur
async function fetchRecords() {
    try {
      const response = await fetch('/api/records');
      const records = await response.json();
  
      const tableBody = document.querySelector('#records-table tbody');
      tableBody.innerHTML = '';
  
      records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.id}</td>
          <td>${record.name}</td>
          <td>${record.telephone}</td>
          <td>${record.instrument}</td>
          <td><button onclick="deleteRecord(${record.id})">Supprimer</button></td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des enregistrements:', error);
    }
  }
  
  // Supprimer un enregistrement
  async function deleteRecord(id) {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRecords();  // Réactualiser la liste après suppression
      } else {
        console.error('Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
  
  // Formulaire de suppression
  document.querySelector('#delete-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const deleteId = document.querySelector('#delete-id').value;
    if (deleteId) {
      deleteRecord(deleteId);
    }
  });
  
  // Charger les enregistrements au chargement de la page
  fetchRecords();
  