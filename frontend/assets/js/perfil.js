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

  let allDenuncias = [];

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
      allDenuncias = [];

      results[0].forEach(doc => allDenuncias.push({id: doc.id, collection: 'denuncias_telefones', tipo: 'Telefone', ...doc.data()}));
      results[1].forEach(doc => allDenuncias.push({id: doc.id, collection: 'denuncias_emails', tipo: 'E-mail', ...doc.data()}));
      results[2].forEach(doc => allDenuncias.push({id: doc.id, collection: 'denuncias_sites', tipo: 'Site', ...doc.data()}));

      allDenuncias.sort((a, b) => b.dataDenuncia?.toDate() - a.dataDenuncia?.toDate());

      renderDenuncias(allDenuncias);
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error);
      list.innerHTML = '<p style="color: #ef4444;">Erro ao carregar seu histórico.</p>';
    }
  }

  function renderDenuncias(denunciasArray) {
    const list = document.getElementById('denunciasList');
    list.innerHTML = '';

    if (denunciasArray.length === 0) {
      list.innerHTML = '<p style="color: #9ca3af;">Nenhuma ocorrência encontrada para esta busca.</p>';
      return;
    }

    denunciasArray.forEach(d => {
      const div = document.createElement('div');
      div.className = 'denuncia-card';
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span class="badge" style="background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb;">${d.tipo}</span>
            <h4 style="margin: 10px 0 5px 0; color: #111827;">${d.alvo}</h4>
          </div>
          <span class="badge" style="background: ${d.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${d.status === 'ativa' ? '#22c55e' : '#ef4444'}">
            ${d.status === 'ativa' ? 'Ativa' : 'Desativada'}
          </span>
        </div>
        <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 15px;">${d.motivo}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
          <span style="font-size: 0.8rem; color: #9ca3af;">Registrado em ${d.dataDenuncia ? d.dataDenuncia.toDate().toLocaleDateString('pt-BR') : 'Data desconhecida'}</span>
          ${d.status === 'ativa' ? `<button style="padding: 6px 12px; font-size: 0.85rem; background: transparent; color: #ef4444; border: 1.5px solid #ef4444; border-radius: 6px; cursor: pointer; font-weight: 600;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'" onclick="desativarDenuncia('${d.collection}', '${d.id}')">Desativar Ocorrência</button>` : ''}
        </div>
      `;
      list.appendChild(div);
    });
  }

  // Lógica de Filtro
  const searchInput = document.getElementById('searchDenuncias');
  const typeFilter = document.getElementById('filterTipo');

  function filterData() {
    if (!searchInput || !typeFilter) return;
    const term = searchInput.value.toLowerCase();
    const type = typeFilter.value;

    const filtered = allDenuncias.filter(d => {
      const matchText = d.alvo.toLowerCase().includes(term) || d.motivo.toLowerCase().includes(term);
      const matchType = type === 'todos' || d.tipo === type;
      return matchText && matchType;
    });

    renderDenuncias(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterData);
  if (typeFilter) typeFilter.addEventListener('change', filterData);


  window.desativarDenuncia = async (collection, id) => {
    if (!confirm('Você realmente deseja desativar esta denúncia?\n\nSe desativar, ela será ocultada e você NÃO conseguirá ativá-la novamente!')) return;
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


// ================== REGISTRAR.JS MERGED ==================
document.addEventListener("DOMContentLoaded", () => {

﻿
  
  
  // Bloqueio Inicial
  
  const form = document.getElementById('formDenuncia');
  const tipoSelect = document.getElementById('tipoDenuncia');
  const groupAlvo = document.getElementById('groupAlvo');
  const labelAlvo = document.getElementById('labelAlvo');
  const inputAlvo = document.getElementById('inputAlvo');
  const inputMotivo = document.getElementById('inputMotivo');
  const btnSubmit = document.getElementById('btnSubmitDenuncia');
  const errorBox = document.getElementById('errorBox');
  const successBox = document.getElementById('successBox');

  // Máscara e mudança dinâmica de label
  tipoSelect.addEventListener('change', (e) => {
    groupAlvo.classList.remove('d-none');
    inputAlvo.value = '';
    
    if (e.target.value === 'telefone') {
      labelAlvo.textContent = 'Número do Telefone (com DDD)';
      inputAlvo.placeholder = '(11) 99999-9999';
      inputAlvo.type = 'text';
    } else if (e.target.value === 'email') {
      labelAlvo.textContent = 'E-mail do Golpista';
      inputAlvo.placeholder = 'golpe@email.com';
      inputAlvo.type = 'email';
    } else {
      labelAlvo.textContent = 'Link ou URL do Site';
      inputAlvo.placeholder = 'https://site-falso.com';
      inputAlvo.type = 'url';
    }
  });

  inputAlvo.addEventListener('input', (e) => {
    if (tipoSelect.value === 'telefone') {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 2) v = `(${v.substring(0,2)}) ${v.substring(2)}`;
      if (v.length > 9) v = `${v.substring(0,10)}-${v.substring(10)}`;
      e.target.value = v;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('d-none');
    successBox.classList.add('d-none');

    // Validação de Sessão
    const user = firebase.auth().currentUser;
    if (!user) {
      errorBox.textContent = 'Você precisa estar logado para registrar uma ocorrência.';
      errorBox.classList.remove('d-none');
      setTimeout(() => window.location.href = 'login.html', 2000);
      return;
    }

    // Validações Específicas
    const tipo = tipoSelect.value;
    const alvo = inputAlvo.value.trim();

    if (tipo === 'telefone') {
      const d = alvo.replace(/\D/g, '');
      if (d.length < 10) {
        errorBox.textContent = 'Erro: Número de telefone inválido. O telefone deve ter DDD + Número (ex: 11 99999-9999).';
        errorBox.classList.remove('d-none');
        btnSubmit.disabled = false;
        if (loadingOverlay) loadingOverlay.classList.add('d-none');
        return;
      }
    } else if (tipo === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alvo)) {
        errorBox.textContent = 'Erro: O endereço de e-mail é inválido. Falta o formato correto (ex: @gmail.com).';
        errorBox.classList.remove('d-none');
        btnSubmit.disabled = false;
        if (loadingOverlay) loadingOverlay.classList.add('d-none');
        return;
      }
    } else if (tipo === 'site') {
      if (!alvo.includes('.') || alvo.length < 4) {
        errorBox.textContent = 'Erro: Domínio inválido. O site deve conter uma extensão válida (ex: .com, .com.br, .net).';
        errorBox.classList.remove('d-none');
        btnSubmit.disabled = false;
        if (loadingOverlay) loadingOverlay.classList.add('d-none');
        return;
      }
    }

    // Validação de Motivo (Min 5 palavras)
    const motivoText = inputMotivo.value.trim();
    const wordCount = motivoText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < 5) {
      document.getElementById('err-motivo').classList.remove('d-none');
      inputMotivo.classList.add('has-error');
      return;
    } else {
      document.getElementById('err-motivo').classList.add('d-none');
      inputMotivo.classList.remove('has-error');
    }

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.remove('d-none');
    
    btnSubmit.disabled = true;

    // Captura Localização Obrigatória
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await salvarDenuncia(user, position.coords);
        },
        (error) => {
          if (loadingOverlay) loadingOverlay.classList.add('d-none');
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Registrar Denúncia Oficial';
          errorBox.innerHTML = '<strong>Acesso à Localização Negado!</strong><br>Para registrar a denúncia, é obrigatório permitir o acesso ao GPS por questões legais e rastreamento judicial.';
          errorBox.classList.remove('d-none');
        }
      );
    } else {
      if (loadingOverlay) loadingOverlay.classList.add('d-none');
      errorBox.textContent = 'Seu navegador não suporta geolocalização.';
      errorBox.classList.remove('d-none');
      btnSubmit.disabled = false;
    }
  });;

  async function salvarDenuncia(user, coords) {
    // Overlay já está ativo

    const tipo = tipoSelect.value;
    const alvo = inputAlvo.value.trim();
    const motivo = inputMotivo.value.trim();
    const collectionName = tipo === 'telefone' ? 'denuncias_telefones' : (tipo === 'email' ? 'denuncias_emails' : 'denuncias_sites');

    try {
      await firebase.firestore().collection(collectionName).add({
        alvo: alvo,
        motivo: motivo,
        relator_uid: user.uid,
        relator_email: user.email,
        dataDenuncia: firebase.firestore.FieldValue.serverTimestamp(),
        localizacao: {
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        navegador: {
          userAgent: navigator.userAgent,
          plataforma: navigator.platform,
          idioma: navigator.language
        },
        status: 'ativa' // Permite "desativar" no futuro pelo próprio usuário
      });

      form.reset();
      groupAlvo.classList.add('d-none');
      successBox.classList.remove('d-none');
      btnSubmit.textContent = 'Registrar Nova Denúncia';
    } catch (error) {
      errorBox.textContent = 'Erro ao salvar denúncia: ' + error.message;
      errorBox.classList.remove('d-none');
    } finally {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) loadingOverlay.classList.add('d-none');
      btnSubmit.disabled = false;
    }
  }

});
