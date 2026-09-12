document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Firebase Auth State Observer para o Header
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(async (user) => {
      const accessLink = document.getElementById('platformAccessLink');
      const platformEntry = document.querySelector('.platform-entry');
      
      if (user && accessLink && platformEntry) {
        try {
          // Tenta buscar o nome no Firestore
          const docSnap = await firebase.firestore().collection('usuarios').doc(user.uid).get();
          let pName = 'Perfil';
          if (docSnap.exists) {
            pName = docSnap.data().nome.split(' ')[0]; // Primeiro nome
          }

          // Muda o botão Acessar para Nome do Usuário -> perfil.html
          accessLink.textContent = Olá, ;
          accessLink.href = 'perfil.html';
          
          // Cria o botão Sair se não existir
          if (!document.getElementById('btnLogoutHeader')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'btnLogoutHeader';
            logoutBtn.textContent = 'Sair';
            logoutBtn.className = 'platform-link';
            logoutBtn.style.background = 'transparent';
            logoutBtn.style.border = '1px solid #ef4444';
            logoutBtn.style.color = '#ef4444';
            logoutBtn.style.marginLeft = '10px';
            logoutBtn.style.cursor = 'pointer';
            
            logoutBtn.addEventListener('click', () => {
              firebase.auth().signOut().then(() => {
                window.location.href = 'index.html';
              });
            });
            
            platformEntry.appendChild(logoutBtn);
          }
        } catch (e) {
          console.error("Erro ao buscar dados do usuário no header:", e);
        }
      }
    });
  }
});
