

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

  const senhaInput = document.getElementById('senhaUser');
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqSpecial = document.getElementById('reqSpecial');

  if (senhaInput) {
    senhaInput.addEventListener('input', (e) => {
      const v = e.target.value;
      if (v.length >= 8) reqLength.classList.add('valid');
      else reqLength.classList.remove('valid');
      
      if (/[A-Z]/.test(v)) reqUpper.classList.add('valid');
      else reqUpper.classList.remove('valid');
      
      if (/[a-z]/.test(v)) reqLower.classList.add('valid');
      else reqLower.classList.remove('valid');
      
      if (/[^A-Za-z0-9]/.test(v)) reqSpecial.classList.add('valid');
      else reqSpecial.classList.remove('valid');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    // Limpar bordas vermelhas
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

    const nomeInput = document.getElementById('nomeCompleto');
    const emailInput = document.getElementById('emailUser');
    const senha1Input = document.getElementById('senhaUser');
    const senha2Input = document.getElementById('senhaConfirma');
    
    const termsGroup = document.querySelector('.terms-group');
    const captchaContainer = document.getElementById('nativeCaptcha');

    const aceiteTermos = document.getElementById('aceiteTermos').checked;
    const aceitePrivacidade = document.getElementById('aceitePrivacidade').checked;
    const aceiteProjeto = document.getElementById('aceiteProjeto').checked;
    const isHuman = document.getElementById('captchaCheckbox').checked;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha1 = senha1Input.value;
    const senha2 = senha2Input.value;

    if (!nome) {
      nomeInput.classList.add('has-error');
      return showError('Você esqueceu de preencher o seu nome completo.');
    }
    
    const nameRegex = /^[A-Za-zÁ-Úá-úÂ-Ûâ-ûÃ-Õã-õÇç]+(?:\s[A-Za-zÁ-Úá-úÂ-Ûâ-ûÃ-Õã-õÇç]+)+$/;
    if (!nameRegex.test(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Nome inválido. Digite Nome e Sobrenome sem utilizar números ou símbolos.');
    }

    if (!email) {
      emailInput.classList.add('has-error');
      return showError('Você esqueceu de preencher o seu e-mail.');
    }

    if (!isValidEmailForCaju(email)) {
      emailInput.classList.add('has-error');
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook.');
    }

    if (!senha1) {
      senha1Input.classList.add('has-error');
      return showError('Você esqueceu de criar a sua senha.');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/.test(senha1)) {
      senha1Input.classList.add('has-error');
      return showError('Sua senha está fraca. Preencha todos os requisitos solicitados na cor verde.');
    }

    if (!senha2) {
      senha2Input.classList.add('has-error');
      return showError('Você esqueceu de confirmar a sua senha.');
    }

    if (senha1 !== senha2) {
      senha2Input.classList.add('has-error');
      return showError('A senha de confirmação está diferente da senha principal.');
    }

    if (!aceiteTermos || !aceitePrivacidade || !aceiteProjeto) {
      termsGroup.classList.add('has-error');
      return showError('Você esqueceu de aceitar os Termos e Políticas obrigatórios.');
    }
    
    if (!isHuman) {
      captchaContainer.classList.add('has-error');
      return showError('Você esqueceu de realizar a verificação de segurança (Não sou um robô).');
    }

    processRegistration(nome, email, senha1, { aceiteTermos, aceitePrivacidade, aceiteProjeto });
  });
  });
}

function isValidEmailForCaju(email) {
  // if (email.includes('+')) return false; // Liberado para testes
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
    // 1. Criar no Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // 2. Disparar E-mail de Verificação (A regra de bloqueio)
    await user.sendEmailVerification();

    // 3. Salvar os dados no Firestore (Banco de Dados)
    await firebase.firestore().collection('usuarios').doc(user.uid).set({
      nome: nome,
      email: email,
      consentimentos: consentimentos,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      authRole: 'user'
    });

    // Desloga para obrigar a validar o e-mail antes de logar
    await firebase.auth().signOut();

    // Redireciona com aviso
    alert('✅ Conta criada com sucesso!

⚠️ IMPORTANTE: Enviamos um link de confirmação para o seu e-mail. Você só poderá fazer login após clicar no link para verificar sua identidade.');
    window.location.href = '/login';
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showError('Esse e-mail já está cadastrado em nossa base.');
    } else {
      showError('Erro ao criar conta: ' + error.message);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar Conta Segura';
  }
}

function defenseConsoleWarning() {
  setTimeout(console.log.bind(console, '%c🚨 ALERTA DE SEGURANÇA 🚨', 'color: #ef4444; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 #000;'));
  setTimeout(console.log.bind(console, '%cQualquer tentativa de injeção será bloqueada e o IP registrado conforme LGPD e Marco Civil.', 'font-size: 14px; font-weight: bold; color: #facc15;'));
}


