import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Replace all those ugly artifacts directly
html = re.sub(r'<small class="field-hint">.*?</small>', '<small class="field-hint">Não é permitido o uso de números ou símbolos.</small>', html, count=1)
html = re.sub(r'<div class="field-error-msg d-none" id="err-nomeCompleto">.*?</div>', '<div class="field-error-msg d-none" id="err-nomeCompleto">⚠️ Necessário preencher corretamente.</div>', html)
html = re.sub(r'<div class="field-error-msg d-none" id="err-emailUser">.*?</div>', '<div class="field-error-msg d-none" id="err-emailUser">⚠️ E-mail inválido ou necessário.</div>', html)
html = re.sub(r'<div class="field-error-msg d-none" id="err-senhaUser".*?</div>', '<div class="field-error-msg d-none" id="err-senhaUser" style="margin-top: 4px;">⚠️ Senha fraca ou em branco.</div>', html)
html = re.sub(r'<div class="field-error-msg d-none" id="err-senhaConfirma".*?</div>', '<div class="field-error-msg d-none" id="err-senhaConfirma" style="position:absolute; bottom:-22px; left:0;">⚠️ Senhas não coincidem.</div>', html)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(html)
