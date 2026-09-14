document.addEventListener('DOMContentLoaded', () => {
  let allNews = [];
  loadNoticias();

  document.getElementById('btnNewsSearch').addEventListener('click', () => {
    const term = document.getElementById('newsSearchInput').value.toLowerCase();
    filterNews(term);
  });

  document.getElementById('newsSearchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const term = e.target.value.toLowerCase();
      filterNews(term);
    }
  });

  async function loadNoticias() {
    const container = document.getElementById('newsContainer');
    const emptyState = document.getElementById('newsEmptyState');
    
    if (!container) return;

    try {
      const snapshot = await window.dbNoticias.collection('noticias')
        .orderBy('dataPublicacao', 'desc')
        .get();
        
      allNews = [];
      snapshot.forEach(doc => {
        allNews.push({ id: doc.id, ...doc.data() });
      });

      renderNews(allNews);

    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      if(emptyState) emptyState.style.display = 'block';
      if(container) container.style.display = 'none';
    }
  }

  function filterNews(term) {
    if (!term) {
      renderNews(allNews);
      return;
    }
    const filtered = allNews.filter(n => 
      (n.titulo || '').toLowerCase().includes(term) || 
      (n.resumo || '').toLowerCase().includes(term) ||
      (n.conteudo || '').toLowerCase().includes(term)
    );
    renderNews(filtered);
  }

  function renderNews(noticias) {
    const container = document.getElementById('newsContainer');
    const emptyState = document.getElementById('newsEmptyState');

    if (noticias.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    container.style.display = 'grid';
    
    container.innerHTML = noticias.map(noticia => {
      let coverImg = '';
      if (noticia.imagens && noticia.imagens.length > 0) {
        coverImg = noticia.imagens[0];
      } else if (noticia.imagemCapa) { // legacy support
        coverImg = noticia.imagemCapa;
      }

      const coverHtml = coverImg 
        ? `<div style="width:100%; height:200px; overflow:hidden; border-radius:12px 12px 0 0; margin-bottom: 15px;">
             <img src="${coverImg}" alt="Capa" style="width:100%; height:100%; object-fit:cover;">
           </div>`
        : '';
        
      const date = noticia.dataPublicacao 
        ? noticia.dataPublicacao.toDate().toLocaleDateString('pt-BR') 
        : 'Data desconhecida';

      const badgeHtml = noticia.fonteOficial 
        ? `<div style="background:#fff3e0; color:#ff9900; font-size:0.75rem; font-weight:bold; padding:4px 10px; border-radius:12px; display:inline-block; margin-bottom:10px;">Investigação Oficial</div>`
        : `<div style="background:#f3f4f6; color:#4b5563; font-size:0.75rem; font-weight:bold; padding:4px 10px; border-radius:12px; display:inline-block; margin-bottom:10px;">📰 Fonte: ${escapeHtml(noticia.fonte || 'Externa')}</div>`;

      return `
      <article class="alerta-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        ${coverHtml}
        <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
          ${badgeHtml}
          <h2 style="margin-top: 0; font-size: 1.3rem;">${escapeHtml(noticia.titulo)}</h2>
          <div class="alerta-meta" style="margin-bottom: 15px; font-size: 0.85rem;">
            ${date} &bull; Por ${escapeHtml(noticia.autorNome || 'Equipe Caju')}
          </div>
          <p style="flex: 1; font-size: 0.95rem;">${escapeHtml(noticia.resumo || 'Clique para ler a matéria completa.')}</p>
          <div class="alerta-footer" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <a href="noticia-completa.html?id=${noticia.id}" class="read-more">Ler matéria completa &rarr;</a>
          </div>
        </div>
      </article>
      `;
    }).join('');
  }

  function escapeHtml(value) {
    if (!value) return '';
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
});
