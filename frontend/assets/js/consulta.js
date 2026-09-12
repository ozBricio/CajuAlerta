
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById('searchInputSecondary');
  const valueParam = urlParams.get('valor') || urlParams.get('numero');
  const typeParam = urlParams.get('tipo') || 'telefone';

  if (valueParam) {
    if (searchInput) searchInput.value = typeParam === 'e-mail' ? valueParam : formatPhoneNumber(valueParam);
    performSearch(valueParam, typeParam);
  }

  const form = document.getElementById('secondarySearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const search = classifySearch(searchInput.value);
      if (!search) {
        searchInput.setCustomValidity('Digite um telefone com DDD, um e-mail válido ou um site como exemplo.com.br.');
        searchInput.reportValidity();
        return;
      }
      searchInput.setCustomValidity('');
      window.history.pushState({}, '', `?tipo=${search.type}&valor=${encodeURIComponent(search.value)}`);
      performSearch(search.value, search.type);
    });

    searchInput.addEventListener('input', (e) => {
      if (e.target.value.includes('@')) return;
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      e.target.value = formatPhoneNumber(value);
    });
  }
});

function classifySearch(value) {
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

function formatPhoneNumber(value) {
  let formatted = '';
  if (value.length > 0) formatted = '(' + value.substring(0, 2);
  if (value.length > 2) formatted += ') ' + value.substring(2, 7);
  if (value.length > 7) formatted += '-' + value.substring(7, 11);
  return formatted;
}

function formatDisplayMasked(num) {
  if(num.length === 11) {
    return `(${num.substring(0,2)}) 9****-**${num.substring(9,11)}`;
  }
  return num;
}

async function performSearch(value, type = 'telefone') {
  const loading = document.getElementById('loadingState');
  const card = document.getElementById('resultCard');
  const errorState = document.getElementById('errorState');
  const errorMessage = document.getElementById('errorMessage');

  card.style.display = 'none';
  errorState.style.display = 'none';
  loading.style.display = 'flex';

  try {
    const response = await fetch(window.apiUrl(`/api/consulta?tipo=${encodeURIComponent(type)}&valor=${encodeURIComponent(value)}`));
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Não foi possível consultar o banco de dados.');
    loading.style.display = 'none';
    renderResult(value, type, result);
  } catch (error) {
    loading.style.display = 'none';
    errorMessage.textContent = error.message;
    errorState.style.display = 'block';
  }
}

function renderResult(value, type, result) {
  const card = document.getElementById('resultCard');
  const btnDenounce = document.getElementById('btnDenounceFromQuery');
  const banner = document.getElementById('statusBanner');
  const statusText = document.getElementById('statusText');
  const reportCount = document.getElementById('reportCount');
  const lastReport = document.getElementById('lastReport');
  const categories = document.getElementById('categories');

  card.style.display = 'block';
  const labels = { telefone: 'Número consultado', 'e-mail': 'E-mail consultado', site: 'Site consultado' };
  document.getElementById('resultLabel').textContent = labels[type] || 'Consulta realizada';
  document.getElementById('displayNumber').textContent = type === 'telefone' ? formatDisplayMasked(value) : value;
  banner.className = 'status-banner';
  btnDenounce.href = `registrar.html?numero=${encodeURIComponent(value)}`;
  reportCount.textContent = String(result.quantidade);
  lastReport.textContent = result.ultimoRegistro ? new Date(result.ultimoRegistro).toLocaleDateString('pt-BR') : '--';
  categories.textContent = result.categorias.length ? result.categorias.join(', ') : '--';

  if (result.quantidade === 0) {
    banner.classList.add('safe');
    statusText.textContent = 'Nenhum registro encontrado';
    document.getElementById('alertLevel').textContent = 'Baixo';
    document.getElementById('reportSummaryText').textContent = `Não há relatos registrados para este ${type === 'e-mail' ? 'e-mail' : type === 'site' ? 'site' : 'número'}.`;
  } else {
    banner.classList.add(result.quantidade >= 5 ? 'danger' : 'warning');
    statusText.textContent = result.quantidade >= 5 ? 'Muitos relatos encontrados' : 'Relatos encontrados';
    document.getElementById('alertLevel').textContent = result.quantidade >= 5 ? 'Alto (Vermelho)' : 'Médio (Amarelo)';
    document.getElementById('reportSummaryText').textContent = result.relatos[0] || `Há ${result.quantidade} relato(s) registrado(s) para esta consulta.`;
  }
}
