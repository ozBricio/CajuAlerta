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
        const nomeReal = data.nome || 'Usuário';
        document.getElementById('userName').textContent = nomeReal.split(' ')[0];
        document.getElementById('userEmail').textContent = data.email || user.email;
        document.getElementById('userRole').textContent = data.role === 'staff' ? 'ADMINISTRADOR' : 'USUÁRIO';
        if (data.role === 'staff') {
          const btnAdmin = document.getElementById('btnAdminDash');
          if (btnAdmin) btnAdmin.classList.remove('d-none');
        }
        document.getElementById('userInitial').textContent = nomeReal.charAt(0).toUpperCase();
      } else {
        document.getElementById('userName').textContent = 'Usuário';
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userRole').textContent = 'USUÁRIO';
        document.getElementById('userInitial').textContent = 'U';
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      document.getElementById('userName').textContent = 'Erro';
    }
  }

  async function loadUserDenuncias(user) {
    const list = document.getElementById('denunciasList');
    list.innerHTML = '<p style="color: #9ca3af;">Buscando ocorrências...</p>';

    try {
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

      denuncias.sort((a, b) => b.dataDenuncia?.toDate() - a.dataDenuncia?.toDate());

      if (denuncias.length === 0) {
        list.innerHTML = '<p style="color: #9ca3af;">Nenhuma ocorrência registrada por você.</p>';
        return;
      }

      list.innerHTML = '';
      denuncias.forEach(d => {
        const div = document.createElement('div');
        div.className = 'denuncia-card';
        div.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <span class="badge" style="background: #2d3342; color: #d1d5db; border: none;">${d.tipo}</span>
              <h4 style="margin: 10px 0 5px 0; color: #111827;">${d.alvo}</h4>
            </div>
            <span class="badge" style="background: ${d.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${d.status === 'ativa' ? '#22c55e' : '#ef4444'}">
              ${d.status === 'ativa' ? 'Ativa' : 'Desativada'}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 15px;">${d.motivo}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            <span style="font-size: 0.8rem; color: #9ca3af;">Registrado em ${d.dataDenuncia ? d.dataDenuncia.toDate().toLocaleDateString('pt-BR') : 'Data desconhecida'}</span>
            ${d.status === 'ativa' ? `<button class="btn" style="padding: 6px 12px; font-size: 0.85rem; background: #2d3342;" onclick="desativarDenuncia('${d.collection}', '${d.id}')">Desativar Ocorrência</button>` : ''}
          </div>
        `;
        list.appendChild(div);
      });
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error);
      list.innerHTML = '<p style="color: #ef4444;">Erro ao carregar seu histórico.</p>';
    }
  }

  window.desativarDenuncia = async (collection, id) => {
    if (!confirm('Tem certeza que deseja desativar este registro? Ele sairá da nossa base pública.')) return;
    try {
      await db.collection(collection).doc(id).update({
        status: 'desativada',
        dataDesativacao: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Registro desativado com sucesso!');
      loadUserDenuncias(currentUser);
    } catch (error) {
      alert('Erro ao desativar: ' + error.message);
    }
  };

  const btnDeleteAccount = document.getElementById('btnDeleteAccount');
  const modalDelete = document.getElementById('modalDelete');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');

  if (btnDeleteAccount && modalDelete) {
    btnDeleteAccount.addEventListener('click', () => modalDelete.classList.remove('d-none'));
    btnCancelDelete.addEventListener('click', () => modalDelete.classList.add('d-none'));

    btnConfirmDelete.addEventListener('click', async () => {
      btnConfirmDelete.disabled = true;
      btnConfirmDelete.textContent = 'Processando...';

      try {
        const uid = currentUser.uid;
        
        await db.collection('logs_exclusao').add({
          uid: uid,
          email: currentUser.email,
          data_solicitacao: firebase.firestore.FieldValue.serverTimestamp(),
          motivo: 'Exclusão voluntária pelo painel'
        });

        await db.collection('usuarios').doc(uid).update({
          status: 'excluido',
          data_exclusao: firebase.firestore.FieldValue.serverTimestamp()
        });

        try {
          await currentUser.delete();
        } catch (authErr) {
          await window.auth.signOut();
        }

        alert('Ok, sua conta foi excluída com sucesso.');
        window.location.replace('index.html');
      } catch (error) {
        alert('Erro: ' + error.message);
        btnConfirmDelete.disabled = false;
        btnConfirmDelete.textContent = 'Sim, exclui minha conta';
      }
    });
  }
});
