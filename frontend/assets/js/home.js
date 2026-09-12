
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('heroSearchForm');
  const searchInput = document.getElementById('searchPhoneInput');
  const rotatingText = document.getElementById('heroRotatingText');
  const subtitle = document.getElementById('heroSubtitle');
  const searchModes = [
    { type: 'telefone', phrase: 'um telefone?', placeholder: 'Digite um número com DDD', subtitle: 'Alguém te ligou? Consulte o número e descubra se outras pessoas já registraram possíveis golpes ou spam.' },
    { type: 'e-mail', phrase: 'um e-mail?', placeholder: 'Digite um e-mail suspeito', subtitle: 'Recebeu uma mensagem estranha? Verifique o e-mail antes de responder ou clicar.' },
    { type: 'site', phrase: 'um site de compra?', placeholder: 'Digite um site ou domínio', subtitle: 'Vai comprar em um site novo? Confira se o endereço aparece em relatos de risco.' }
  ];
  let modeIndex = 0;

  if (searchForm && searchInput) {
    let typeTimer;

    function updateMode(index) {
      modeIndex = index;
      searchInput.placeholder = searchModes[index].placeholder;
      if (subtitle) subtitle.textContent = searchModes[index].subtitle;
    }

    function typePhrase(index) {
      if (!rotatingText) return;
      const phrase = searchModes[index].phrase;
      let characterIndex = 0;
      rotatingText.classList.add('is-typing');
      clearInterval(typeTimer);
      typeTimer = setInterval(() => {
        rotatingText.textContent = phrase.slice(0, characterIndex + 1);
        characterIndex += 1;
        if (characterIndex === phrase.length) {
          clearInterval(typeTimer);
          rotatingText.classList.remove('is-typing');
        }
      }, 55);
    }

    function detectSearchType(value) {
      const normalizedValue = value.trim().toLowerCase();
      const phoneDigits = normalizedValue.replace(/\D/g, '');
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
      const isSite = /^(https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(normalizedValue);

      if (isEmail) return { type: 'e-mail', value: normalizedValue };
      if (isSite) return { type: 'site', value: normalizedValue.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') };
      if (/^\d[\d\s().-]*$/.test(normalizedValue) && phoneDigits.length >= 10 && phoneDigits.length <= 11) {
        return { type: 'telefone', value: phoneDigits };
      }
      return null;
    }

    updateMode(0);
    typePhrase(0);
    setInterval(() => {
      if (document.activeElement !== searchInput && !searchInput.value) {
        const nextIndex = (modeIndex + 1) % searchModes.length;
        updateMode(nextIndex);
        typePhrase(nextIndex);
      }
    }, 3000);

    searchInput.addEventListener('input', (e) => {
      const rawValue = e.target.value;
      if (/[A-Za-z@]/.test(rawValue)) {
        e.target.value = rawValue;
        return;
      }

      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
      e.target.value = value.length > 0 ? `(${value.substring(0, 2)}${value.length > 2 ? ') ' : ''}${value.substring(2, 7)}${value.length > 7 ? '-' : ''}${value.substring(7, 11)}` : '';
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = searchInput.value.trim();
      if (!value) return;
      const search = detectSearchType(value);
      if (!search) {
        searchInput.setCustomValidity('Digite um telefone com DDD, um e-mail válido ou um site como exemplo.com.br.');
        searchInput.reportValidity();
        return;
      }
      searchInput.setCustomValidity('');
      window.location.href = `/consulta?tipo=${search.type}&valor=${encodeURIComponent(search.value)}`;
    });
  }
});
