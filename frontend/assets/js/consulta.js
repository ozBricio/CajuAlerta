document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const valueParam = urlParams.get('valor') || urlParams.get('numero');
  const typeParam = urlParams.get('tipo') || 'telefone';

  if (!valueParam) {
    window.location.replace('/');
    return;
  }

  performSearch(valueParam, typeParam);
});

function formatDisplayMasked(num) {
  let v = num.replace(/\D/g, '');
  if (v.length === 11) {
    return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7, 11)}`;
  } else if (v.length === 10) {
    return `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6, 10)}`;
  } else if (v.length > 2) {
    return `(${v.substring(0, 2)}) ${v.substring(2)}`;
  }
  return v;
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
    let colName = 'denuncias_telefones';
    if (type === 'email' || type === 'e-mail') colName = 'denuncias_emails';
    if (type === 'site') colName = 'denuncias_sites';

    const db = firebase.firestore();
    
    let buscaAlvo = value;
    if (colName === 'denuncias_telefones') {
      buscaAlvo = value.replace(/\D/g, '');
      if (buscaAlvo.length > 11) buscaAlvo = buscaAlvo.substring(0, 11);
    }
    
    let querySnapshot = await db.collection(colName)
      .where('status', '==', 'ativa')
      .get();
      
    let docs = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      let alvoDb = data.alvo || '';
      if (colName === 'denuncias_telefones') {
         if (alvoDb.replace(/\D/g, '') === buscaAlvo.replace(/\D/g, '')) {
            docs.push(data);
         }
      } else {
         if (alvoDb.toLowerCase() === buscaAlvo.toLowerCase()) {
            docs.push(data);
         }
      }
    });

    docs.sort((a, b) => {
      let t1 = a.dataDenuncia ? a.dataDenuncia.toDate().getTime() : 0;
      let t2 = b.dataDenuncia ? b.dataDenuncia.toDate().getTime() : 0;
      return t2 - t1;
    });

    const quantidade = docs.length;
    const ultimoRegistro = docs.length > 0 && docs[0].dataDenuncia ? docs[0].dataDenuncia.toDate().toISOString() : null;
    
    const relatos = docs.length > 0 ? [docs[0].motivo] : [];

    const result = {
      quantidade,
      ultimoRegistro,
      relatos
    };

    loading.style.display = 'none';
    renderResult(value, type, result);
  } catch (error) {
    loading.style.display = 'none';
    errorMessage.textContent = 'Erro de comunicação com o banco de dados seguro: ' + error.message;
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

  card.classList.remove('d-none');
  const labels = { telefone: 'Número consultado', 'e-mail': 'E-mail consultado', site: 'Site consultado' };
  document.getElementById('resultLabel').textContent = labels[type] || 'Consulta realizada';
  document.getElementById('displayNumber').textContent = type === 'telefone' ? formatDisplayMasked(value) : value;
  banner.className = 'status-banner';
  btnRegister.href = `perfil.html`;
  reportCount.textContent = String(result.quantidade);
  lastReport.textContent = result.ultimoRegistro ? new Date(result.ultimoRegistro).toLocaleDateString('pt-BR') : '--';

  if (result.quantidade === 0) {
    banner.classList.add('safe');
    statusText.textContent = type === 'e-mail' ? 'Este e-mail não tem registro' : type === 'site' ? 'Este site não tem registro' : 'Este número não tem registro';
    document.getElementById('alertLevel').textContent = 'Baixo';
    document.getElementById('reportSummaryText').textContent = `Este ${type === 'e-mail' ? 'e-mail' : type === 'site' ? 'site' : 'telefone'} está limpo. Não há registros de golpes na base pública.`;
  } else {
    banner.classList.add(result.quantidade >= 5 ? 'danger' : 'warning');
    statusText.textContent = result.quantidade >= 5 ? 'Muitos relatos de golpe!' : 'Relatos encontrados';
    document.getElementById('alertLevel').textContent = result.quantidade >= 5 ? 'Alto (Vermelho)' : 'Médio (Amarelo)';
    document.getElementById('reportSummaryText').textContent = result.relatos[0] || `Há ${result.quantidade} relato(s) registrado(s) para esta consulta.`;
  }
}
