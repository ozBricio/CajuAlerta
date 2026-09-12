

document.addEventListener('DOMContentLoaded', () => {
  checkAuthAndBlock();
  initMasks();
  autoFillFromQuery();
  initFormSubmit();
  
  const dateInput = document.getElementById('dataOcorrencia');
  if(dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
  }
});

function checkAuthAndBlock() {
  const formWrapper = document.querySelector('.form-wrapper');

  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      if (!user && formWrapper) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      }
    });
  }
  return Boolean(formWrapper);
}

function initMasks() {
  // Removido: Aceita e-mail e site
}

function autoFillFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const numero = urlParams.get('numero');
  const input = document.getElementById('numeroInfrator');
  if (numero && input) input.value = numero;
}

function initFormSubmit() {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const relato = document.getElementById('descricaoRelato').value.trim();
    if (relato.split(/\s+/).filter(word => word.length > 0).length < 6) {
      alert('A descrição é muito curta. Explique o ocorrido com no mínimo 6 palavras.');
      return;
    }
    const isHuman = typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0;
    if (!isHuman) {
      alert('Conclua o reCAPTCHA antes de enviar.');
      return;
    }
    requestLocationAndSubmit(form);
  });
}

const CriptoCaju = {
  encrypt: (text, secret) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ secret.charCodeAt(i % secret.length));
    }
    return btoa(result);
  }
};

async function requestLocationAndSubmit(form) {
  const btn = document.getElementById('btnSubmitRegistro');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Verificando segurança, IP e localização...';

  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada.");
    btn.disabled = false; btn.textContent = originalText; return;
  }

  // Capturar IP
  let userIP = 'Desconhecido';
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    userIP = ipData.ip;
  } catch(e) {}

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      btn.textContent = 'Criptografando metadados...';
      
      const metadadosBrutos = JSON.stringify({
        ip: userIP,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        navegador: navigator.userAgent,
        data: new Date().toISOString()
      });

      // Embaralhamento (a chave do admin deverá ser usada depois para ver)
      const metadadosSeguros = CriptoCaju.encrypt(metadadosBrutos, "CAJU2026_BLINDADO");

      try {
        const userId = window.auth.currentUser ? window.auth.currentUser.uid : 'anon';
        
        await window.db.collection('ocorrencias').add({
          alvo: document.getElementById('numeroInfrator').value.trim(),
          data_ocorrencia: document.getElementById('dataOcorrencia').value,
          categoria: document.getElementById('tipoOcorrencia').value,
          plataforma: document.getElementById('plataformaOrigem').value,
          relato: document.getElementById('descricaoRelato').value.trim(),
          metadados_criptografados: metadadosSeguros, // Salvo apenas criptografado
          userId: userId,
          status: 'ativo',
          created_at: new Date().toISOString()
        });

        form.parentElement.innerHTML = '<div class="registration-success"><h2>Ocorrência registrada e blindada</h2><p>Obrigado por ajudar outras pessoas. Seus metadados foram selados criptograficamente.</p><a href="/" class="btn-primary">Voltar ao início</a></div>';
      } catch (error) {
        alert("Erro no servidor: " + error.message);
        btn.disabled = false;
        btn.textContent = originalText;
      }
    },
    (error) => {
      alert("Acesso à localização negado (LGPD). É obrigatório fornecer sua localização para responsabilização em caso de falsas ocorrências.");
      btn.disabled = false; btn.textContent = originalText;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
