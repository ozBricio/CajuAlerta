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
      const now = firebase.firestore.Timestamp.now();
      const snapshot = await window.dbNoticias.collection('noticias')
        .where('dataPublicacao', '<=', now)
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
        ? `<div class="news-card-cover">
             <img src="${coverImg}" alt="Capa" class="news-card-img">
           </div>`
        : '';
        
      const date = noticia.dataPublicacao 
        ? noticia.dataPublicacao.toDate().toLocaleDateString('pt-BR') 
        : 'Data desconhecida';

      const badgeHtml = noticia.fonteOficial 
        ? `<div class="news-badge badge-official">Investigação Oficial</div>`
        : `<div class="news-badge badge-external">📰 Fonte: ${escapeHtml(noticia.fonte || 'Externa')}</div>`;

      return `
      <article class="alerta-card news-card">
        ${coverHtml}
        <div class="news-card-body">
          ${badgeHtml}
          <h2 class="news-card-title">${escapeHtml(noticia.titulo)}</h2>
          <div class="alerta-meta news-card-meta">
            ${date} &bull; Por ${escapeHtml(noticia.autorNome || 'Equipe Caju')}
          </div>
          <p class="news-card-desc">${escapeHtml(noticia.resumo || 'Clique para ler a matéria completa.')}</p>
          <div class="alerta-footer news-card-footer">
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
