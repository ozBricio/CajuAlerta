import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

c = re.sub(r'<div class="captcha-box"></div>\s*<span>.*?</span>', '<div class="captcha-box"></div>\n                <span>Não sou um robô</span>', c)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(c)
