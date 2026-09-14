document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recuperarForm');
  if (!form) return;

  // Blur Validation
  const emailInput = document.getElementById('emailUser');
  const errEmail = document.getElementById('err-emailUser');

  emailInput.addEventListener('blur', function() {
    if(!this.value.trim() || !this.value.includes('@')) {
      this.classList.add('has-error');
      errEmail.classList.remove('d-none');
    } else {
      this.classList.remove('has-error');
      errEmail.classList.add('d-none');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim().toLowerCase();
    const btn = document.getElementById('btnSubmitRecuperar');
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    const successBox = document.getElementById('successBox');

    errorBox.classList.add('d-none');
    successBox.classList.add('d-none');

    if (!email || !email.includes('@')) {
      emailInput.classList.add('has-error');
      errEmail.classList.remove('d-none');
      return;
    }

    // Rate Limit Simplificado Client-Side
    const lastRecovery = localStorage.getItem('cajuLastRecovery');
    if (lastRecovery && (Date.now() - parseInt(lastRecovery)) < 60000) {
      errorMessage.textContent = 'Aguarde um minuto antes de solicitar um novo link.';
      errorBox.classList.remove('d-none');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      localStorage.setItem('cajuLastRecovery', Date.now().toString());
      
      // Motor Nativo do Google Firebase
      await firebase.auth().sendPasswordResetEmail(email);

      // Sucesso
      form.style.display = 'none';
      successBox.classList.remove('d-none');

    } catch (error) {
      // Firebase errors
      if (error.code === 'auth/user-not-found') {
        errorMessage.textContent = 'Nenhuma conta encontrada com este e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage.textContent = 'Formato de e-mail inválido.';
      } else {
        errorMessage.textContent = 'Erro: ' + (error.code || error.message);
      }
      errorBox.classList.remove('d-none');
      btn.disabled = false;
      btn.textContent = 'Enviar Link de Recuperação';
    }
  });
});
