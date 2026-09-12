import io
import re

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

rl_logic = """
async function processRegistration(nome, email, senha, consentimentos) {
  // Rate Limit Client-Side Simples
  const lastSignup = localStorage.getItem('cajuLastSignup');
  const now = Date.now();
  if (lastSignup && (now - parseInt(lastSignup)) < 60000) {
    return showError('Por segurança, aguarde um minuto antes de tentar criar outra conta.');
  }

  const btn = document.getElementById('btnSubmitCadastro');"""

cjs = cjs.replace("async function processRegistration(nome, email, senha, consentimentos) {\n  const btn = document.getElementById('btnSubmitCadastro');", rl_logic)

# Guard against successful signup rewriting rate limit
cjs = cjs.replace('const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);', "localStorage.setItem('cajuLastSignup', Date.now().toString());\n    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);")

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
