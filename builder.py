import io
import re

with io.open('frontend/central-seguranca.html', 'r', encoding='utf-8', errors='ignore') as f:
    html_central = f.read()

footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', html_central, re.DOTALL)
full_footer = footer_match.group(1) if footer_match else None

if full_footer:
    for filename in ['recuperar-senha.html', 'verificacao.html']:
        with io.open('frontend/' + filename, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        
        # Replace </body> with footer + </body>
        if full_footer not in html:
            html = html.replace('</body>', full_footer + '\n</body>')
            with io.open('frontend/' + filename, 'w', encoding='utf-8') as f:
                f.write(html)
