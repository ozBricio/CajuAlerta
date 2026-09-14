

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


  // Toggle Eye Password
  const eyeButtons = document.querySelectorAll('.toggle-eye');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'; // Eye-off
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'; // Eye-on
      }
    });
  });


  // Blur Validations
  const inputs = ['nomeCompleto', 'emailUser', 'senhaUser', 'senhaConfirma'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('blur', function() {
        const errBox = document.getElementById('err-' + id);
        if(!this.value.trim()) {
          this.classList.add('has-error');
          if(errBox) errBox.classList.remove('d-none');
        } else {
          if (id === 'senhaConfirma') {
            const s1 = document.getElementById('senhaUser').value;
            if (this.value !== s1) {
              this.classList.add('has-error');
              if(errBox) errBox.classList.remove('d-none');
              return;
            }
          }
          this.classList.remove('has-error');
          if(errBox) errBox.classList.add('d-none');
        }
      });
    }
  });

  const senhaInput = document.getElementById('senhaUser');
  const senhaConfirma = document.getElementById('senhaConfirma');
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
      
      if (/[!@#\$%^&*(),.?":{}|<>\\-_=\+\\/\[\]~]/.test(v)) reqSpecial.classList.add('valid');
      else reqSpecial.classList.remove('valid');
      if (v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[!@#\$%^&*(),.?":{}|<>\\-_=\+\\/\[\]~]/.test(v)) {
        senhaInput.classList.add('valid-input');
        senhaInput.classList.remove('has-error');
      } else {
        senhaInput.classList.remove('valid-input');
      }

    });
  }


  if (senhaConfirma) {
    senhaConfirma.addEventListener('input', (e) => {
      const v1 = senhaInput.value;
      const v2 = e.target.value;
      if (v2.length >= 8 && v1 === v2) {
        senhaConfirma.classList.add('valid-input');
        senhaConfirma.classList.remove('has-error');
      } else {
        senhaConfirma.classList.remove('valid-input');
      }
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

    if (isProfaneOrReserved(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Por medidas de segurança e respeito, este nome não é permitido.');
    }

    if (!email) {
      emailInput.classList.add('has-error');
      return showError('Você esqueceu de preencher o seu e-mail.');
    }


    if (!isValidEmailForCaju(email)) {
      emailInput.classList.add('has-error');
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook.');
    }

    if (isProfaneOrReserved(email)) {
      emailInput.classList.add('has-error');
      return showError('Por medidas de segurança, este formato de e-mail contém palavras bloqueadas.');
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
      return showError('A senha de baixo não está igual a de cima.');
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
  // Rate Limit Client-Side Simples
  const lastSignup = localStorage.getItem('cajuLastSignup');
  const now = Date.now();
  if (lastSignup && (now - parseInt(lastSignup)) < 60000) {
    return showError('Por segurança, aguarde um minuto antes de tentar criar outra conta.');
  }

  const btn = document.getElementById('btnSubmitCadastro');
  btn.disabled = true;
  btn.textContent = 'Criando conta...';

  try {
    // 1. Criar no Firebase Auth
    localStorage.setItem('cajuLastSignup', Date.now().toString());
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // 2. Criar perfil no Banco de Dados (Firestore)
    await firebase.firestore().collection('usuarios').doc(user.uid).set({
      nome: nome,
      email: email.toLowerCase(),
      role: 'usuario', // Padrão é usuário. Administradores serão 'staff'
      status: 'ativo', // Bloqueios mudarão para 'bloqueado'
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      consentimentos: consentimentos
    });

    // 3. Disparar E-mail de Verificação (Desativado temporariamente a pedido)
    // await user.sendEmailVerification();
    // await firebase.auth().signOut();

    // Mostra o quadro verde na própria página
    document.getElementById('cadastroForm').style.display = 'none';
    const successBox = document.getElementById('successBox');
    successBox.classList.remove('d-none');
    
    // Rola pro topo
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Redireciona após 2 segundos já logado
    setTimeout(() => {
      window.location.replace('perfil.html');
    }, 2000);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showError('Não foi possível criar sua conta. Não foi possível cadastrar você no Caju Alerta.');
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


