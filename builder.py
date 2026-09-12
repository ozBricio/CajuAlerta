import io
with io.open('frontend/cadastro.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<script src="https://www.google.com/recaptcha/api.js" async defer></script>', '')

c = c.replace(
    '<div class="g-recaptcha" data-sitekey="6Lcm47UtAAAAAKkrYEurGBmGaX76Vr72IfxVdrLQ"></div>',
    '<div class="native-captcha" id="nativeCaptcha">\\n              <label class="captcha-label">\\n                <input type="checkbox" id="captchaCheckbox">\\n                <div class="captcha-box"></div>\\n                <span>Não sou um robô</span>\\n              </label>\\n              <div class="captcha-brand">\\n                <img src="assets/img/logo2.png" alt="Caju Security">\\n                <span>Privacidade<br>Termos</span>\\n              </div>\\n            </div>'
)

c = c.replace('</body>', '<script src="assets/js/caju-security.js"></script>\\n</body>')

c = c.replace(
    'placeholder="Mínimo de 8 caracteres" required minlength="8">\\n          </div>',
    'placeholder="Mínimo de 8 caracteres" required minlength="8">\\n            <small class="field-hint">Deve conter letra maiúscula, minúscula e caractere especial.</small>\\n          </div>'
)

with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(c)
