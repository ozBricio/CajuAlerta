import os
import glob
import re

# Load templates
with open('templates.txt', 'r', encoding='utf-8') as f:
    content = f.read()

header_match = re.search(r'===HEADER===\n(.*?)\n===FOOTER===', content, re.DOTALL)
footer_match = re.search(r'===FOOTER===\n(.*)', content, re.DOTALL)

if not header_match or not footer_match:
    print("Erro ao ler templates.txt")
    exit(1)

std_header = header_match.group(1).strip()
std_footer = footer_match.group(1).strip()

html_files = glob.glob('frontend/*.html')
files_updated = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    original_html = html

    # 1. Replace Header
    html = re.sub(r'<header[^>]*>.*?</header>', std_header, html, flags=re.DOTALL)
    
    # 2. Replace Footer
    html = re.sub(r'<footer[^>]*>.*?</footer>', std_footer, html, flags=re.DOTALL)
    
    # 3. Inject missing CSS in <head>
    if 'animations.css' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/animations.css">\n</head>')
    
    if 'responsive.css' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/responsive.css">\n</head>')

    if html != original_html:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        files_updated += 1

print(f"Processado: {len(html_files)} arquivos. {files_updated} arquivos foram atualizados para o padrao.")
