

document.addEventListener('DOMContentLoaded', () => {
  initCadastroValidation();
  defenseConsoleWarning();
});

/**
 * Validação extrema de front-end
 */
function initCadastroValidation() {
  const form = document.getElementById('cadastroForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const nome = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('emailUser').value.trim().toLowerCase();
    const senha1 = document.getElementById('senhaUser').value;
    const senha2 = document.getElementById('senhaConfirma').value;
    const aceiteTermos = document.getElementById('aceiteTermos').checked;
    const aceitePrivacidade = document.getElementById('aceitePrivacidade').checked;
    const aceiteProjeto = document.getElementById('aceiteProjeto').checked;
    const isHuman = typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0;

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (!nameRegex.test(nome)) {
      return showError('Nome inválido. Digite Nome e Sobrenome sem utilizar números ou símbolos.');
    }

    if (!isValidEmailForCaju(email)) {
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook. Sem sub-endereços.');
    }

    if (senha1 !== senha2) {
      return showError('As senhas não coincidem.');
    }

    if (!aceiteTermos || !aceitePrivacidade || !aceiteProjeto) {
      document.getElementById('termsRequiredMessage').hidden = false;
      return showError('Para criar a conta, leia e aceite os três documentos obrigatórios.');
    }
    
    if (!isHuman) {
      return showError('Por favor, confirme que você não é um robô no desafio do reCAPTCHA.');
    }

    processRegistration(nome, email, senha1, { aceiteTermos, aceitePrivacidade, aceiteProjeto });
  });
}

function isValidEmailForCaju(email) {
  if (email.includes('+')) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const userPart = parts[0];
  const domainPart = parts[1];
  const dotCount = (userPart.match(/\./g) || []).length;
  if (dotCount > 2) return false;
  const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'outlook.com.br'];
  if (!allowedDomains.includes(domainPart)) return false;
  return true;
}

function showError(msg) {
  const errorBox = document.getElementById('errorBox');
  document.getElementById('errorMessage').textContent = msg;
  errorBox.style.display = 'flex';
  errorBox.style.animation = 'none';
  errorBox.offsetHeight;
  errorBox.style.animation = 'fadeInUp 0.3s ease';
}

function hideError() {
  const errorBox = document.getElementById('errorBox');
  if(errorBox) errorBox.style.display = 'none';
}

async function processRegistration(nome, email, senha, consentimentos) {
  const btn = document.getElementById('btnSubmitCadastro');
  btn.disabled = true;
  btn.textContent = 'Criando conta...';

  try {
    const response = await fetch(window.apiUrl('/api/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, consentimentos })
    });
    const result = await response.json();
    if (!response.ok) return showError(result.error || 'Não foi possível criar a conta.');

    alert(result.message);
    window.location.href = '/login';
  } catch (error) {
    showError('Não foi possível conectar ao servidor.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar Conta Segura';
  }
}

function defenseConsoleWarning() {
  setTimeout(console.log.bind(console, '%c🚨 ALERTA DE SEGURANÇA 🚨', 'color: #ef4444; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 #000;'));
  setTimeout(console.log.bind(console, '%cQualquer tentativa de injeção será bloqueada e o IP registrado conforme LGPD e Marco Civil.', 'font-size: 14px; font-weight: bold; color: #facc15;'));
}
