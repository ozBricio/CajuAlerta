document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  
  // Verifica autenticação primária (pra saber se é Staff)
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }

    try {
      const userDoc = await db.collection('usuarios').doc(user.uid).get();
      const userData = userDoc.data();

      // Trava de Segurança Level Staff
      if (!userData || userData.role !== 'staff') {
        alert('Acesso Negado: Área restrita para jornalistas/staff.');
        window.location.replace('perfil.html');
        return;
      }

      initNewsForm(user, userData.nome);
    } catch (error) {
      console.error(error);
      alert('Erro de permissão.');
      window.location.replace('perfil.html');
    }
  });

  function initNewsForm(user, authorName) {
    const form = document.getElementById('formPostNews');
    const imageInput = document.getElementById('newsImage');
    const imagePreview = document.getElementById('imagePreview');
    let base64Image = null;

    // Preview e Compressão da Imagem
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Comprime a imagem com Canvas para não estourar o limite de 1MB do Firestore
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          base64Image = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG
          imagePreview.src = base64Image;
          imagePreview.style.display = 'block';
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Submissão do Formulário
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!base64Image) {
        alert('Por favor, adicione uma imagem de capa.');
        return;
      }
      
      const btn = document.getElementById('btnSubmitNews');
      const msg = document.getElementById('newsMsg');
      
      btn.disabled = true;
      btn.textContent = 'Publicando...';
      msg.textContent = '';
      
      const title = document.getElementById('newsTitle').value.trim();
      const summary = document.getElementById('newsSummary').value.trim();
      const content = document.getElementById('newsContent').value.trim();
      
      try {
        // SALVA NO BANCO DE DADOS SECUNDÁRIO (appNoticias)
        await window.dbNoticias.collection('noticias').add({
          titulo: title,
          resumo: summary,
          conteudo: content,
          imagemCapa: base64Image,
          autorNome: authorName,
          autorUid: user.uid,
          dataPublicacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        msg.style.color = '#22c55e';
        msg.textContent = 'Notícia publicada com sucesso no Portal!';
        form.reset();
        base64Image = null;
        imagePreview.style.display = 'none';
        
      } catch (error) {
        console.error(error);
        msg.style.color = '#ef4444';
        msg.textContent = 'Erro ao publicar notícia: ' + error.message;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publicar Notícia Oficial';
      }
    });
  }
});
