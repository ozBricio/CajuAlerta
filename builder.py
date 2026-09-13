import io
import os
import re

with io.open('frontend/central-seguranca.html', 'r', encoding='utf-8', errors='ignore') as f:
    html_central = f.read()

footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', html_central, re.DOTALL)
full_footer = footer_match.group(1) if footer_match else None

if full_footer:
    for filename in os.listdir('frontend'):
        if filename.endswith('.html'):
            filepath = os.path.join('frontend', filename)
            with io.open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                html = f.read()
            
            # Check if it has a footer to replace
            if '<footer class="site-footer">' in html:
                new_html = re.sub(r'<footer class="site-footer">.*?</footer>', full_footer, html, flags=re.DOTALL)
                if new_html != html:
                    with io.open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_html)
                    print(f"Updated footer in {filename}")
