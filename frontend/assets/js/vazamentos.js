document.getElementById('checkLeakForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const email = document.getElementById('emailCheckInput').value.toLowerCase();
      
      btn.disabled = true;
      btn.textContent = 'Buscando...';
      document.getElementById('resultClean').style.display = 'none';
      document.getElementById('resultLeaked').style.display = 'none';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Verificar';
        
        // Simulação TCC: se o email tiver número, diz que vazou.
        if (/\d/.test(email)) {
          document.getElementById('resultLeaked').style.display = 'block';
        } else {
          document.getElementById('resultClean').style.display = 'block';
        }
      }, 1500);
    });
