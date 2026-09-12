import os
import glob
import re

# 1. Criar vercel.json
with open('vercel.json', 'w', encoding='utf-8') as f:
    f.write('{\n  "cleanUrls": true\n}')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remover .html dos hrefs (exclui URLs absolutas ou links externos com http)
    # Ex: href="index.html" -> href="index"
    content = re.sub(r'href="(?!http)([^"]+)\.html"', r'href="\1"', content)
    content = re.sub(r'href=\'(?!http)([^\']+)\.html\'', r'href=\'\1\'', content)

    # Substituir href="index" por href="/" para a home ficar perfeita no Vercel
    content = re.sub(r'href="index"', r'href="/"', content)
    
    # Resolver location.href = "..."
    content = re.sub(r'location\.href\s*=\s*([\'"])([^"\'\>]+)\.html\1', r'location.href=\1\2\1', content)
    content = re.sub(r'location\.href\s*=\s*([\'"])([^"\'\>]+)\.html(\?[^"\']+)\1', r'location.href=\1\2\3\1', content)
    # Fix 'index' redirect to '/'
    content = re.sub(r'location\.href\s*=\s*[\'"]index[\'"]', r'location.href="/"', content)
    
    if filepath.endswith('.js') or filepath.endswith('.css'):
        # Remover blocos separadores robóticos
        content = re.sub(r'/\*={5,}\s*.*?\s*={5,}\*/', '', content, flags=re.DOTALL)
        # Remover comentários de bloco genéricos do início
        content = re.sub(r'/\*\*\s*\n\s*\*\s*[a-zA-Z0-9_-]+\.(js|css).*?\*/', '', content, flags=re.DOTALL)
        
        # Remover comentários de linha estúpidos ou chatos
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            trimmed = line.strip()
            # Ignora linhas que são só um comentário bobo
            if trimmed.startswith('//') and any(word in trimmed for word in ['Simulação', 'LGPD', 'Validação', 'Simples']):
                continue
            new_lines.append(line)
        content = '\n'.join(new_lines)
        
        # Remover CSS header comments chatos
        content = re.sub(r'/\* [a-zA-Z0-9 ]+ \*/', '', content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Scan files
html_files = glob.glob('*.html')
js_files = glob.glob('assets/js/*.js')
css_files = glob.glob('assets/css/*.css')

for f in html_files + js_files + css_files:
    process_file(f)

print("Done")
