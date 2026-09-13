document.addEventListener('DOMContentLoaded', () => {
  loadNoticias();
});

async function loadNoticias() {
  const container = document.getElementById('newsContainer');
  const emptyState = document.getElementById('newsEmptyState');
  
  if (!container) return;

  try {
    const snapshot = await window.dbNoticias.collection('noticias')
      .orderBy('dataPublicacao', 'desc')
      .get();
      
    const noticias = [];
    snapshot.forEach(doc => {
      noticias.push({ id: doc.id, ...doc.data() });
    });

    if (noticias.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    container.style.display = 'grid'; // Mudado para grid para acomodar as imagens
    container.style.gap = '30px';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    
    container.innerHTML = noticias.map(noticia => {
      const coverHtml = noticia.imagemCapa 
        ? `<div style="width:100%; height:200px; overflow:hidden; border-radius:12px 12px 0 0; margin-bottom: 15px;">
             <img src="${noticia.imagemCapa}" alt="Capa" style="width:100%; height:100%; object-fit:cover;">
           </div>`
        : '';
        
      const date = noticia.dataPublicacao 
        ? noticia.dataPublicacao.toDate().toLocaleDateString('pt-BR') 
        : 'Data desconhecida';

      return `
      <article class="alerta-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        ${coverHtml}
        <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
          <h2 style="margin-top: 0;">${escapeHtml(noticia.titulo)}</h2>
          <div class="alerta-meta" style="margin-bottom: 15px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${date} &bull; Por ${escapeHtml(noticia.autorNome || 'Equipe Caju')}
          </div>
          <p style="flex: 1;">${escapeHtml(noticia.resumo || 'Clique para ler a matéria completa.')}</p>
          <div class="alerta-footer" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <a href="noticia-completa.html?id=${noticia.id}" class="read-more">Ler matéria completa &rarr;</a>
          </div>
        </div>
      </article>
      `;
    }).join('');

  } catch (error) {
    console.error('Erro ao carregar notícias:', error);
    if(emptyState) emptyState.style.display = 'block';
    if(container) container.style.display = 'none';
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
