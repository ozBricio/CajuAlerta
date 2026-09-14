document.addEventListener('DOMContentLoaded', () => {
  loadNoticiaCompleta();
});

async function loadNoticiaCompleta() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    window.location.replace('noticias.html');
    return;
  }

  try {
    const doc = await window.dbNoticias.collection('noticias').doc(id).get();
    
    if (!doc.exists) {
      throw new Error('Notícia não encontrada');
    }

    const noticia = doc.data();

    const titleEl = document.getElementById('articleTitle');
    const badgeEl = document.getElementById('articleBadge');
    const authorEl = document.getElementById('articleAuthor');
    const dateEl = document.getElementById('articleDate');
    const contentEl = document.getElementById('articleContent');

    const date = noticia.dataPublicacao 
        ? noticia.dataPublicacao.toDate().toLocaleDateString('pt-BR') 
        : 'Data desconhecida';

    if (titleEl) titleEl.textContent = noticia.titulo;
    
    if (authorEl) {
      authorEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Por ${escapeHtml(noticia.autorNome || 'Equipe Caju')}`;
    }
    
    if (dateEl) {
      dateEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${date}`;
    }

    if (badgeEl) {
      badgeEl.classList.remove('loading');
      if (noticia.fonteOficial) {
        badgeEl.textContent = 'Investigação Oficial';
        badgeEl.className = 'alerta-badge warning';
      } else {
        badgeEl.textContent = `Fonte: ${noticia.fonte || 'Externa'}`;
        badgeEl.className = 'alerta-badge';
        badgeEl.style.background = '#f3f4f6';
        badgeEl.style.color = '#4b5563';
        badgeEl.style.border = '1px solid #d1d5db';
      }
    }

    const contentHtml = noticia.conteudo
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');

    let imagesHtml = '';
    const imgs = noticia.imagens || (noticia.imagemCapa ? [noticia.imagemCapa] : []);
    
    if (imgs.length > 0) {
      imagesHtml += `<img src="${imgs[0]}" alt="Capa" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 30px;">`;
      
      if (imgs.length > 1) {
        imagesHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">`;
        for(let i=1; i<imgs.length; i++) {
          imagesHtml += `<img src="${imgs[i]}" alt="Foto ${i+1}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;">`;
        }
        imagesHtml += `</div>`;
      }
    }

    if (contentEl) {
      contentEl.innerHTML = `
        ${imagesHtml}
        ${noticia.resumo ? `<h2 style="color: #6b7280; font-size: 1.25rem; font-weight: 400; margin-bottom: 20px;">${escapeHtml(noticia.resumo)}</h2>` : ''}
        ${contentHtml}
      `;
    }

  } catch (error) {
    console.error(error);
    const contentEl = document.getElementById('articleContent');
    if (contentEl) contentEl.innerHTML = `<p style="color:red;">Erro ao carregar a notícia. Ela pode ter sido removida ou ocorreu um problema de conexão.</p>`;
    const titleEl = document.getElementById('articleTitle');
    if (titleEl) titleEl.textContent = 'Notícia não encontrada';
    const badgeEl = document.getElementById('articleBadge');
    if (badgeEl) badgeEl.style.display = 'none';
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(() => {
      alert('Copie o link na barra de endereços para compartilhar.');
    });
  }
}
