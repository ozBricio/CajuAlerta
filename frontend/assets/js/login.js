document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginErrorBox');
  const errorMessage = document.getElementById('loginErrorMessage');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.style.display = 'none';

    const button = form.querySelector('button[type="submit"]');
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const senha = document.getElementById('loginSenha').value;
    button.disabled = true;
    button.textContent = 'Entrando...';

    try {
            const userCredential = await window.auth.signInWithEmailAndPassword(email, senha);
      
      // Bloqueio de e-mail não verificado
      if (!userCredential.user.emailVerified && !email.includes('admin')) {
        await window.auth.signOut();
        throw new Error('Acesso negado: Você ainda não confirmou seu e-mail. Verifique sua caixa de entrada.');
      }
      
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      
      // Checa se é admin
      if (email.includes('admin')) {
        window.location.href = '/admin/dashboard.html';
      } else {
        window.location.href = returnTo || '/';
      }
    } catch (error) {
      errorMessage.textContent = error.message;
      errorBox.style.display = 'flex';
    } finally {
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  });
});
