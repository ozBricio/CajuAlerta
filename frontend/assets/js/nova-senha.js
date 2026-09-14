document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('novaSenhaForm');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const actionCode = urlParams.get('oobCode');
  const mode = urlParams.get('mode');

  const errorBox = document.getElementById('errorBox');
  const errorMessage = document.getElementById('errorMessage');

  if (mode !== 'resetPassword' || !actionCode) {
    errorMessage.textContent = 'Link de redefinição inválido ou expirado. Por favor, solicite um novo link.';
    errorBox.classList.remove('d-none');
    
    const btn = document.getElementById('btnSubmitNovaSenha');
    const inputs = form.querySelectorAll('input');
    btn.disabled = true;
    inputs.forEach(input => input.disabled = true);
    return;
  }

  // Verify code
  firebase.auth().verifyPasswordResetCode(actionCode).then((email) => {
    // We can show the email to the user if we want
    console.log("Redefinindo senha para:", email);
  }).catch((error) => {
    errorMessage.textContent = 'Link de redefinição inválido ou já utilizado. Por favor, solicite um novo link.';
    errorBox.classList.remove('d-none');
    document.getElementById('btnSubmitNovaSenha').disabled = true;
  });

  // Validation
  const newPwd = document.getElementById('newPassword');
  const confirmPwd = document.getElementById('confirmPassword');
  const errNewPwd = document.getElementById('err-newPassword');
  const errConfirmPwd = document.getElementById('err-confirmPassword');

  function validatePasswords() {
    let valid = true;
    if (newPwd.value.length < 8) {
      newPwd.classList.add('has-error');
      errNewPwd.classList.remove('d-none');
      valid = false;
    } else {
      newPwd.classList.remove('has-error');
      errNewPwd.classList.add('d-none');
    }

    if (newPwd.value !== confirmPwd.value) {
      confirmPwd.classList.add('has-error');
      errConfirmPwd.classList.remove('d-none');
      valid = false;
    } else {
      confirmPwd.classList.remove('has-error');
      errConfirmPwd.classList.add('d-none');
    }
    return valid;
  }

  newPwd.addEventListener('blur', validatePasswords);
  confirmPwd.addEventListener('blur', validatePasswords);

  // Toggle Password Visiblity
  document.getElementById('toggleNewPwd').addEventListener('click', function() {
    newPwd.type = newPwd.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('toggleConfirmPwd').addEventListener('click', function() {
    confirmPwd.type = confirmPwd.type === 'password' ? 'text' : 'password';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    errorBox.classList.add('d-none');
    
    if (!validatePasswords()) return;

    const btn = document.getElementById('btnSubmitNovaSenha');
    btn.disabled = true;
    btn.textContent = 'Redefinindo...';

    try {
      await firebase.auth().confirmPasswordReset(actionCode, newPwd.value);
      
      form.style.display = 'none';
      document.getElementById('successBox').classList.remove('d-none');
    } catch (error) {
      if (error.code === 'auth/expired-action-code') {
        errorMessage.textContent = 'Este link expirou. Por favor, solicite a redefinição de senha novamente.';
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage.textContent = 'O link de redefinição é inválido ou já foi usado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage.textContent = 'A senha escolhida é muito fraca. Tente uma senha mais forte.';
      } else {
        errorMessage.textContent = 'Erro ao redefinir a senha: ' + (error.message || 'Tente novamente mais tarde.');
      }
      errorBox.classList.remove('d-none');
      btn.disabled = false;
      btn.textContent = 'Redefinir Senha';
    }
  });
});
