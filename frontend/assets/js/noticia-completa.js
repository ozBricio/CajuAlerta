document.addEventListener('DOMContentLoaded', () => {
  loadNoticiaCompleta();
});

async function loadNoticiaCompleta() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const container = document.getElementById('noticiaContainer');
  const errorState = document.getElementById('errorState');

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
    errorState.style.display = 'none';
    container.style.display = 'block';

    const date = noticia.dataPublicacao 
        ? noticia.dataPublicacao.toDate().toLocaleDateString('pt-BR') 
        : 'Data desconhecida';

    // Format content with paragraphs
    const contentHtml = noticia.conteudo
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p style="margin-bottom: 20px; line-height: 1.8; color: #4b5563;">${escapeHtml(p)}</p>`)
        .join('');

    container.innerHTML = `
      ${noticia.imagemCapa ? `<img src="${noticia.imagemCapa}" alt="Capa" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 30px;">` : ''}
      <h1 style="color: #111827; font-size: 2.5rem; margin-bottom: 15px; font-weight: 800;">${escapeHtml(noticia.titulo)}</h1>
      <h2 style="color: #6b7280; font-size: 1.25rem; font-weight: 400; margin-bottom: 20px;">${escapeHtml(noticia.resumo)}</h2>
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; color: #9ca3af;">
        <span>Publicado em ${date}</span>
        <span>&bull;</span>
        <span>Por <strong>${escapeHtml(noticia.autorNome || 'Equipe Caju')}</strong></span>
      </div>
      <div class="noticia-body" style="font-size: 1.1rem;">
        ${contentHtml}
      </div>
    `;

  } catch (error) {
    console.error(error);
    container.style.display = 'none';
    errorState.style.display = 'block';
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
