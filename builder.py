import io
import re

for filename in ['frontend/perfil.html', 'frontend/registrar.html']:
    with io.open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'assets/js/perfil\.js\?v=\d+', 'assets/js/perfil.js?v=6', html)
    html = re.sub(r'assets/js/registrar\.js\?v=\d+', 'assets/js/registrar.js?v=6', html)
    html = html.replace('<title>Meu Perfil - Caju Alerta</title>', '<title>Painel de Registros - Caju Alerta</title>')
    
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
