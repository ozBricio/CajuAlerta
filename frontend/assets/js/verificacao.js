document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.code-box');
  const btnVerificar = document.getElementById('btnVerificar');
  const msgBox = document.getElementById('msgBox');

  // Lógica de digitação e auto-focus
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      // Aceitar apenas números
      e.target.value = e.target.value.replace(/[^0-9]/g, '');

      if (e.target.value !== '') {
        // Pula para o próximo
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value === '') {
        // Volta para o anterior se apagar vazio
        if (index > 0) {
          inputs[index - 1].focus();
        }
      } else if (e.key === 'Enter') {
        btnVerificar.click();
      }
    });

    // Colar código completo
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
      
      for (let i = 0; i < text.length; i++) {
        inputs[i].value = text[i];
      }
      
      if (text.length === 6) {
        inputs[5].focus();
      } else if (text.length > 0) {
        inputs[text.length].focus();
      }
    });
  });

  btnVerificar.addEventListener('click', async () => {
    let codigo = '';
    inputs.forEach(input => codigo += input.value);

    if (codigo.length < 6) {
      showMessage('Preencha os 6 dígitos corretamente.', 'error');
      inputs.forEach(input => input.classList.add('error'));
      return;
    }

    // Remove erros visuais
    inputs.forEach(input => input.classList.remove('error'));
    
    btnVerificar.disabled = true;
    btnVerificar.textContent = 'Verificando...';

    // AQUI ENTRA A LÓGICA DE VALIDAÇÃO (Ex: Comparar com o banco ou API)
    // Simulação temporária:
    setTimeout(() => {
      if (codigo === '123456') { // Código mock para teste
        showMessage('✅ E-mail verificado com sucesso!', 'success');
        inputs.forEach(input => input.classList.add('success'));
        setTimeout(() => window.location.href = 'login.html', 2000);
      } else {
        showMessage('Código inválido ou expirado.', 'error');
        inputs.forEach(input => input.classList.add('error'));
        btnVerificar.disabled = false;
        btnVerificar.textContent = 'Confirmar Código';
      }
    }, 1200);
  });
});

function showMessage(text, type) {
  const msgBox = document.getElementById('msgBox');
  msgBox.textContent = text;
  msgBox.className = `alert-box ${type}`;
  msgBox.classList.remove('d-none');
}
