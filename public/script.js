async function chargerMembres() {
  const res = await fetch('/membres');
  const membres = await res.json();
  const tbody = document.querySelector('#membresTable tbody');
  tbody.innerHTML = '';

  membres.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.nom}</td>
      <td>${m.telephone}</td>
      <td>${m.instrument}</td>
      <td>${m.date_enregistrement}</td>
      <td>
        <button onclick="supprimer(${m.id})">🗑 Supprimer</button>
        <button onclick="modifier(${m.id}, '${m.nom}')">✏ Modifier</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function supprimer(id) {
  if (confirm('Supprimer ce membre ?')) {
    await fetch(`/membres/${id}`, { method: 'DELETE' });
    chargerMembres();
  }
}

async function modifier(id, ancienNom) {
  const nouveauNom = prompt("Entrez le nouveau nom :", ancienNom);
  if (!nouveauNom) return;

  const data = await fetch(`/membres`).then(r => r.json());
  const membre = data.find(m => m.id === id);
  membre.nom = nouveauNom;

  await fetch(`/membres/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membre)
  });

  chargerMembres();
}

chargerMembres();
