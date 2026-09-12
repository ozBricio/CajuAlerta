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
      // Simulação do comportamento nativo do Firebase Auth / Firestore (Arquitetura Serverless)
      // Quando integrado ao Firebase, essa verificação checa o Documento do Usuário na coleção 'users'
      let role = 'user';
      if (email.includes('admin')) {
        role = 'admin'; // Simula leitura do role 'admin' no banco
      }

      // Sucesso simulado
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      
      if (role === 'admin') {
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
