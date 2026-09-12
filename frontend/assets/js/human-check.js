(() => {
  const symbols = ['▲', '●', '◆', '■', '✦', '✚'];

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function initHumanCheck() {
    document.querySelectorAll('[data-human-check]').forEach((check) => {
      const target = check.querySelector('[data-human-target]');
      const grid = check.querySelector('[data-human-grid]');
      const status = check.querySelector('[data-human-status]');
      const hiddenInput = check.querySelector('[data-human-value]');
      let expected = '';
      let selected = [];

      const reset = () => {
        expected = symbols[Math.floor(Math.random() * symbols.length)];
        selected = [];
        target.textContent = expected;
        hiddenInput.value = 'false';
        status.textContent = 'Selecione os três símbolos iguais.';
        status.className = 'human-check-status';
        grid.replaceChildren();

        const tiles = shuffle([expected, expected, expected, ...symbols.filter((symbol) => symbol !== expected).slice(0, 6)]);
        tiles.forEach((symbol, index) => {
          const tile = document.createElement('button');
          tile.type = 'button';
          tile.className = 'human-check-tile';
          tile.textContent = symbol;
          tile.setAttribute('aria-label', `Símbolo ${index + 1}`);
          tile.addEventListener('click', () => {
            if (hiddenInput.value === 'true' || tile.disabled) return;
            tile.classList.add('selected');
            tile.disabled = true;
            selected.push(symbol);

            if (symbol !== expected || selected.length === 3 && selected.some((item) => item !== expected)) {
              status.textContent = 'Resposta incorreta. Tente outra combinação.';
              status.className = 'human-check-status is-error';
              setTimeout(reset, 650);
              return;
            }

            if (selected.length === 3) {
              hiddenInput.value = 'true';
              status.textContent = 'Verificação concluída.';
              status.className = 'human-check-status is-success';
              grid.querySelectorAll('button').forEach((button) => { button.disabled = true; });
            }
          });
          grid.appendChild(tile);
        });
      };

      reset();
    });
  }

  window.initHumanCheck = initHumanCheck;
  document.addEventListener('DOMContentLoaded', initHumanCheck);
})();
