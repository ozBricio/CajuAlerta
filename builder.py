import io
import re

# ------------- REGISTRAR.HTML -------------
with io.open('frontend/registrar.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Make text white, increase font size, make it bolder if needed
old_style = 'font-size: 0.85rem; color: #d1d5db; line-height: 1.6; height: 180px; overflow-y: auto; padding-right: 10px; border-right: 2px solid #2d3342;'
new_style = 'font-size: 0.95rem; color: #ffffff; font-weight: 500; line-height: 1.6; height: 200px; overflow-y: auto; padding-right: 10px; border-right: 2px solid #2d3342; text-shadow: 0px 0px 1px rgba(255,255,255,0.2);'

html = html.replace(old_style, new_style)

# Also make the checkbox text brighter
html = html.replace('<span style="font-weight: bold; color: #fff;">', '<span style="font-weight: 700; color: #ffffff; font-size: 0.95rem; text-shadow: 0px 0px 1px rgba(255,255,255,0.5);">')

with io.open('frontend/registrar.html', 'w', encoding='utf-8') as f:
    f.write(html)

# ------------- CADASTRO.HTML -------------
with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    cad = f.read()

old_cad_style = 'padding: 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.8rem; color: #d1d5db;'
new_cad_style = 'padding: 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; color: #ffffff; font-weight: 500; text-shadow: 0px 0px 1px rgba(255,255,255,0.2);'

cad = cad.replace(old_cad_style, new_cad_style)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(cad)
