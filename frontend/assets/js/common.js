
window.CAJU_API_BASE_URL = window.CAJU_API_BASE_URL || '';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initPlatformAccess();
});

window.apiUrl = path => `${window.CAJU_API_BASE_URL || ''}${path}`;

async function initPlatformAccess() {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      // Remove botões antigos
      const existing = navList.querySelectorAll('.platform-entry, .logout-entry');
      existing.forEach(e => e.remove());

      const platformLi = document.createElement('li');
      platformLi.className = 'platform-entry';
      platformLi.innerHTML = `<a class="nav-link platform-link" href="${user ? '/registrar' : '/login'}">${user ? 'Minha conta' : 'Acessar'}</a>`;
      navList.appendChild(platformLi);

      if (user) {
        const logoutLi = document.createElement('li');
        logoutLi.className = 'logout-entry';
        logoutLi.innerHTML = `<button id="globalLogoutBtn" class="support-logout">Sair</button>`;
        navList.appendChild(logoutLi);
        document.getElementById('globalLogoutBtn').addEventListener('click', async () => { 
            await window.auth.signOut(); 
            window.location.replace('/'); 
        });
      }
    });
  }
}

function checkAuthStatus() {
  const navList = document.querySelector('.nav-list');
  
  if (!navList) return;
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    mainNav.classList.toggle('active');
  });

  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('active');
      mainNav.classList.remove('active');
    });
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-hidden');
  if (animatedElements.length === 0) return;

  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-show');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}
