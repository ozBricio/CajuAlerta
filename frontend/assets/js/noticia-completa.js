document.addEventListener('DOMContentLoaded', () => {
  loadFullArticle();
});

async function loadFullArticle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('articleTitle').textContent = 'Notícia não encontrada';
    document.getElementById('articleContent').innerHTML = '<p>A matéria que você tentou acessar não existe ou foi removida.</p>';
    document.getElementById('articleBadge').style.display = 'none';
    return;
  }

  try {
    // Simulação do backend Firebase - Buscando pelo ID
    const response = await fetch(window.apiUrl('/api/noticias'));
    if (!response.ok) throw new Error('Falha na API');
    
    const data = await response.json();
    const noticia = (data.noticias || []).find(n => n.id == id) || data.noticias[0]; // fallback

    if (!noticia) throw new Error('Notícia não encontrada no banco.');

    document.getElementById('articleBadge').textContent = noticia.badge || 'INFORMAÇÃO';
    document.getElementById('articleBadge').className = `alerta-badge ${noticia.badge === 'CRÍTICO' ? 'critical' : 'warning'}`;
    document.getElementById('articleBadge').classList.remove('loading');
    
    document.getElementById('articleTitle').textContent = noticia.titulo;
    document.getElementById('articleDate').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Publicado em ${new Date(noticia.created_at).toLocaleDateString('pt-BR')}`;
    
    // Tratamento simples para quebras de linha virarem parágrafos
    const paragraphs = (noticia.conteudo || '').split('\n').filter(p => p.trim() !== '');
    document.getElementById('articleContent').innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');

  } catch (error) {
    document.getElementById('articleTitle').textContent = 'Erro ao carregar a matéria';
    document.getElementById('articleContent').innerHTML = '<p>Houve um erro de conexão ao tentar buscar o texto. Tente novamente mais tarde.</p>';
    document.getElementById('articleBadge').style.display = 'none';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
