import io
import re

with io.open('frontend/registrar.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/js/registrar\.js\?v=\d+', 'assets/js/registrar.js?v=4', html)
html = re.sub(r'assets/css/registrar\.css\?v=\d+', 'assets/css/registrar.css?v=7', html)

with io.open('frontend/registrar.html', 'w', encoding='utf-8') as f:
    f.write(html)
