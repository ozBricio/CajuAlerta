import io
import re

with io.open('frontend/assets/js/common.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# I will replace the whole initPlatformAccess block
old_block_pattern = r'async function initPlatformAccess\(\) \{.*?\n\}\n\nfunction checkAuthStatus'
# Wait, I don't need regex, I can just rewrite it securely

replacement = '''async function initPlatformAccess() {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      const existing = navList.querySelectorAll('.platform-entry, .logout-entry');
      existing.forEach(e => e.remove());

      const platformLi = document.createElement('li');
      platformLi.className = 'platform-entry';
      
      if (user) {
        platformLi.innerHTML = <a class="nav-link platform-link" href="perfil.html">Minha Conta</a>;
        navList.appendChild(platformLi);
        
        const logoutLi = document.createElement('li');
        logoutLi.className = 'logout-entry';
        logoutLi.innerHTML = <button id="globalLogoutBtn" class="support-logout">Sair</button>;
        navList.appendChild(logoutLi);
        
        document.getElementById('globalLogoutBtn').addEventListener('click', async () => { 
            await window.auth.signOut(); 
            window.location.replace('index.html'); 
        });
      } else {
        platformLi.innerHTML = <a class="nav-link platform-link" href="login.html">Acessar</a>;
        navList.appendChild(platformLi);
      }
    });
  }
}

function checkAuthStatus'''

js = re.sub(r'async function initPlatformAccess\(\) \{.*?\n\}\n\nfunction checkAuthStatus', replacement, js, flags=re.DOTALL)

with io.open('frontend/assets/js/common.js', 'w', encoding='utf-8') as f:
    f.write(js)
