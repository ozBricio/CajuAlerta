import io

# 1. Update index.html to use <picture> for the logo
with io.open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_logo = '<img class="hero-logo float-anim" src="/assets/img/logo.png" alt="Caju Alerta, segurança digital para não cair em golpe">'
new_logo = '''<picture class="hero-logo float-anim">
            <source media="(max-width: 767px)" srcset="/assets/img/logocelular.png">
            <img src="/assets/img/logo.png" alt="Caju Alerta, segurança digital para não cair em golpe">
          </picture>'''

html = html.replace(old_logo, new_logo)

with io.open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update responsive.css to reduce padding-top on mobile
with io.open('frontend/assets/css/responsive.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace padding-top: 100px; with padding-top: 20px; inside .hero-grid
css = css.replace('padding-top: 100px;', 'padding-top: 0px;')

with io.open('frontend/assets/css/responsive.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Modifications applied!')
