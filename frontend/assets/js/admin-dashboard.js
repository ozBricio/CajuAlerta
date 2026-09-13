document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  let base64Images = [null, null, null];
  
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }

    try {
      const userDoc = await db.collection('usuarios').doc(user.uid).get();
      const userData = userDoc.data();

      if (!userData || userData.role !== 'staff') {
        alert('Acesso Negado: Área restrita para jornalistas/staff.');
        window.location.replace('perfil.html');
        return;
      }

      initNewsPanel(user, userData.nome);
    } catch (error) {
      console.error(error);
      alert('Erro de permissão.');
      window.location.replace('perfil.html');
    }
  });

  function setupImageUploader(inputId, previewId, index) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          base64Images[index] = canvas.toDataURL('image/jpeg', 0.7);
          preview.src = base64Images[index];
          preview.style.display = 'block';
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function initNewsPanel(user, authorName) {
    setupImageUploader('newsImage1', 'imagePreview1', 0);
    setupImageUploader('newsImage2', 'imagePreview2', 1);
    setupImageUploader('newsImage3', 'imagePreview3', 2);

    const btnTabPost = document.getElementById('btnTabPost');
    const btnTabList = document.getElementById('btnTabList');
    const tabPost = document.getElementById('tabPost');
    const tabList = document.getElementById('tabList');
    const form = document.getElementById('formPostNews');

    btnTabPost.addEventListener('click', () => {
      btnTabPost.classList.add('active');
      btnTabList.classList.remove('active');
      tabPost.classList.remove('d-none');
      tabList.classList.add('d-none');
    });

    btnTabList.addEventListener('click', () => {
      btnTabList.classList.add('active');
      btnTabPost.classList.remove('active');
      tabList.classList.remove('d-none');
      tabPost.classList.add('d-none');
      loadNewsList();
    });

    // Submissão do Formulário (Criar ou Editar)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const editId = document.getElementById('editNewsId').value;
      
      if (!editId && !base64Images[0]) {
        alert('Por favor, adicione pelo menos a Imagem 1 (Capa).');
        return;
      }
      
      const btn = document.getElementById('btnSubmitNews');
      const msg = document.getElementById('newsMsg');
      
      btn.disabled = true;
      btn.textContent = editId ? 'Salvando Edição...' : 'Publicando...';
      msg.textContent = '';
      
      const title = document.getElementById('newsTitle').value.trim();
      const summary = document.getElementById('newsSummary').value.trim();
      const content = document.getElementById('newsContent').value.trim();
      const fonte = document.getElementById('newsFonte').value.trim();
      const isOficial = document.getElementById('newsFonteOficial').checked;
      
      try {
        const payload = {
          titulo: title,
          resumo: summary,
          conteudo: content,
          fonte: fonte,
          fonteOficial: isOficial,
          imagens: base64Images.filter(img => img !== null),
          autorNome: authorName,
          autorUid: user.uid
        };

        if (editId) {
          // Edição (se enviou fotos novas, substitui, senão ignora atualização de fotos)
          if (payload.imagens.length > 0) {
            await window.dbNoticias.collection('noticias').doc(editId).update(payload);
          } else {
            delete payload.imagens;
            await window.dbNoticias.collection('noticias').doc(editId).update(payload);
          }
          msg.textContent = 'Notícia atualizada com sucesso!';
        } else {
          // Criação
          payload.dataPublicacao = firebase.firestore.FieldValue.serverTimestamp();
          await window.dbNoticias.collection('noticias').add(payload);
          msg.textContent = 'Notícia publicada com sucesso no Portal!';
        }
        
        msg.style.color = '#22c55e';
        resetForm();
        
      } catch (error) {
        console.error(error);
        msg.style.color = '#ef4444';
        msg.textContent = 'Erro ao processar: ' + error.message;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publicar Notícia';
      }
    });

    document.getElementById('btnCancelEdit').addEventListener('click', resetForm);
  }

  function resetForm() {
    document.getElementById('formPostNews').reset();
    document.getElementById('editNewsId').value = '';
    document.getElementById('formTitle').textContent = 'Criar Nova Matéria';
    document.getElementById('btnSubmitNews').textContent = 'Publicar Notícia';
    document.getElementById('btnCancelEdit').classList.add('d-none');
    
    base64Images = [null, null, null];
    for(let i=1; i<=3; i++) {
      const p = document.getElementById('imagePreview'+i);
      p.src = '';
      p.style.display = 'none';
    }
  }

  async function loadNewsList() {
    const container = document.getElementById('newsListContainer');
    container.innerHTML = '<p>Carregando...</p>';
    
    try {
      const snapshot = await window.dbNoticias.collection('noticias').orderBy('dataPublicacao', 'desc').get();
      if (snapshot.empty) {
        container.innerHTML = '<p>Nenhuma matéria publicada ainda.</p>';
        return;
      }
      
      let html = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const date = data.dataPublicacao ? data.dataPublicacao.toDate().toLocaleDateString('pt-BR') : '';
        html += `
          <div class="news-item">
            <div>
              <h4>${data.titulo}</h4>
              <p>${date} &bull; Fonte: ${data.fonteOficial ? 'Sistema' : (data.fonte || 'Externa')}</p>
            </div>
            <button class="btn" style="background:#fff3e0; color:#ff9900; font-weight:bold; border-radius:8px;" onclick="window.editNews('${doc.id}')">Editar</button>
          </div>
        `;
      });
      container.innerHTML = html;
      
    } catch (error) {
      container.innerHTML = '<p style="color:red;">Erro ao carregar notícias.</p>';
      console.error(error);
    }
  }

  // Tornar global para o botão funcionar
  window.editNews = async function(id) {
    try {
      const doc = await window.dbNoticias.collection('noticias').doc(id).get();
      if (!doc.exists) return;
      const data = doc.data();
      
      document.getElementById('editNewsId').value = id;
      document.getElementById('newsTitle').value = data.titulo || '';
      document.getElementById('newsSummary').value = data.resumo || '';
      document.getElementById('newsContent').value = data.conteudo || '';
      document.getElementById('newsFonte').value = data.fonte || '';
      document.getElementById('newsFonteOficial').checked = data.fonteOficial || false;
      
      document.getElementById('formTitle').textContent = 'Editando Matéria';
      document.getElementById('btnSubmitNews').textContent = 'Salvar Edição';
      document.getElementById('btnCancelEdit').classList.remove('d-none');
      
      // Volta pra aba
      document.getElementById('btnTabPost').click();
      window.scrollTo(0,0);
      
    } catch (e) {
      console.error(e);
    }
  };

});
