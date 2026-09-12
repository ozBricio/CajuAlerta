import os
import glob
import re

def update_logos_and_css():
    # 1. Update HTML files
    html_files = glob.glob('*.html')
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace the <a class="logo"> inner content with the image
        # This regex matches the entire <a ... class="logo" ...>...</a>
        # and replaces it with the new image tag.
        pattern = r'<a\s+href="[^"]*"\s+class="logo"[^>]*>.*?</a>'
        replacement = r'<a href="/" class="logo"><img src="logo.png" alt="Caju Alerta" class="site-logo"></a>'
        content = re.sub(pattern, replacement, content, flags=re.DOTALL|re.IGNORECASE)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    # 2. Update common.css with new colors and logo style
    css_path = 'assets/css/common.css'
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css = f.read()
            
        # Update colors to match logo
        css = re.sub(r'--primary-green:\s*#[a-fA-F0-9]+;', '--primary-green: #a3ff00;', css)
        css = re.sub(r'--primary-orange:\s*#[a-fA-F0-9]+;', '--primary-orange: #ff9900;', css)
        
        # Add logo style if not present
        if '.site-logo' not in css:
            css += '\n\n.site-logo { max-height: 56px; width: auto; object-fit: contain; }'
            
        # Button text color: black on lime green is better contrast
        css = re.sub(r'(\.btn-primary\s*\{[^\}]*)color:\s*#fff;', r'\1color: #000;', css)
            
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css)

update_logos_and_css()
print("Logo and colors updated.")
