import os
import glob
import re

html_files = glob.glob('frontend/*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove responsive.css
    html = re.sub(r'\s*<link rel="stylesheet" href="assets/css/responsive\.css.*?>', '', html)
    
    # Add it back right before </head>
    html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/responsive.css?v=6">\n</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print(f"CSS order fixed for {len(html_files)} files.")
