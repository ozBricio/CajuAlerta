document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginErrorBox');
  const errorMessage = document.getElementById('loginErrorMessage');
  let failedAttempts = 0;

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // ISSO AQUI IMPEDE A PÁGINA DE ATUALIZAR
      
      const emailInput = document.getElementById('loginEmail');
      const senhaInput = document.getElementById('loginSenha');
      
      if (!emailInput || !senhaInput) {
        console.error("Campos de email/senha não encontrados no HTML");
        return;
      }
      
      const email = emailInput.value.trim();
      const password = senhaInput.value;
      const button = loginForm.querySelector('button[type="submit"]');

      errorBox.classList.add('d-none');
      errorBox.style.display = ''; // limpa estilos inline se tiver
      
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
        window.location.replace(returnTo || 'perfil.html'); // replace para nao ficar no historico

      } catch (error) {
        console.error(error);
        failedAttempts++;
        
        let msg = "Ocorreu um erro ao tentar entrar. Tente novamente.";
        
        // Mapeamento de erros do Firebase
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          msg = "Usuário ou senha incorretos, tente novamente.";
        } else if (error.code === 'auth/too-many-requests') {
          msg = "Acesso temporariamente desativado devido a muitas tentativas falhas. Redefina sua senha ou tente mais tarde.";
        } else if (error.code === 'auth/invalid-email') {
          msg = "O formato do e-mail é inválido.";
        } else if (error.message === 'Conta excluída.') {
          msg = "Essa conta não possui registro ativo em nosso portal.";
        } else if (error.message.includes('bloqueada')) {
          msg = "Sua conta foi bloqueada. Entre em contato com o suporte.";
        }

        // Regra da 10ª tentativa
        if (failedAttempts >= 10) {
          msg = "Muitas tentativas falhas. Recomendamos que você clique em 'Esqueceu a senha?' abaixo e coloque seu e-mail para redefinir o acesso.";
        }

        errorMessage.textContent = msg;
        errorBox.classList.remove('d-none');
        
      } finally {
        button.disabled = false;
        button.textContent = 'Entrar';
      }
    });
  }
});
