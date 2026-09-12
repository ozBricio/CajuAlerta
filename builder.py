import io
import re

for filename in ['frontend/index.html', 'frontend/login.html', 'frontend/cadastro.html', 'frontend/registrar.html', 'frontend/perfil.html']:
    with io.open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'assets/js/common\.js(\?v=\d+)?', 'assets/js/common.js?v=3', html)
    
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
