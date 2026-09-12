import io
import re

with io.open('frontend/assets/css/cadastro.css', 'a', encoding='utf-8') as f:
    f.write('''
/* Valid input highlight */
.valid-input { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important; }
''')

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Massive array of blocked words
blocked_words_script = """
const BLOCKED_WORDS = [
  'macaco', 'burro', 'cavalo', 'rato', 'porco', 'vaca', 'cachorro', 'cadela', 'lixo', 'merda', 'bosta',
  'computador', 'celular', 'televisao', 'tv', 'radio', 'telefone', 'geladeira', 'fogao', 'microondas',
  'administrador', 'moderador', 'caju', 'cajualerta', 'suporte', 'sistema', 'root', 'master', 'admin',
  'preconceito', 'viado', 'bicha', 'sapatão', 'sapatela', 'crioulo', 'preto', 'macaca', 'safado', 'vagabundo',
  'puta', 'puto', 'caralho', 'buceta', 'piroca', 'pica', 'cu', 'arrombado', 'corno', 'idiota', 'imbecil',
  'retardado', 'mongol', 'mongoloide', 'autista', 'cego', 'surdo', 'mudo', 'aleijado', 'deficiente',
  'maconheiro', 'drogado', 'bebado', 'ladrão', 'assassino', 'estuprador', 'pedofilo', 'nazista', 'fascista',
  'racista', 'homofobico', 'machista', 'feminazi', 'abortista', 'comunista', 'petista', 'bolsonarista',
  'teste', 'testando', '123', 'abc', 'qwe', 'asd', 'zxc', 'fake', 'falso', 'anonimo', 'nobody', 'ninguem',
  'deus', 'jesus', 'diabo', 'satanas', 'lucifer', 'capeta', 'demonio', 'inferno', 'ceu', 'anjo', 'santo',
  'brasil', 'saopaulo', 'riodejaneiro', 'belohorizonte', 'salvador', 'fortaleza', 'brasilia', 'curitiba',
  'manaus', 'recife', 'portoalegre', 'belem', 'goiania', 'guarulhos', 'campinas', 'saoluis', 'saogoncalo',
  'maceio', 'duquedecaxias', 'natal', 'teresina', 'saobernardodocampo', 'campogrande', 'osasco', 'joaopessoa',
  'santoandre', 'saojosedoscampos', 'jaboataodosguararapes', 'ribeiraopreto', 'uberlandia', 'contagem',
  'sorocaba', 'aracaju', 'feira de santana', 'cuiaba', 'joinville', 'juiz de fora', 'londrina', 'niteroi',
  'aparecida de goiania', 'ananindeua', 'porto velho', 'serra', 'caxias do sul', 'macapa', 'florianopolis',
  'vila velha', 'maua', 'sao joao de meriti', 'sao jose do rio preto', 'mogi das cruzes', 'betim', 'santos',
  'diadema', 'maringa', 'jundiai', 'campina grande', 'montes claros', 'rio branco', 'piracicaba', 'carapicuiba',
  'olinda', 'corumba', 'macae', 'petropolis', 'voltar edonda', 'franca', 'canoas', 'pelotas', 'vitoria',
  'barueri', 'taubate', 'blumenau', 'franco da rocha', 'itaquaquecetuba', 'caucaia', 'vitoria da conquista',
  'caruaru', 'petrolina', 'boa vista', 'uberaba', 'guaruja', 'praia grande', 'sao vicente', 'itapipoca'
];

function isProfaneOrReserved(text) {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (let word of BLOCKED_WORDS) {
    if (normalized.includes(word)) return true;
  }
  return false;
}
"""

c = c.replace('/**\n * Valida', blocked_words_script + '\n/**\n * Valida')

# Add eye toggle logic
eye_logic = """
  // Toggle Eye Password
  const eyeButtons = document.querySelectorAll('.toggle-eye');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'; // Eye-off
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'; // Eye-on
      }
    });
  });

  const senhaInput = document.getElementById('senhaUser');
  const senhaConfirma = document.getElementById('senhaConfirma');"""

c = c.replace("  const senhaInput = document.getElementById('senhaUser');", eye_logic)

# Make both passwords turn green when valid
green_logic = """
      if (v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[^A-Za-z0-9]/.test(v)) {
        senhaInput.classList.add('valid-input');
        senhaInput.classList.remove('has-error');
      } else {
        senhaInput.classList.remove('valid-input');
      }
"""

c = c.replace("else reqSpecial.classList.remove('valid');", "else reqSpecial.classList.remove('valid');" + green_logic)

# E para o Confirmar Senha
confirma_green_logic = """
  if (senhaConfirma) {
    senhaConfirma.addEventListener('input', (e) => {
      const v1 = senhaInput.value;
      const v2 = e.target.value;
      if (v2.length >= 8 && v1 === v2) {
        senhaConfirma.classList.add('valid-input');
        senhaConfirma.classList.remove('has-error');
      } else {
        senhaConfirma.classList.remove('valid-input');
      }
    });
  }
"""

c = c.replace("  form.addEventListener('submit', (e) => {", confirma_green_logic + "\n  form.addEventListener('submit', (e) => {")

# Inserir filtro no form submit
filtro_logic = """
    if (!nameRegex.test(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Nome inválido. Digite Nome e Sobrenome sem utilizar números ou símbolos.');
    }

    if (isProfaneOrReserved(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Por medidas de segurança e respeito, este nome não é permitido.');
    }

    if (!email) {"""

c = c.replace("""    if (!nameRegex.test(nome)) {
      nomeInput.classList.add('has-error');
      return showError('Nome inválido. Digite Nome e Sobrenome sem utilizar números ou símbolos.');
    }

    if (!email) {""", filtro_logic)

filtro_email_logic = """
    if (!isValidEmailForCaju(email)) {
      emailInput.classList.add('has-error');
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook.');
    }

    if (isProfaneOrReserved(email)) {
      emailInput.classList.add('has-error');
      return showError('Por medidas de segurança, este formato de e-mail contém palavras bloqueadas.');
    }

    if (!senha1) {"""

c = c.replace("""    if (!isValidEmailForCaju(email)) {
      emailInput.classList.add('has-error');
      return showError('E-mail não permitido. Utilize contas limpas do Gmail, Hotmail ou Outlook.');
    }

    if (!senha1) {""", filtro_email_logic)

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(c)
