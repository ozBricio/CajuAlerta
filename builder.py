import io
import re

for filename in ['frontend/registrar.html', 'frontend/perfil.html']:
    with io.open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'assets/js/common\.js(\?v=\d+)?', 'assets/js/common.js?v=4', html)
    html = re.sub(r'assets/css/common\.css(\?v=\d+)?', 'assets/css/common.css?v=4', html)
    html = re.sub(r'assets/css/registrar\.css(\?v=\d+)?', 'assets/css/registrar.css?v=4', html)
    html = re.sub(r'assets/css/perfil\.css(\?v=\d+)?', 'assets/css/perfil.css?v=4', html)
    
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
