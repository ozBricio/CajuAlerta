import io

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

new_logic = """function initCadastroValidation() {
  const form = document.getElementById('cadastroForm');
  if (!form) return;

  const senhaInput = document.getElementById('senhaUser');
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqSpecial = document.getElementById('reqSpecial');

  if (senhaInput) {
    senhaInput.addEventListener('input', (e) => {
      const v = e.target.value;
      if (v.length >= 8) reqLength.classList.add('valid');
      else reqLength.classList.remove('valid');
      
      if (/[A-Z]/.test(v)) reqUpper.classList.add('valid');
      else reqUpper.classList.remove('valid');
      
      if (/[a-z]/.test(v)) reqLower.classList.add('valid');
      else reqLower.classList.remove('valid');
      
      if (/[^A-Za-z0-9]/.test(v)) reqSpecial.classList.add('valid');
      else reqSpecial.classList.remove('valid');
    });
  }"""

c = c.replace("function initCadastroValidation() {\\n  const form = document.getElementById('cadastroForm');\\n  if (!form) return;", new_logic)

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(c)
