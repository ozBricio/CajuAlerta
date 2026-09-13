import io
import re

with io.open('frontend/assets/js/login.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Add status == excluido logic
old_block = """        if (userData && userData.status === 'bloqueado') {
          await window.auth.signOut();
          errorBox.innerHTML = '<strong>Acesso Bloqueado</strong><br>Sua conta foi suspensa pela moderação.';
          errorBox.classList.remove('d-none');
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Acessar Plataforma';
          return;
        }"""

new_block = """        if (userData && userData.status === 'bloqueado') {
          await window.auth.signOut();
          errorBox.innerHTML = '<strong>Acesso Bloqueado</strong><br>Sua conta foi suspensa pela moderação.';
          errorBox.classList.remove('d-none');
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Acessar Plataforma';
          return;
        }
        
        if (userData && userData.status === 'excluido') {
          await window.auth.signOut();
          errorBox.innerHTML = 'Essa conta não possui registro ativo em nosso portal.';
          errorBox.classList.remove('d-none');
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Acessar Plataforma';
          return;
        }"""

js = js.replace(old_block, new_block)

with io.open('frontend/assets/js/login.js', 'w', encoding='utf-8') as f:
    f.write(js)
