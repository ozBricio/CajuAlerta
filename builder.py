import io

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Fix special character regex to only match symbols, not accents
# Old: /[^A-Za-z0-9]/.test(v)
# New: /[!@#\$%\^&\*\(\)_\+\-\=\[\]\{\};':\"\\|,.<>\/?]/.test(v)

c = c.replace('/[^A-Za-z0-9]/.test(v)', '/[!@#\$%^&*(),.?":{}|<>\\\-_=\+\\\/\[\]~]/.test(v)')
c = c.replace('/[^A-Za-z0-9]/.test(senha1)', '/[!@#\$%^&*(),.?":{}|<>\\\-_=\+\\\/\[\]~]/.test(senha1)')

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(c)
