import io
with io.open('frontend/cadastro.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()
c = c.replace('<script src="https://www.google.com/recaptcha/api.js" async defer></script>', '')
c = c.replace('<div class="g-recaptcha" data-sitekey="6Lcm47UtAAAAAKkrYEurGBmGaX76Vr72IfxVdrLQ"></div>', '<div class="native-captcha" id="nativeCaptcha"><label class="captcha-label"><input type="checkbox" id="captchaCheckbox"><div class="captcha-box"></div><span>Não sou um robô</span></label><div class="captcha-brand"><img src="assets/img/logo2.png" alt="Caju Security"><span>Privacidade<br>Termos</span></div></div>')
with io.open('frontend/cadastro.html', 'w', encoding='utf-8') as f:
    f.write(c)
