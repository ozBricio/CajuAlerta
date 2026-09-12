import io
import re

with io.open('frontend/login.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Ache o button submit e insira antes dele
html = re.sub(r'(<button type="submit".*?>Entrar</button>)', r'<div style="text-align: right; margin-bottom: 20px;"><a href="recuperar-senha.html" class="auth-link" style="font-size: 0.9rem; color: #ff9900; text-decoration: none;">Esqueceu a senha?</a></div>\n          \1', html)

with io.open('frontend/login.html', 'w', encoding='utf-8') as f:
    f.write(html)
