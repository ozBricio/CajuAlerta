document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const valueParam = urlParams.get('valor') || urlParams.get('numero');
  const typeParam = urlParams.get('tipo') || 'telefone';

  if (!valueParam) {
    // Acesso direto negado, redireciona para a home
    window.location.replace('/');
    return;
  }

  performSearch(valueParam, typeParam);
});

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

  card.classList.add('d-none');
  errorState.classList.add('d-none');
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
    errorState.classList.remove('d-none');
  }
}

function renderResult(value, type, result) {
  const card = document.getElementById('resultCard');
  const btnRegister = document.getElementById('btnRegisterFromQuery');
  const banner = document.getElementById('statusBanner');
  const statusText = document.getElementById('statusText');
  const reportCount = document.getElementById('reportCount');
  const lastReport = document.getElementById('lastReport');
  const categories = document.getElementById('categories');

  card.classList.remove('d-none');
  const labels = { telefone: 'Número consultado', 'e-mail': 'E-mail consultado', site: 'Site consultado' };
  document.getElementById('resultLabel').textContent = labels[type] || 'Consulta realizada';
  document.getElementById('displayNumber').textContent = type === 'telefone' ? formatDisplayMasked(value) : value;
  banner.className = 'status-banner';
  btnRegister.href = `registrar.html?numero=${encodeURIComponent(value)}`;
  reportCount.textContent = String(result.quantidade);
  lastReport.textContent = result.ultimoRegistro ? new Date(result.ultimoRegistro).toLocaleDateString('pt-BR') : '--';
  categories.textContent = result.categorias.length ? result.categorias.join(', ') : '--';

  if (result.quantidade === 0) {
    banner.classList.add('safe');
    statusText.textContent = 'Este número está limpo';
    document.getElementById('alertLevel').textContent = 'Baixo';
    document.getElementById('reportSummaryText').textContent = `Este ${type === 'e-mail' ? 'e-mail' : type === 'site' ? 'site' : 'telefone'} está limpo. Ele não tem nenhum registro de golpista.`;
  } else {
    banner.classList.add(result.quantidade >= 5 ? 'danger' : 'warning');
    statusText.textContent = result.quantidade >= 5 ? 'Muitos relatos encontrados' : 'Relatos encontrados';
    document.getElementById('alertLevel').textContent = result.quantidade >= 5 ? 'Alto (Vermelho)' : 'Médio (Amarelo)';
    document.getElementById('reportSummaryText').textContent = result.relatos[0] || `Há ${result.quantidade} relato(s) registrado(s) para esta consulta.`;
  }
}