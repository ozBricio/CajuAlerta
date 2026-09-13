document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginError');
  const errorMessage = document.getElementById('loginErrorMessage');
  let failedAttempts = 0;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const button = loginForm.querySelector('button[type="submit"]');

    errorBox.style.display = 'none';
    button.disabled = true;
    button.textContent = 'Acessando...';

    try {
      // 1. Tenta fazer o login
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // 2. Verifica se a conta está excluída ou bloqueada no Firestore
      const doc = await firebase.firestore().collection('usuarios').doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData.status === 'excluido') {
          await firebase.auth().signOut();
          throw new Error('Conta excluída.');
        }
        if (userData.status === 'bloqueado') {
          await firebase.auth().signOut();
          throw new Error('Conta bloqueada por violação de termos.');
        }
      }

      // Sucesso no login - reseta tentativas e redireciona
      failedAttempts = 0;
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      window.location.href = returnTo || 'perfil.html';

    } catch (error) {
      console.error(error);
      failedAttempts++;
      
      let msg = "Ocorreu um erro ao tentar entrar. Tente novamente.";
      
      // Mapeamento de erros do Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = "Usuário ou senha incorretos, tente novamente.";
      } else if (error.code === 'auth/too-many-requests') {
        msg = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas falhas. Redefina sua senha ou tente mais tarde.";
      } else if (error.message === 'Conta excluída.') {
        msg = "Essa conta não possui registro ativo em nosso portal.";
      } else if (error.message.includes('bloqueada')) {
        msg = "Sua conta foi bloqueada. Entre em contato com o suporte.";
      }

      // Regra da 10ª tentativa
      if (failedAttempts >= 10) {
        msg = "Muitas tentativas falhas. Recomendamos que você clique em 'Esqueci minha senha' abaixo e coloque seu e-mail para redefinir o acesso.";
      }

      errorMessage.textContent = msg;
      errorBox.style.display = 'flex';
      
    } finally {
      button.disabled = false;
      button.textContent = 'Acessar Conta';
    }
  });
});
