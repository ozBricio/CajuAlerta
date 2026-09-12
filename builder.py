import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Add a warning text inside the terms fieldset
old_legend = '<legend>Consentimentos obrigatórios</legend>'
new_legend = """<legend>Consentimentos obrigatórios</legend>
          <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.3); padding: 15px; border-radius: 6px; margin-bottom: 15px; font-size: 0.8rem; color: #d1d5db;">
            <strong style="color: #ef4444; display: block; margin-bottom: 8px;">⚠️ Aviso Jurídico de Integração de Dados:</strong>
            Você está criando esta conta por livre e espontânea vontade, ninguém está forçando. Ao confirmar, seu E-mail, Nome e Acessos ficam registrados no nosso sistema sob criptografia. Nossos dados NÃO são vendidos. Se houver Mandado Judicial, seus dados serão descriptografados e entregues às autoridades sob a Lei Brasileira. Se não quer seus dados aqui, simplesmente não crie a conta.
          </div>"""

html = html.replace(old_legend, new_legend)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(html)
