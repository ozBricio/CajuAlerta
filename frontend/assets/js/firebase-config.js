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
