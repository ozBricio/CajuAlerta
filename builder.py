import io
import re

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

# Ache o sucesso do registro e adicione o redirect
old_success = """    // Sucesso Absoluto
    form.style.display = 'none';
    const successBox = document.getElementById('successBox');
    if (successBox) successBox.classList.remove('d-none');
    
    if(errorBox) errorBox.style.display = 'none';
}"""

new_success = """    // Sucesso Absoluto
    form.style.display = 'none';
    const successBox = document.getElementById('successBox');
    if (successBox) successBox.classList.remove('d-none');
    
    if(errorBox) errorBox.style.display = 'none';
    
    // Redirecionamento automático após criação
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3500);
}"""

cjs = cjs.replace(old_success, new_success)

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
