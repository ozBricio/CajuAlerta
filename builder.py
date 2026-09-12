import io
import re

# ------------- REGISTRAR.HTML -------------
with io.open('frontend/registrar.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Make text black
old_style = 'font-size: 0.95rem; color: #ffffff; font-weight: 500; line-height: 1.6; height: 200px; overflow-y: auto; padding-right: 10px; border-right: 2px solid #2d3342; text-shadow: 0px 0px 1px rgba(255,255,255,0.2);'
new_style = 'font-size: 0.95rem; color: #000000; font-weight: 600; line-height: 1.6; height: 200px; overflow-y: auto; padding-right: 10px; border-right: 2px solid rgba(0,0,0,0.1);'
html = html.replace(old_style, new_style)

# Checkbox text
html = html.replace('<span style="font-weight: 700; color: #ffffff; font-size: 0.95rem; text-shadow: 0px 0px 1px rgba(255,255,255,0.5);">', '<span style="font-weight: 700; color: #000000; font-size: 0.95rem;">')

# Heading h1 color fix since wrapper is white
html = html.replace('<h1 style="color:#fff;', '<h1 style="color:#000;')

# Exemplo pratico box bg
html = html.replace('background: #171a21;', 'background: #fff3e0; color: #000;')

with io.open('frontend/registrar.html', 'w', encoding='utf-8') as f:
    f.write(html)


# ------------- CADASTRO.HTML -------------
with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    cad = f.read()

old_cad_style = 'padding: 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; color: #ffffff; font-weight: 500; text-shadow: 0px 0px 1px rgba(255,255,255,0.2);'
new_cad_style = 'padding: 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; color: #000000; font-weight: 600;'
cad = cad.replace(old_cad_style, new_cad_style)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(cad)
