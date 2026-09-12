// Caju Security - Sistema Anti-Robô Dinâmico (Semântico)
const CajuSecurity = {
  attempts: 0,
  maxAttempts: 3,
  
  challenges: [
    { text: 'O local perfeito para pegar um bronzeado', targets: ['🏖️', '🏝️'], decoys: ['🏔️', '🏙️', '🌋', '🏕️', '🛤️', '🏭', '🏥'] },
    { text: 'Veículo que possui apenas 2 rodas', targets: ['🏍️', '🚲', '🛵'], decoys: ['🚗', '🚌', '🚕', '🚓', '🚑', '🚜', '🚛'] },
    { text: 'Animal que sabe voar', targets: ['🦅', '🦜', '🦇'], decoys: ['🐶', '🐱', '🐢', '🐍', '🐘', '🐅', '🦍'] },
    { text: 'Objeto usado para cortar papel', targets: ['✂️'], decoys: ['🖊️', '📏', '📎', '📚', '🧲', '🖌️', '🖍️'] },
    { text: 'Alimento que é doce', targets: ['🍫', '🍰', '🍩', '🍦'], decoys: ['🥦', '🧅', '🥩', '🥚', '🌶️', '🧀', '🍗'] },
    { text: 'Algo que você usaria em um dia de muita chuva', targets: ['☂️', '☔'], decoys: ['🕶️', '🧢', '🧣', '🩳', '🩴', '🎒', '👑'] },
    { text: 'Onde você guardaria seu dinheiro', targets: ['🏦', '👛', '🪙'], decoys: ['🗑️', '🚽', '🛁', '🚪', '🪟', '🪑', '🛏️'] }
  ],
  
  init: function() {
    this.createModal();
    const captchas = document.querySelectorAll('.native-captcha');
    captchas.forEach(container => {
      const chk = container.querySelector('#captchaCheckbox');
      container.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (chk && !chk.checked && this.attempts < this.maxAttempts) {
          this.openModal(chk);
        } else if (this.attempts >= this.maxAttempts) {
          alert('Sistema bloqueado por falha de segurança. Atualize a página e preencha novamente.');
        }
      });
    });
  },

  createModal: function() {
    const modalHTML = `
      <div id="cajuSecurityModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; font-family: Roboto, sans-serif;">
        <div style="background:#fff; width:360px; border-radius:8px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.3); animation: cajuPop 0.3s ease;">
          <div style="background:#10b981; color:#fff; padding:18px;">
            <h3 style="margin:0; font-size:14px; font-weight:normal; opacity:0.9;">Missão de Segurança: Selecione</h3>
            <h2 id="cajuTargetName" style="margin:8px 0 0 0; font-size:20px; font-weight:bold; line-height:1.2;">...</h2>
          </div>
          <div id="cajuGrid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:3px; padding:12px; background:#f9f9f9;">
            <!-- Grid dinâmico -->
          </div>
          <div style="padding:15px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#666; font-size:12px; font-weight:bold;">Caju Security™</span>
            <button id="cajuVerifyBtn" style="background:#10b981; color:#fff; border:none; padding:10px 24px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:14px; transition: background 0.2s;">Verificar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes cajuPop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .caju-item { aspect-ratio: 1; display:flex; justify-content:center; align-items:center; font-size:45px; cursor:pointer; background:#fff; border: 1px solid #e5e7eb; border-radius:4px; transition:all 0.15s; user-select:none; }
      .caju-item:hover { background:#f3f4f6; }
      .caju-item.selected { transform: scale(0.85); box-shadow: 0 0 0 4px #10b981; background:#fff; border-color:transparent;}
      .caju-item.selected::after { content: '✓'; position:absolute; bottom:2px; right:4px; font-size:16px; color:#10b981; font-weight:bold; }
    `;
    document.head.appendChild(style);

    document.getElementById('cajuVerifyBtn').addEventListener('click', () => this.verify());
  },

  openModal: function(checkboxElement) {
    this.currentCheckbox = checkboxElement;
    this.generateChallenge();
    document.getElementById('cajuSecurityModal').style.display = 'flex';
  },

  closeModal: function() {
    document.getElementById('cajuSecurityModal').style.display = 'none';
  },

  generateChallenge: function() {
    const challenge = this.challenges[Math.floor(Math.random() * this.challenges.length)];
    document.getElementById('cajuTargetName').textContent = challenge.text;
    
    // Entre 1 e 3 alvos exatos (nunca mais que 3)
    const numTargets = Math.floor(Math.random() * 3) + 1; 
    let items = [];
    
    for(let i=0; i<numTargets; i++) {
      items.push({ icon: challenge.targets[Math.floor(Math.random() * challenge.targets.length)], isTarget: true });
    }
    
    let tempDecoys = [...challenge.decoys];
    while(items.length < 9) {
      const idx = Math.floor(Math.random() * tempDecoys.length);
      items.push({ icon: tempDecoys[idx], isTarget: false });
      tempDecoys.splice(idx, 1); // Evita decoys repetidos para não confundir
    }
    
    items.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('cajuGrid');
    grid.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'caju-item';
      div.textContent = item.icon;
      div.dataset.type = item.isTarget ? 'target' : 'decoy';
      div.addEventListener('click', function() {
        this.classList.toggle('selected');
      });
      grid.appendChild(div);
    });
  },

  verify: function() {
    const btn = document.getElementById('cajuVerifyBtn');
    if (btn.disabled) return;
    
    // Simula carregamento de IA
    btn.disabled = true;
    const oldText = btn.textContent;
    const oldBg = btn.style.background;
    btn.textContent = 'Processando...';
    btn.style.background = '#6b7280'; // Cinza enquanto processa

    setTimeout(() => {
      const items = document.querySelectorAll('.caju-item');
      let passed = true;
      let targetCount = 0;
      let selectedTargetCount = 0;

      items.forEach(item => {
        const isSelected = item.classList.contains('selected');
        const isTarget = item.dataset.type === 'target';
        if (isTarget) targetCount++;
        if (isSelected && !isTarget) passed = false; 
        if (isSelected && isTarget) selectedTargetCount++;
      });

      if (passed && selectedTargetCount === targetCount && selectedTargetCount > 0) {
        // Sucesso Total
        this.closeModal();
        this.currentCheckbox.checked = true;
        // Se houver algum input no DOM com id cajuToken, preenche para segurança extra
        const tokenInput = document.getElementById('cajuToken');
        if(tokenInput) tokenInput.value = btoa(Date.now().toString());
        
        btn.disabled = false;
        btn.textContent = oldText;
        btn.style.background = oldBg;
      } else {
        // Falha
        this.attempts++;
        btn.style.background = '#ef4444'; // Vermelho
        
        if (this.attempts >= this.maxAttempts) {
          btn.textContent = 'Acesso Bloqueado!';
          setTimeout(() => {
            this.closeModal();
            alert('Falha de segurança crítica (Muitas tentativas erradas). Atualize a página e preencha tudo novamente.');
            // Destroi a página
            document.body.innerHTML = '<h1 style="text-align:center; margin-top:20%; font-family:sans-serif;">Acesso Bloqueado. Atualize a página.</h1>';
          }, 1500);
        } else {
          const tentativaText = this.attempts === 1 ? '2ª Tentativa' : '3ª Tentativa (Última)';
          btn.textContent = 'Erro! ' + tentativaText;
          setTimeout(() => {
            btn.disabled = false;
            btn.style.background = '#10b981';
            btn.textContent = 'Verificar';
            this.generateChallenge();
          }, 2000);
        }
      }
    }, 1200); // 1.2 segundos de atraso analítico
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CajuSecurity.init();
});
