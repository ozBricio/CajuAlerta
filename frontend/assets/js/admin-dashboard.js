document.addEventListener('DOMContentLoaded', () => {
  // Configuração e proteção da página
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const userDoc = await firebase.firestore().collection('usuarios').doc(user.uid).get();
      const userData = userDoc.data();

      // Trava de Segurança Level Staff
      if (!userData || userData.role !== 'staff') {
        alert('Acesso Negado: Área restrita para membros da equipe.');
        window.location.href = 'index.html';
        return;
      }

      // Inicializa Painel
      document.getElementById('adminNameDisplay').textContent = `Olá, ${userData.nome.split(' ')[0]}`;
      initAdminPanel();
      
    } catch (error) {
      console.error(error);
      alert('Erro de permissão.');
      window.location.href = 'login.html';
    }
  });
});

function initAdminPanel() {
  // Navegação do Menu
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.admin-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Logout
  document.getElementById('btnSairAdmin').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.location.href = 'login.html';
    });
  });

  // Carregar Dados do Banco
  loadStats();
  loadUsers();
  loadHistory();
}

async function loadStats() {
  const usersSnap = await firebase.firestore().collection('usuarios').get();
  let countBlocked = 0;
  
  usersSnap.forEach(doc => {
    if (doc.data().status === 'bloqueado') countBlocked++;
  });

  document.getElementById('statUsers').textContent = usersSnap.size;
  document.getElementById('statBlocked').textContent = countBlocked;

  const denunciasEmail = await firebase.firestore().collection('denuncias_emails').get();
  const denunciasTel = await firebase.firestore().collection('denuncias_telefones').get();
  const denunciasSite = await firebase.firestore().collection('denuncias_sites').get();
  
  document.getElementById('statDenuncias').textContent = denunciasEmail.size + denunciasTel.size + denunciasSite.size;
}

async function loadUsers() {
  const tbody = document.getElementById('tableUsersBody');
  const snap = await firebase.firestore().collection('usuarios').orderBy('criadoEm', 'desc').get();
  
  tbody.innerHTML = '';
  snap.forEach(doc => {
    const data = doc.data();
    const isBlocked = data.status === 'bloqueado';
    const isStaff = data.role === 'staff';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.nome}</td>
      <td>${data.email}</td>
      <td><span class="status ${data.status}">${data.status.toUpperCase()}</span></td>
      <td><span class="status ${data.role}">${data.role.toUpperCase()}</span></td>
      <td>
        ${!isStaff ? (
          isBlocked 
            ? `<button class="btn-action unblock" onclick="toggleUserStatus('${doc.id}', 'ativo')">Desbloquear</button>`
            : `<button class="btn-action block" onclick="toggleUserStatus('${doc.id}', 'bloqueado')">Bloquear</button>`
        ) : '<span style="color:#6b7280; font-size:0.8rem;">Protegido</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleUserStatus = async function(uid, newStatus) {
  if (confirm(`Tem certeza que deseja ${newStatus === 'bloqueado' ? 'BLOQUEAR' : 'DESBLOQUEAR'} este usuário?`)) {
    try {
      await firebase.firestore().collection('usuarios').doc(uid).update({
        status: newStatus
      });
      loadUsers(); // Recarrega tabela
      loadStats(); // Recarrega stats
    } catch(e) {
      alert('Erro ao atualizar status: ' + e.message);
    }
  }
};

async function loadHistory() {
  const tbody = document.getElementById('tableHistoryBody');
  const snap = await firebase.firestore().collection('historico_acessos').orderBy('dataAcesso', 'desc').limit(50).get();
  
  tbody.innerHTML = '';
  snap.forEach(doc => {
    const data = doc.data();
    const dataFormatada = data.dataAcesso ? data.dataAcesso.toDate().toLocaleString('pt-BR') : 'Data não registrada';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.email}</td>
      <td>${dataFormatada}</td>
      <td>${data.ip || 'Desconhecido'}</td>
    `;
    tbody.appendChild(tr);
  });
}
