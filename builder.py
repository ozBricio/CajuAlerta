import io
import re

with io.open('frontend/assets/js/login.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

new_logic = """      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;
      
      // Busca o perfil no Firestore
      const userDoc = await firebase.firestore().collection('usuarios').doc(user.uid).get();
      let userData = userDoc.data();
      
      // Se não existir (legacy admins), ignora
      if (userData) {
        if (userData.status === 'bloqueado') {
          await firebase.auth().signOut();
          throw new Error('Perfil bloqueado. Entre em contato com o suporte para saber mais informações.');
        }
        
        // Atualiza histórico de acessos
        await firebase.firestore().collection('historico_acessos').add({
          uid: user.uid,
          email: user.email,
          dataAcesso: firebase.firestore.FieldValue.serverTimestamp(),
          ip: 'via-cliente' // Client-side IP tracking varies, just placeholder
        });
        
        // Atualiza último acesso no perfil
        await firebase.firestore().collection('usuarios').doc(user.uid).update({
          ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      // Bloqueio de e-mail não verificado
      if (!user.emailVerified && !email.includes('admin')) {"""

cjs = re.sub(r"      const userCredential = await window\.auth\.signInWithEmailAndPassword\(email, senha\);\s*// Bloqueio de e-mail n[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0300-\u036F\u0080-\u00FF\ufffd]+o verificado\s*if \(!userCredential\.user\.emailVerified && !email\.includes\('admin'\)\) \{", new_logic, cjs, flags=re.DOTALL)

with io.open('frontend/assets/js/login.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
