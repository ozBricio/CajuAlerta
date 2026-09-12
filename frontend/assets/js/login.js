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
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;
      
      // Busca o perfil no Firestore
      const userDoc = await firebase.firestore().collection('usuarios').doc(user.uid).get();
      let userData = userDoc.data();
      
      // Se não existir (legacy admins), ignora
      if (userData) {
        if (userData.status === 'bloqueado') {
          await firebase.auth().signOut();
          throw new Error('Perfil bloqueado. Entre em contato com o suporte para saber mais informações.');
        }
        
        // Atualiza histórico de acessos
        await firebase.firestore().collection('historico_acessos').add({
          uid: user.uid,
          email: user.email,
          dataAcesso: firebase.firestore.FieldValue.serverTimestamp(),
          ip: 'via-cliente' // Client-side IP tracking varies, just placeholder
        });
        
        // Atualiza último acesso no perfil
        await firebase.firestore().collection('usuarios').doc(user.uid).update({
          ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      // Bloqueio de e-mail não verificado
      if (!user.emailVerified && !email.includes('admin')) {
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
