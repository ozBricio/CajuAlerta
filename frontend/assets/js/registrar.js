

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

  fetch(window.apiUrl('/api/auth/me'), { credentials: 'include' })
    .then(response => {
      if (!response.ok) throw new Error('Sessão inválida');
      return response.json();
    })
    .catch(() => {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    });

  return Boolean(formWrapper);
}

function initMasks() {
  const input = document.getElementById('numeroInfrator');
  if (!input) return;

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formatted = '';
    if (value.length > 0) formatted = '(' + value.substring(0, 2);
    if (value.length > 2) formatted += ') ' + value.substring(2, 7);
    if (value.length > 7) formatted += '-' + value.substring(7, 11);

    e.target.value = formatted;
  });
}

function autoFillFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const numero = urlParams.get('numero');
  const input = document.getElementById('numeroInfrator');
  
  if (numero && input) {
    let formatted = '';
    if (numero.length >= 10) {
      formatted = '(' + numero.substring(0, 2) + ') ' + numero.substring(2, 7) + '-' + numero.substring(7, 11);
    } else {
      formatted = numero;
    }
    input.value = formatted;
  }
}

function initFormSubmit() {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isHuman = typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0;
    if (!isHuman) {
      alert('Conclua o reCAPTCHA antes de enviar.');
      return;
    }
    
    requestLocationAndSubmit(form);
  });
}

function requestLocationAndSubmit(form) {
  const btn = document.getElementById('btnSubmitRegistro');
  const originalText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = 'Verificando segurança e localização...';

  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada por este navegador. Por motivos de segurança, o registro não pode ser concluído.");
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      btn.textContent = 'Enviando registro criptografado...';

      fetch(window.apiUrl('/api/registrar'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: document.getElementById('numeroInfrator').value.replace(/\D/g, ''),
          data_ocorrencia: document.getElementById('dataOcorrencia').value,
          categoria: document.getElementById('tipoOcorrencia').value,
          plataforma: document.getElementById('plataformaOrigem').value,
          relato: document.getElementById('descricaoRelato').value.trim(),
          geolocalizacao: { latitude: position.coords.latitude, longitude: position.coords.longitude }
        })
      }).then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Não foi possível registrar a ocorrência.');
        form.parentElement.innerHTML = '<div class="registration-success"><h2>Ocorrência registrada</h2><p>Obrigado por ajudar outras pessoas. O registro será analisado antes de qualquer alerta público.</p><a href="/" class="btn-primary">Voltar ao início</a></div>';
      }).catch(error => {
        alert(error.message);
        btn.disabled = false;
        btn.textContent = originalText;
      });
    },
    (error) => {
      alert("Acesso à localização negado. Conforme os Termos de Uso (LGPD), é obrigatório fornecer sua localização para responsabilização em caso de falsas ocorrências.");
      btn.disabled = false;
      btn.textContent = originalText;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}
