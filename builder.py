import io
import re

with io.open('frontend/perfil.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'assets/js/perfil\.js\?v=\d+', 'assets/js/perfil.js?v=25', html)

with io.open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
