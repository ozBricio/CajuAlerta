
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
      const isPhone = /^[\d\s().-]+$/.test(normalizedValue) && phoneDigits.length >= 10 && phoneDigits.length <= 11;

      if (isEmail) return { type: 'e-mail', value: normalizedValue };
      if (isPhone) return { type: 'telefone', value: phoneDigits };
      
      if (normalizedValue.includes('.') && !/\s/.test(normalizedValue)) {
        return { type: 'site', value: normalizedValue.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') };
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
      let formatted = value;
      if (value.length > 2) {
        if (value.length < 11) {
          formatted = `(${value.substring(0, 2)}) ${value.substring(2, 6)}${value.length > 6 ? '-' + value.substring(6) : ''}`;
        } else {
          formatted = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
        }
      } else if (value.length > 0) {
        formatted = `(${value}`;
      }
      e.target.value = formatted;
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = searchInput.value.trim();
      if (!value) return;
      
      const search = detectSearchType(value);
      
      if (!search) {
        let errorMsg = 'Digite um telefone com DDD, um e-mail válido ou um site válido.';
        
        // Smart Error Detection (UX)
        if (/^[\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length > 2) {
          errorMsg = 'Telefone incompleto. Certifique-se de digitar o DDD e o número correto (10 a 11 dígitos).';
        } else if (value.includes('@')) {
          errorMsg = 'Formato de e-mail inválido. Verifique se há erros de digitação.';
        } else if (value.includes('.') && !/\s/.test(value)) {
          errorMsg = 'Site inválido. Verifique se digitou o endereço corretamente (ex: loja.com.br).';
        }
        
        searchInput.setCustomValidity(errorMsg);
        searchInput.reportValidity();
        return;
      }
      
      searchInput.setCustomValidity('');
      window.location.href = `/consulta?tipo=${search.type}&valor=${encodeURIComponent(search.value)}`;
    });
  }
});
