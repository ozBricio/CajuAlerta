document.addEventListener('DOMContentLoaded', () => {
  loadNoticias();
});

async function loadNoticias() {
  const container = document.getElementById('newsContainer');
  const emptyState = document.getElementById('newsEmptyState');
  
  if (!container) return;

  try {
    const response = await fetch(window.apiUrl('/api/noticias'));
    if (!response.ok) throw new Error('Falha ao carregar');
    
    const data = await response.json();
    const noticias = data.noticias || [];

    if (noticias.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    container.style.display = 'flex';
    
    container.innerHTML = noticias.map(noticia => `
      <article class="alerta-card">
        <span class="alerta-badge ${noticia.badge === 'CRÍTICO' ? 'critical' : 'warning'}">${escapeHtml(noticia.badge || 'INFORMAÇÃO')}</span>
        <h2>${escapeHtml(noticia.titulo)}</h2>
        <div class="alerta-meta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          ${new Date(noticia.created_at).toLocaleDateString('pt-BR')}
        </div>
        <p>${escapeHtml(noticia.resumo || noticia.conteudo.substring(0, 150) + '...')}</p>
        <div class="alerta-footer">
          <a href="/noticia-completa?id=${noticia.id || '1'}" class="read-more">Ler matéria completa &rarr;</a>
        </div>
      </article>
    `).join('');

  } catch (error) {
    console.error(error);
    emptyState.style.display = 'block';
    container.style.display = 'none';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
