const firebaseConfig = {
  apiKey: "AIzaSyAw5-vL8eUNzEqojR5fo54wtm8d9GOAM0Q",
  authDomain: "cajualerta.firebaseapp.com",
  projectId: "cajualerta",
  storageBucket: "cajualerta.firebasestorage.app",
  messagingSenderId: "845712716947",
  appId: "1:845712716947:web:f36d758a76d27409fa0966",
  measurementId: "G-M9HSYTMMLP"
};

// Initialize Firebase (Compat)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exportar globais para os outros scripts
window.db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
window.auth = typeof firebase !== 'undefined' ? firebase.auth() : null;


// ==========================================
// BANCO DE DADOS SECUNDÁRIO (PORTAL DE NOTÍCIAS)
// ==========================================
const firebaseConfigNoticias = {
  apiKey: "AIzaSyCcblzreDnI2HItRKHDPe_9-EKIkOX8PQY",
  authDomain: "portal-de-noticias-793e6.firebaseapp.com",
  projectId: "portal-de-noticias-793e6",
  storageBucket: "portal-de-noticias-793e6.firebasestorage.app",
  messagingSenderId: "1030156058816",
  appId: "1:1030156058816:web:fcb48d90f9067d7f72ad25",
  measurementId: "G-BKSSRY0XBW"
};

// Inicializa o segundo App com nome 'noticiasApp'
const appNoticias = firebase.initializeApp(firebaseConfigNoticias, 'noticiasApp');
window.dbNoticias = appNoticias.firestore();
