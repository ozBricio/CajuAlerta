import io

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

old_blur = """  // Blur Validations
  const inputs = ['nomeCompleto', 'emailUser', 'senhaUser', 'senhaConfirma'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('blur', function() {
        const errBox = document.getElementById('err-' + id);
        if(!this.value.trim()) {
          this.classList.add('has-error');
          if(errBox) errBox.classList.remove('d-none');
        } else {
          // Remover o genérico, mas pode continuar com erro se não bater a RegEx.
          // O submit faz o catch completo.
          this.classList.remove('has-error');
          if(errBox) errBox.classList.add('d-none');
        }
      });
    }
  });"""

new_blur = """  // Blur Validations
  const inputs = ['nomeCompleto', 'emailUser', 'senhaUser', 'senhaConfirma'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('blur', function() {
        const errBox = document.getElementById('err-' + id);
        if(!this.value.trim()) {
          this.classList.add('has-error');
          if(errBox) errBox.classList.remove('d-none');
        } else {
          if (id === 'senhaConfirma') {
            const s1 = document.getElementById('senhaUser').value;
            if (this.value !== s1) {
              this.classList.add('has-error');
              if(errBox) errBox.classList.remove('d-none');
              return;
            }
          }
          this.classList.remove('has-error');
          if(errBox) errBox.classList.add('d-none');
        }
      });
    }
  });"""

cjs = cjs.replace(old_blur, new_blur)

# Also update the submit error text to match
cjs = cjs.replace("return showError('A senha de confirmação está diferente da senha principal.');", "return showError('A senha de baixo não está igual a de cima.');")

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
