import io

# Modify JS
with io.open('frontend/assets/js/recuperar-senha.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_js = '''      if (error.code === 'auth/user-not-found') {
        errorMessage.textContent = 'Nenhuma conta encontrada com este e-mail.';'''

new_js = '''      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
        // Tratar como sucesso por segurança (evitar enumeração de e-mails)
        form.style.display = 'none';
        successBox.classList.remove('d-none');
        return;
      } else if (error.code === 'auth/user-not-found') { // fallback
        errorMessage.textContent = 'Nenhuma conta encontrada com este e-mail.';'''

js = js.replace(old_js, new_js)

with io.open('frontend/assets/js/recuperar-senha.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Modify HTML
with io.open('frontend/recuperar-senha.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
# Regex replace the content of the success box
html = re.sub(
    r'<strong[^>]*>✅ E-mail enviado com sucesso!</strong>\s*Verifique sua caixa de entrada \(e a pasta de Spam\). O link expira em breve por questões de segurança.',
    '<strong style="display:block; margin-bottom:5px;">✅ Solicitação Recebida</strong>\n              Se o seu e-mail estiver cadastrado em nosso sistema, enviaremos o link de recuperação para você. Verifique sua caixa de entrada (e a pasta de Spam).',
    html,
    flags=re.IGNORECASE
)

# Update version
html = html.replace('recuperar-senha.js?v=2', 'recuperar-senha.js?v=3')
html = html.replace('recuperar-senha.js', 'recuperar-senha.js?v=3')

with io.open('frontend/recuperar-senha.html', 'w', encoding='utf-8') as f:
    f.write(html)
