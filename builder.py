import io
import re
import os

files = ['perfil.html', 'admin-dashboard.html', 'noticias.html', 'noticia-completa.html']

for filename in files:
    filepath = os.path.join('frontend', filename)
    with io.open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'\.js\?v=\d+', '.js?v=20', html)
    html = re.sub(r'\.css\?v=\d+', '.css?v=20', html)
    
    with io.open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
