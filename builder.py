import io
import re

with io.open('frontend/perfil.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = html.replace('<h2 style="color: #22c55e; margin-bottom: 10px;">Confirmado</h2>', '<h2 style="color: #ffffff; margin-bottom: 10px;">Confirmado</h2>')
html = re.sub(r'assets/css/registrar\.css\?v=\d+', 'assets/css/registrar.css?v=8', html)
if 'registrar.css' in html and '?v=' not in html.split('registrar.css')[1][:5]:
    html = html.replace('assets/css/registrar.css', 'assets/css/registrar.css?v=8')

html = re.sub(r'assets/js/perfil\.js\?v=\d+', 'assets/js/perfil.js?v=14', html)

with io.open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
