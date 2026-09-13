import io
import re

with io.open('frontend/perfil.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Inject css
if 'cadastro.css' not in html:
    html = html.replace('<link rel="stylesheet" href="assets/css/perfil.css?v=11">', '<link rel="stylesheet" href="assets/css/cadastro.css">\n  <link rel="stylesheet" href="assets/css/registrar.css?v=7">\n  <link rel="stylesheet" href="assets/css/perfil.css?v=12">')

# Also remove the registrar.html from the footer link and point to perfil.html
html = html.replace('href="/registrar.html"', 'href="/perfil.html"')
# And from common.js? No, common.js already points to perfil.html!

with io.open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
