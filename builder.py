import io
import re

with io.open('frontend/assets/js/caju-security.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

cjs = cjs.replace('"Onde voc\\u011B toma banho"', '"Objetos usados no banho ou encontrados no banheiro"')
cjs = cjs.replace('"Onde você toma banho"', '"Objetos usados no banho ou encontrados no banheiro"')
cjs = cjs.replace('"Onde vocǦ toma banho"', '"Objetos usados no banho ou encontrados no banheiro"')
cjs = cjs.replace('Onde você toma banho', 'Objetos usados no banho ou encontrados no banheiro')
cjs = cjs.replace('Onde voc\u011b toma banho', 'Objetos usados no banho ou encontrados no banheiro')

with io.open('frontend/assets/js/caju-security.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
