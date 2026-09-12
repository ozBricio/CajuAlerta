import io
import re

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Ache o começo de form.addEventListener('submit'
start_idx = c.find("  form.addEventListener('submit', (e) => {")
end_idx = c.find("processRegistration(nome, email, senha1, { aceiteTermos, aceitePrivacidade, aceiteProjeto });")
end_idx = c.find("});", end_idx) + 3

if start_idx != -1 and end_idx != -1:
    old_submit = c[start_idx:end_idx]
    
    new_submit = """  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    // Limpar bordas vermelhas
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

    const nomeInput = document.getElementById('nomeCompleto');
    const emailInput = document.getElementById('emailUser');
    const senha1Input = document.getElementById('senhaUser');
    const senha2Input = document.getElementById('senhaConfirma');
    
    const termsGroup = document.querySelector('.terms-group');
    const captchaContainer = document.getElementById('nativeCaptcha');

    const aceiteTermos = document.getElementById('aceiteTermos').checked;
    const aceitePrivacidade = document.getElementById('aceitePrivacidade').checked;
    const aceiteProjeto = document.getElementById('aceiteProjeto').checked;
    const isHuman = document.getElementById('captchaCheckbox').checked;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha1 = senha1Input.value;
    const senha2 = senha2Input.value;

    if (!nome) {
      nomeInput.classList.add('has-error');
      return showError('Você esqueceu de preencher o seu nome completo.');
    }
    
    const nameRegex = /^[A-Za-zÁ-Úá-úÂ-Ûâ-ûÃ-Õã-õÇç]+(?:\\s[A-Za-zÁ-Úá-úÂ-Ûâ-ûÃ-Õã-õÇç]+)+$/;
    if (!nameRegex.test(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Nome inválido. Digite Nome e Sobrenome sem utilizar números ou símbolos.');
    }

    if (!email) {
      emailInput.classList.add('has-error');
      return showError('Você esqueceu de preencher o seu e-mail.');
    }

    if (!isValidEmailForCaju(email)) {
      emailInput.classList.add('has-error');
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook.');
    }

    if (!senha1) {
      senha1Input.classList.add('has-error');
      return showError('Você esqueceu de criar a sua senha.');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/.test(senha1)) {
      senha1Input.classList.add('has-error');
      return showError('Sua senha está fraca. Preencha todos os requisitos solicitados na cor verde.');
    }

    if (!senha2) {
      senha2Input.classList.add('has-error');
      return showError('Você esqueceu de confirmar a sua senha.');
    }

    if (senha1 !== senha2) {
      senha2Input.classList.add('has-error');
      return showError('A senha de confirmação está diferente da senha principal.');
    }

    if (!aceiteTermos || !aceitePrivacidade || !aceiteProjeto) {
      termsGroup.classList.add('has-error');
      return showError('Você esqueceu de aceitar os Termos e Políticas obrigatórios.');
    }
    
    if (!isHuman) {
      captchaContainer.classList.add('has-error');
      return showError('Você esqueceu de realizar a verificação de segurança (Não sou um robô).');
    }

    processRegistration(nome, email, senha1, { aceiteTermos, aceitePrivacidade, aceiteProjeto });
  });"""
    
    c = c.replace(old_submit, new_submit)
    
    with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
        f.write(c)
