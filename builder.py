import io
import re

with io.open('frontend/central-seguranca.html', 'r', encoding='utf-8', errors='ignore') as f:
    html_central = f.read()

footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', html_central, re.DOTALL)
full_footer = footer_match.group(1) if footer_match else None

if full_footer:
    with io.open('frontend/noticias.html', 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'<footer class="site-footer">.*?</footer>', full_footer, html, flags=re.DOTALL)
    
    with io.open('frontend/noticias.html', 'w', encoding='utf-8') as f:
        f.write(html)
