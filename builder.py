import json
import io

challenges = [
    {"text": "O local perfeito para pegar um bronzeado", "targets": ['🏖️', '🏝️', '☀️'], "decoys": ['🏔️', '🏙️', '🌋', '🏕️', '🛤️', '🏭', '🏥', '🏰', '🗽']},
    {"text": "Veículo que possui apenas 2 rodas", "targets": ['🏍️', '🚲', '🛵'], "decoys": ['🚗', '🚌', '🚕', '🚓', '🚑', '🚜', '🚛', '🚂', '🚁']},
    {"text": "Animal que sabe voar", "targets": ['🦅', '🦜', '🦇'], "decoys": ['🐶', '🐱', '🐢', '🐍', '🐘', '🐅', '🦍', '🐊', '🐫']},
    {"text": "Objeto usado para cortar coisas", "targets": ['✂️', '🔪', '🗡️'], "decoys": ['🖊️', '📏', '📎', '📚', '🧲', '🖌️', '🖍️', '📦', '📱']},
    {"text": "Alimento doce que serve como sobremesa", "targets": ['🍫', '🍰', '🍩'], "decoys": ['🥦', '🧅', '🥩', '🥚', '🌶️', '🧀', '🍗', '🥬', '🥕']},
    {"text": "O que você usaria em um dia de muita chuva", "targets": ['☂️', '☔', '🧥'], "decoys": ['🕶️', '🧢', '🧣', '🩳', '🩴', '🎒', '👑', '⌚', '💍']},
    {"text": "Lugar ou objeto onde se guarda dinheiro", "targets": ['🏦', '👛', '🪙'], "decoys": ['🗑️', '🚽', '🛁', '🚪', '🪟', '🪑', '🛏️', '🛋️', '📺']},
    {"text": "Onde você toma banho", "targets": ['🚿', '🛁', '🧼'], "decoys": ['🚗', '💻', '⚽', '🎸', '📱', '📺', '🛏️', '📚', '🌲']},
    {"text": "O que você abre de manhã ao acordar", "targets": ['🚪', '🪟', '👁️'], "decoys": ['📦', '🗑️', '🔪', '🔫', '💣', '🪓', '🧨', '🗡️', '🛡️']},
    {"text": "Onde você joga lixo", "targets": ['🗑️', '🚮', '🗑️'], "decoys": ['🛏️', '🛋️', '🛁', '🚿', '📺', '📻', '📱', '💻', '🖨️']},
    {"text": "Algo que ilumina a noite", "targets": ['💡', '🔦', '🕯️'], "decoys": ['🌑', '📱', '💻', '📺', '🪟', '🚪', '🪑', '🛏️', '🛋️']},
    {"text": "O que você usa para ver as horas", "targets": ['⌚', '⏰', '🕰️'], "decoys": ['📱', '💻', '📺', '📻', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️']},
    {"text": "Animal de estimação comum em casa", "targets": ['🐶', '🐱', '🐹'], "decoys": ['🦁', '🐯', '🐻', '🐘', '🦏', '🦍', '🐅', '🐆', '🦓']},
    {"text": "Algo que fazemos no inverno para esquentar", "targets": ['☕', '🔥', '🧣'], "decoys": ['🍦', '🧊', '🥤', '🍉', '🏖️', '🏝️', '🩳', '🩴', '👕']},
    {"text": "Instrumento musical que tem cordas", "targets": ['🎸', '🎻', '🪕'], "decoys": ['🥁', '🎺', '🎷', '🪈', '🎹', '🎙️', '🎚️', '🎛️', '🎤']},
    {"text": "Algo usado para viajar pelo céu", "targets": ['✈️', '🚁', '🚀'], "decoys": ['🚗', '🚌', '🚕', '🚓', '🚑', '🚜', '🚛', '🚂', '🚲']},
    {"text": "Profissão que cuida da saúde", "targets": ['👩‍⚕️', '👨‍⚕️', '🩺'], "decoys": ['👮', '👷', '👩‍🏫', '👨‍🍳', '👩‍🎤', '👨‍🎨', '👩‍🚀', '👨‍🚒', '👩‍⚖️']},
    {"text": "Comida de fast food", "targets": ['🍔', '🍟', '🍕'], "decoys": ['🥗', '🍎', '🥦', '🥕', '🍉', '🍇', '🍓', '🍈', '🍒']},
    {"text": "Objeto que você usa no rosto para enxergar", "targets": ['👓', '🕶️', '🥽'], "decoys": ['🧢', '👒', '🎓', '👑', '💍', '🧣', '🧤', '🧦', '👟']},
    {"text": "Esporte jogado com bola", "targets": ['⚽', '🏀', '🏐'], "decoys": ['🏊', '🏃', '🚴', '🏋️', '🤸', '🤼', '🧗', '🤺', '🏇']},
    {"text": "Lugar onde as pessoas vão para rezar ou orar", "targets": ['⛪', '🕌', '🕍'], "decoys": ['🏦', '🏥', '🏨', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰']},
    {"text": "Objeto usado para trancar portas", "targets": ['🔒', '🔐', '🔑'], "decoys": ['🔓', '🗡️', '🔫', '💣', '🪓', '🧨', '🛡️', '🚬', '⚰️']},
    {"text": "Inseto que voa e pousa em flores", "targets": ['🦋', '🐝', '🐞'], "decoys": ['🐜', '🕷️', '🦂', '🦟', '🦗', '🐛', '🐌', '🦞', '🦀']},
    {"text": "Bebida que se toma de manhã", "targets": ['☕', '🥛', '🧃'], "decoys": ['🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊']},
    {"text": "Símbolo de amor ou paixão", "targets": ['❤️', '💘', '🌹'], "decoys": ['💔', '🖤', '☠️', '💩', '👽', '👾', '🤖', '🎃', '😈']},
    {"text": "Símbolo de riqueza ou tesouro", "targets": ['💰', '💎', '👑'], "decoys": ['🗑️', '🧾', '📉', '🛒', '📦', '🧹', '🧻', '🚽', '🪠']},
    {"text": "Fruta cítrica e azeda", "targets": ['🍋', '🍊', '🍍'], "decoys": ['🍎', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭']},
    {"text": "Algo que pode causar fogo ou explosão", "targets": ['🔥', '💣', '🧨'], "decoys": ['💧', '🌊', '❄️', '🧊', '⛄', '🌧️', '⛈️', '🌩️', '🌪️']},
    {"text": "Usado para consertar ou construir coisas", "targets": ['🔨', '🔧', '🪛'], "decoys": ['🧸', '🎈', '🪄', '🎁', '🎊', '🎉', '🎎', '🎏', '🎐']},
    {"text": "Usado para escrever ou desenhar", "targets": ['✏️', '✒️', '🖍️'], "decoys": ['✂️', '📏', '📎', '🧲', '🧮', '🗑️', '📦', '📱', '💻']}
]

js_code = f'''// Caju Security - Sistema Anti-Robô Dinâmico (Semântico e Preciso)
const CajuSecurity = {{
  attempts: 0,
  maxAttempts: 3,
  
  challenges: {json.dumps(challenges, ensure_ascii=False)},
  
  init: function() {{
    this.createModal();
    const captchas = document.querySelectorAll('.native-captcha');
    captchas.forEach(container => {{
      const chk = container.querySelector('#captchaCheckbox');
      container.addEventListener('click', (e) => {{
        e.preventDefault(); 
        if (chk && !chk.checked && this.attempts < this.maxAttempts) {{
          this.openModal(chk);
        }} else if (this.attempts >= this.maxAttempts) {{
          alert('Sistema bloqueado por falha de segurança. Atualize a página e preencha novamente.');
        }}
      }});
    }});
  }},

  createModal: function() {{
    const modalHTML = `
      <div id="cajuSecurityModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center; font-family: Roboto, sans-serif;">
        <div style="background:#fff; width:360px; border-radius:8px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.5); animation: cajuPop 0.3s ease;">
          <div style="background:#ff9900; color:#fff; padding:18px;">
            <h3 style="margin:0; font-size:14px; font-weight:normal; opacity:0.9;">Missão de Segurança: Selecione os 3 corretos</h3>
            <h2 id="cajuTargetName" style="margin:8px 0 0 0; font-size:18px; font-weight:bold; line-height:1.3;">...</h2>
          </div>
          <div id="cajuGrid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:12px; background:#f0f2f5;">
            <!-- Grid dinâmico -->
          </div>
          <div style="padding:15px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#666; font-size:12px; font-weight:bold;">Caju Security™</span>
            <button id="cajuVerifyBtn" style="background:#ff9900; color:#fff; border:none; padding:10px 24px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:14px; transition: background 0.2s;">Verificar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes cajuPop {{ 0% {{ transform: scale(0.9); opacity: 0; }} 100% {{ transform: scale(1); opacity: 1; }} }}
      .caju-item {{ aspect-ratio: 1; display:flex; justify-content:center; align-items:center; font-size:45px; cursor:pointer; background:#fff; border: 1px solid #d1d5db; border-radius:4px; transition:all 0.15s; user-select:none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }}
      .caju-item:hover {{ background:#f3f4f6; }}
      .caju-item.selected {{ transform: scale(0.85); box-shadow: 0 0 0 4px #ff9900; background:#fff; border-color:transparent; }}
      .caju-item.selected::after {{ content: '✓'; position:absolute; bottom:2px; right:4px; font-size:16px; color:#ff9900; font-weight:bold; background:#fff; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }}
    `;
    document.head.appendChild(style);

    document.getElementById('cajuVerifyBtn').addEventListener('click', () => this.verify());
  }},

  openModal: function(checkboxElement) {{
    this.currentCheckbox = checkboxElement;
    this.generateChallenge();
    document.getElementById('cajuSecurityModal').style.display = 'flex';
  }},

  closeModal: function() {{
    document.getElementById('cajuSecurityModal').style.display = 'none';
  }},

  generateChallenge: function() {{
    const challenge = this.challenges[Math.floor(Math.random() * this.challenges.length)];
    document.getElementById('cajuTargetName').textContent = challenge.text;
    
    // Sempre exatamente 3 alvos corretos
    let items = [];
    for(let i=0; i<3; i++) {{
      items.push({{ icon: challenge.targets[i], isTarget: true }});
    }}
    
    // 6 decoys
    let tempDecoys = [...challenge.decoys];
    while(items.length < 9) {{
      const idx = Math.floor(Math.random() * tempDecoys.length);
      items.push({{ icon: tempDecoys[idx], isTarget: false }});
      tempDecoys.splice(idx, 1);
    }}
    
    items.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('cajuGrid');
    grid.innerHTML = '';
    items.forEach(item => {{
      const div = document.createElement('div');
      div.className = 'caju-item';
      div.textContent = item.icon;
      div.dataset.type = item.isTarget ? 'target' : 'decoy';
      div.addEventListener('click', function() {{
        this.classList.toggle('selected');
      }});
      grid.appendChild(div);
    }});
  }},

  verify: function() {{
    const btn = document.getElementById('cajuVerifyBtn');
    if (btn.disabled) return;
    
    btn.disabled = true;
    const oldText = btn.textContent;
    const oldBg = btn.style.background;
    btn.textContent = 'Processando...';
    btn.style.background = '#6b7280'; 

    setTimeout(() => {{
      const items = document.querySelectorAll('.caju-item');
      let passed = true;
      let selectedTargetCount = 0;
      let selectedTotalCount = 0;

      items.forEach(item => {{
        const isSelected = item.classList.contains('selected');
        const isTarget = item.dataset.type === 'target';
        
        if (isSelected) selectedTotalCount++;
        if (isSelected && !isTarget) passed = false; 
        if (isSelected && isTarget) selectedTargetCount++;
      }});

      // Só aprova se selecionou EXATAMENTE os 3 corretos e nenhum errado
      if (passed && selectedTargetCount === 3 && selectedTotalCount === 3) {{
        this.closeModal();
        this.currentCheckbox.checked = true;
        
        btn.disabled = false;
        btn.textContent = oldText;
        btn.style.background = oldBg;
      }} else {{
        this.attempts++;
        btn.style.background = '#ef4444'; 
        
        if (this.attempts >= this.maxAttempts) {{
          btn.textContent = 'Acesso Bloqueado!';
          setTimeout(() => {{
            this.closeModal();
            alert('Falha de segurança. Robô detectado (Muitas tentativas erradas). Atualize a página e preencha tudo novamente.');
            document.body.innerHTML = '<h1 style="text-align:center; margin-top:20%; font-family:sans-serif; color:#ef4444;">Acesso Bloqueado.<br>Atualize a página.</h1>';
          }}, 1500);
        }} else {{
          const tentativasRestantes = this.maxAttempts - this.attempts;
          btn.textContent = 'Incorreto! Restam ' + tentativasRestantes;
          setTimeout(() => {{
            btn.disabled = false;
            btn.style.background = '#ff9900';
            btn.textContent = 'Verificar';
            this.generateChallenge();
          }}, 2000);
        }}
      }}
    }}, 1200);
  }}
}};

document.addEventListener('DOMContentLoaded', () => {{
  CajuSecurity.init();
}});
'''

with io.open('frontend/assets/js/caju-security.js', 'w', encoding='utf-8') as f:
    f.write(js_code)
