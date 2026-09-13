document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  let currentUser = null;

  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }
    const pc = document.getElementById('protectedContent');
    if (pc) { pc.classList.remove('d-none'); pc.style.display = ''; }
    currentUser = user;
    loadUserProfile(user);
    loadUserDenuncias(user);
  });

  async function loadUserProfile(user) {
    try {
      const doc = await db.collection('usuarios').doc(user.uid).get();
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('userName').textContent = data.nome.split(' ')[0]; // Pega sempre o primeiro nome, garantindo compatibilidade com registros antigos
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('userRole').textContent = data.role === 'staff' ? 'Administrador (Staff)' : 'Usuário';
        if (data.role === 'staff') {
          const btnAdmin = document.getElementById('btnAdminDash');
          if (btnAdmin) btnAdmin.classList.remove('d-none');
        }
        document.getElementById('userInitial').textContent = data.nome.charAt(0).toUpperCase();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadUserDenuncias(user) {
    const list = document.getElementById('denunciasList');
    list.innerHTML = '<p style="color: #9ca3af;">Buscando ocorrências...</p>';

    try {
      // Buscar em todas as 3 coleções (em produção complexa usaríamos cloud functions ou uma coleção central, 
      // mas aqui fazemos 3 queries rápidas pois Firebase é rápido)
      const queries = [
        db.collection('denuncias_telefones').where('relator_uid', '==', user.uid).get(),
        db.collection('denuncias_emails').where('relator_uid', '==', user.uid).get(),
        db.collection('denuncias_sites').where('relator_uid', '==', user.uid).get()
      ];

      const results = await Promise.all(queries);
      let denuncias = [];

      results[0].forEach(doc => denuncias.push({id: doc.id, collection: 'denuncias_telefones', tipo: 'Telefone', ...doc.data()}));
      results[1].forEach(doc => denuncias.push({id: doc.id, collection: 'denuncias_emails', tipo: 'E-mail', ...doc.data()}));
      results[2].forEach(doc => denuncias.push({id: doc.id, collection: 'denuncias_sites', tipo: 'Site', ...doc.data()}));

      // Ordenar por data
      denuncias.sort((a, b) => b.dataDenuncia?.toDate() - a.dataDenuncia?.toDate());

      if (denuncias.length === 0) {
        list.innerHTML = '<p style="color: #9ca3af;">Nenhuma ocorrência registrada por você.</p>';
        return;
      }

      list.innerHTML = '';
      denuncias.forEach(d => {
        const dataStr = d.dataDenuncia ? d.dataDenuncia.toDate().toLocaleDateString('pt-BR') : 'Data não registrada';
        const isAtiva = d.status !== 'desativada';
        
        list.innerHTML += `
          <div class="denuncia-card">
            <div class="denuncia-info">
              <strong>${d.tipo}: ${d.alvo}</strong>
              <p>Motivo: ${d.motivo.length > 50 ? d.motivo.substring(0,50)+'...' : d.motivo}</p>
              <p style="font-size:0.8rem; margin-top:5px; color:#6b7280;">Registrado em: ${dataStr}</p>
              <span class="status-badge ${isAtiva ? 'ativa' : 'desativada'}">${isAtiva ? 'ATIVA (Processando)' : 'DESATIVADA'}</span>
            </div>
            ${isAtiva ? `<button class="btn-desativar" onclick="desativarDenuncia('${d.collection}', '${d.id}')">Desativar / Retirar</button>` : ''}
          </div>
        `;
      });
    } catch(e) {
      list.innerHTML = '<p style="color: #ef4444;">Erro ao carregar denúncias.</p>';
    }
  }

  // Desativar Denúncia Global Function
  window.desativarDenuncia = async function(collection, id) {
    if (confirm('Tem certeza que deseja desativar esta ocorrência? Ela não será mais processada juridicamente.')) {
      try {
        await db.collection(collection).doc(id).update({ status: 'desativada' });
        loadUserDenuncias(currentUser);
      } catch (e) {
        alert('Erro ao desativar: ' + e.message);
      }
    }
  };

  // Lógica de Exclusão de Conta
  const modalDelete = document.getElementById('modalDelete');
  document.getElementById('btnDeleteAccount').addEventListener('click', () => {
    modalDelete.classList.remove('d-none');
  });
  document.getElementById('btnCancelDelete').addEventListener('click', () => {
    modalDelete.classList.add('d-none');
  });

  document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
    try {
      // 1. Gravar Log de Exclusão (Para fins legais)
      await db.collection('logs_exclusao').add({
        uid: currentUser.uid,
        email: currentUser.email,
        dataExclusao: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Apagar documento do usuário (Opcional, ou mudar status para 'excluido')
      // Decidimos alterar o status para não perder as FKs das denúncias.
      await db.collection('usuarios').doc(currentUser.uid).update({
        status: 'excluido_pelo_usuario',
        nome: 'Conta Excluída',
        email: 'excluido@cajualerta.com' // Mascara o email
      });

      // 3. Excluir conta do Auth
      await currentUser.delete();
      
      alert('Sua conta foi excluída com sucesso. Um log foi mantido para fins judiciais conforme a Lei.');
      window.location.href = 'index.html';
    } catch(e) {
      if (e.code === 'auth/requires-recent-login') {
        alert('Por segurança, faça login novamente antes de excluir a conta.');
        firebase.auth().signOut().then(() => window.location.href = 'login.html');
      } else {
        alert('Erro ao excluir: ' + e.message);
      }
    }
  });

  // Logout Sidebar
  document.getElementById('btnSairPerfil').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.location.href = 'index.html';
    });
  });
});
