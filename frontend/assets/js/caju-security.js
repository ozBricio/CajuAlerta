// Caju Security - Sistema Anti-Robô Dinâmico e Descentralizado
const CajuSecurity = {
  challenges: [
    { target: '🦊', name: 'Raposa', decoys: ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯'] },
    { target: '🍎', name: 'Maçã Vermelha', decoys: ['🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈'] },
    { target: '🚗', name: 'Carro', decoys: ['🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐'] },
    { target: '⚽', name: 'Bola de Futebol', decoys: ['🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀'] },
    { target: '🍔', name: 'Hambúrguer', decoys: ['🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚'] },
    { target: '⌚', name: 'Relógio', decoys: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️'] }
  ],
  
  init: function() {
    this.createModal();
    const checkboxes = document.querySelectorAll('#captchaCheckbox');
    checkboxes.forEach(chk => {
      chk.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o check direto
        if (!chk.checked) this.openModal(chk);
      });
    });
  },

  createModal: function() {
    const modalHTML = `
      <div id="cajuSecurityModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center; font-family: Roboto, sans-serif;">
        <div style="background:#fff; width:340px; border-radius:8px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.2); animation: cajuPop 0.3s ease;">
          <div style="background:#10b981; color:#fff; padding:15px;">
            <h3 style="margin:0; font-size:16px; font-weight:normal;">Selecione todos os quadrados com:</h3>
            <h2 id="cajuTargetName" style="margin:5px 0 0 0; font-size:24px; font-weight:bold;">Raposa</h2>
          </div>
          <div id="cajuGrid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; padding:10px; background:#fff;">
            <!-- Grid dinâmico -->
          </div>
          <div style="padding:15px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#666; font-size:12px;">Caju Security™</span>
            <button id="cajuVerifyBtn" style="background:#10b981; color:#fff; border:none; padding:8px 20px; border-radius:4px; font-weight:bold; cursor:pointer;">Verificar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes cajuPop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .caju-item { aspect-ratio: 1; display:flex; justify-content:center; align-items:center; font-size:40px; cursor:pointer; background:#f0f0f0; transition:all 0.2s; user-select:none; }
      .caju-item:hover { background:#e0e0e0; }
      .caju-item.selected { transform: scale(0.85); box-shadow: inset 0 0 0 4px #10b981; background:#fff; }
    `;
    document.head.appendChild(style);

    document.getElementById('cajuVerifyBtn').addEventListener('click', () => this.verify());
    document.getElementById('cajuSecurityModal').addEventListener('click', (e) => {
      if(e.target.id === 'cajuSecurityModal') this.closeModal();
    });
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
    document.getElementById('cajuTargetName').textContent = challenge.name;
    this.currentTarget = challenge.target;
    
    // Preparar 9 itens (aleatório de 2 a 4 targets, o resto decoys)
    const numTargets = Math.floor(Math.random() * 3) + 2; 
    let items = [];
    for(let i=0; i<numTargets; i++) items.push(challenge.target);
    
    // Preencher com decoys aleatórios
    let tempDecoys = [...challenge.decoys];
    while(items.length < 9) {
      const idx = Math.floor(Math.random() * tempDecoys.length);
      items.push(tempDecoys[idx]);
    }
    
    // Embaralhar
    items.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('cajuGrid');
    grid.innerHTML = '';
    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'caju-item';
      div.textContent = item;
      div.dataset.type = (item === challenge.target) ? 'target' : 'decoy';
      div.addEventListener('click', function() {
        this.classList.toggle('selected');
      });
      grid.appendChild(div);
    });
  },

  verify: function() {
    const items = document.querySelectorAll('.caju-item');
    let passed = true;
    let targetCount = 0;
    let selectedTargetCount = 0;

    items.forEach(item => {
      const isSelected = item.classList.contains('selected');
      const isTarget = item.dataset.type === 'target';
      if (isTarget) targetCount++;
      if (isSelected && !isTarget) passed = false; // Selecionou errado
      if (isSelected && isTarget) selectedTargetCount++;
    });

    if (passed && selectedTargetCount === targetCount) {
      // Sucesso
      this.closeModal();
      this.currentCheckbox.checked = true;
      // Dispara evento manual para atualizar css visual (o pseudo class checked fará o resto)
    } else {
      // Falha - Gerar novo desafio visualmente
      const btn = document.getElementById('cajuVerifyBtn');
      btn.style.background = '#ef4444';
      btn.textContent = 'Incorreto!';
      setTimeout(() => {
        btn.style.background = '#10b981';
        btn.textContent = 'Verificar';
        this.generateChallenge();
      }, 1000);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CajuSecurity.init();
});
