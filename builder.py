import io
import re

with io.open('frontend/assets/js/login.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

new_logic = """      const userCredential = await window.auth.signInWithEmailAndPassword(email, senha);
      
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
      }"""

c = re.sub(r'await window\.auth\.signInWithEmailAndPassword\(email, senha\);.*?\} else \{\s*window\.location\.href = returnTo \|\| \'/\';\s*\}', new_logic, c, flags=re.MULTILINE|re.DOTALL)

with io.open('frontend/assets/js/login.js', 'w', encoding='utf-8') as f:
    f.write(c)
