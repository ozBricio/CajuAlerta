import io
import re

with io.open('frontend/consulta.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/js/consulta\.js\?v=\d+', 'assets/js/consulta.js?v=2', html)
if '?v=' not in html.split('consulta.js')[1][:5]:
    html = html.replace('assets/js/consulta.js', 'assets/js/consulta.js?v=2')

with io.open('frontend/consulta.html', 'w', encoding='utf-8') as f:
    f.write(html)
