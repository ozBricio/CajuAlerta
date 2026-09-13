import io
import re

with io.open('frontend/perfil.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/css/perfil\.css\?v=\d+', 'assets/css/perfil.css?v=8', html)

with io.open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
