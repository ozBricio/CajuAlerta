import io
import re

with io.open('frontend/registrar.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Fix literal \n in CSS links
html = html.replace('\\n  <link rel="stylesheet" href="assets/css/cadastro.css">\\n  <link rel="stylesheet" href="assets/css/animations.css">', '')
html = html.replace('\\n', '\n')

with io.open('frontend/registrar.html', 'w', encoding='utf-8') as f:
    f.write(html)
