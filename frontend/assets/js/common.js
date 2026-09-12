
const isLocalEnvironment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.CAJU_API_BASE_URL = window.CAJU_API_BASE_URL || (isLocalEnvironment ? '' : 'https://SEU-BACKEND.example.com');

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initPlatformAccess();
});

window.apiUrl = path => `${window.CAJU_API_BASE_URL || ''}${path}`;

async function initPlatformAccess() {
  const navList = document.querySelector('.nav-list');
  if (!navList || navList.querySelector('.platform-entry')) return;

  let authenticated = false;
  try {
    const response = await fetch(window.apiUrl('/api/auth/me'), { credentials: 'include' });
    authenticated = response.ok;
  } catch (error) {
    authenticated = false;
  }

  const platformLi = document.createElement('li');
  platformLi.className = 'platform-entry';
  platformLi.innerHTML = `<a class="platform-link" href="${authenticated ? '/suporte' : '/login'}">${authenticated ? 'Minha conta' : 'Acessar plataforma'}</a>`;
  navList.appendChild(platformLi);
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
