import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

html = re.sub(r'<div class="terms-group">(\s*<legend>)', r'<fieldset class="terms-group">\1', html)
html = re.sub(r'(</label>\s*)</div>(\s*<button type="submit" id="btnSubmitCadastro")', r'\1</fieldset>\2', html)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(html)
