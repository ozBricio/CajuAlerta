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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível entrar.');

      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      window.location.href = returnTo || '/suporte';
    } catch (error) {
      errorMessage.textContent = error.message;
      errorBox.style.display = 'flex';
    } finally {
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  });
});
