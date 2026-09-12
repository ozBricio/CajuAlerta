import io
import re

for filename in ['frontend/registrar.html', 'frontend/perfil.html']:
    with io.open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'assets/js/registrar\.js(\?v=\d+)?', 'assets/js/registrar.js?v=2', html)
    html = re.sub(r'assets/js/perfil\.js(\?v=\d+)?', 'assets/js/perfil.js?v=2', html)
    html = re.sub(r'assets/css/registrar\.css(\?v=\d+)?', 'assets/css/registrar.css?v=5', html)
    
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
