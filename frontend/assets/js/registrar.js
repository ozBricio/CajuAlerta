document.addEventListener('DOMContentLoaded', () => {
  const protectedContent = document.getElementById('protectedContent');
  
  // Bloqueio Inicial
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.replace('login.html'); // Expulsa sumariamente
    } else {
      if (protectedContent) protectedContent.style.display = 'block';
    }
  });

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

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Aguardando Localização (GPS)...';

    // Captura Localização Obrigatória
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await salvarDenuncia(user, position.coords);
        },
        (error) => {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Registrar Denúncia Oficial';
          errorBox.innerHTML = '<strong>Acesso à Localização Negado!</strong><br>Para registrar a denúncia, é obrigatório permitir o acesso ao GPS por questões legais e rastreamento judicial.';
          errorBox.classList.remove('d-none');
        }
      );
    } else {
      errorBox.textContent = 'Seu navegador não suporta geolocalização.';
      errorBox.classList.remove('d-none');
      btnSubmit.disabled = false;
    }
  });

  async function salvarDenuncia(user, coords) {
    btnSubmit.textContent = 'Registrando no Banco de Dados...';

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
      btnSubmit.disabled = false;
    }
  }
});
