import io
import re

with io.open('frontend/login.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'assets/js/login\.js\?v=\d+', 'assets/js/login.js?v=5', html)

with io.open('frontend/login.html', 'w', encoding='utf-8') as f:
    f.write(html)
