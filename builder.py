import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/js/cadastro\.js\?v=\d+', 'assets/js/cadastro.js?v=2', html)
with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(html)

with io.open('frontend/perfil.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/js/perfil\.js\?v=\d+', 'assets/js/perfil.js?v=7', html)
with io.open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
