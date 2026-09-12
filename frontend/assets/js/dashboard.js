const CriptoCaju = {
  decrypt: (b64, secret) => {
    try {
      let text = atob(b64);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ secret.charCodeAt(i % secret.length));
      }
      return result;
    } catch(e) {
      return "FALHA";
    }
  }
};

let ocorrenciasCache = [];

document.addEventListener('DOMContentLoaded', () => {
  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      if (!user || !user.email.includes('admin')) {
        alert('Acesso restrito.');
        window.location.replace('/login');
      } else {
        document.getElementById('adminNameDisplay').textContent = user.email;
        loadOcorrencias();
      }
    });
  }

  document.getElementById('btnAdminSair').addEventListener('click', async (e) => {
    e.preventDefault();
    await window.auth.signOut();
    window.location.replace('/');
  });

  document.getElementById('btnDecrypt').addEventListener('click', () => {
    const secret = document.getElementById('masterKeyInput').value;
    if (!secret) return alert('Insira a chave mestre.');
    renderTable(secret);
  });
});

async function loadOcorrencias() {
  try {
    const snapshot = await window.db.collection('ocorrencias').orderBy('created_at', 'desc').get();
    ocorrenciasCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable();
  } catch(error) {
    console.error(error);
    alert('Erro ao carregar dados. Verifique as Regras de Segurança do Firebase.');
  }
}

function renderTable(secretKey = null) {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';

  ocorrenciasCache.forEach(ocor => {
    let metadadosDisplay = ocor.metadados_criptografados ? `<span style="font-family: monospace; font-size: 10px; word-break: break-all;">${ocor.metadados_criptografados.substring(0, 20)}... (Criptografado)</span>` : 'N/A';
    
    if (secretKey && ocor.metadados_criptografados) {
      const dec = CriptoCaju.decrypt(ocor.metadados_criptografados, secretKey);
      if (dec !== "FALHA" && dec.includes('"ip"')) {
        try {
          const json = JSON.parse(dec);
          metadadosDisplay = `<span style="color: #10b981; font-size: 11px;">IP: ${json.ip}<br>Lat: ${json.lat.toFixed(4)}<br>Nav: ${json.navegador.substring(0, 15)}...</span>`;
        } catch(e) {}
      } else {
        metadadosDisplay = `<span style="color: #ef4444;">Chave Inválida</span>`;
      }
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${ocor.alvo || ''}</strong></td>
      <td>${ocor.categoria || ''}</td>
      <td>${metadadosDisplay}</td>
      <td><span class="badge ${ocor.status === 'ativo' ? 'approved' : 'pending'}">${ocor.status.toUpperCase()}</span></td>
      <td class="actions">
        <button onclick="toggleStatus('${ocor.id}', '${ocor.status}')" style="background: ${ocor.status === 'ativo' ? '#f59e0b' : '#10b981'}; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;">
          ${ocor.status === 'ativo' ? 'Ocultar' : 'Ativar'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'ativo' ? 'oculto' : 'ativo';
  try {
    await window.db.collection('ocorrencias').doc(id).update({ status: newStatus });
    // Atualiza cache e re-renderiza
    const ocor = ocorrenciasCache.find(o => o.id === id);
    if(ocor) ocor.status = newStatus;
    const secret = document.getElementById('masterKeyInput').value;
    renderTable(secret);
  } catch(error) {
    alert('Erro ao alterar status.');
  }
};
