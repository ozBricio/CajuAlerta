import io
import re

with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    cad = f.read()

# Make the warning explicitly red
cad = cad.replace('Você está criando esta conta por livre e espontânea vontade, ninguém está forçando.',
                  '<span style="color: #ef4444; font-weight: 800; font-size: 1rem;">Você está criando esta conta por livre e espontânea vontade, ninguém está forçando. Ao confirmar, seu E-mail, Nome e Acessos ficam registrados no nosso sistema sob criptografia.</span> Nossos dados NÃO são vendidos. Se houver Mandado Judicial, seus dados serão descriptografados e entregues às autoridades sob a Lei Brasileira. Se não quer seus dados aqui, simplesmente não crie a conta.')

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(cad)
