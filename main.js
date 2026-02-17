/* ═══════════════════════════════════════════
   IhtishamSudo Portfolio — Interactivity
   ═══════════════════════════════════════════ */

// ── DOM Elements ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkElements = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const statNumbers = document.querySelectorAll('.stat-number');
const animateElements = document.querySelectorAll('.animate-on-scroll');

// ── Mobile Menu ──
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Navbar Scroll Effect ──
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ── Active Nav Link Highlighting ──
function updateActiveLink() {
  const scrollY = window.scrollY + 200;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ── Scroll Animations (IntersectionObserver) ──
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animateElements.forEach(el => scrollObserver.observe(el));

// ── Animated Counters ──
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  
  statNumbers.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const prefix = counter.dataset.prefix || '';
    const suffix = counter.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = target * easeOut;
      
      if (isDecimal) {
        counter.textContent = `${prefix}${current.toFixed(2)}${suffix}`;
      } else {
        counter.textContent = `${prefix}${Math.floor(current)}${suffix}`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          counter.textContent = `${prefix}${target.toFixed(2)}${suffix}`;
        } else {
          counter.textContent = `${prefix}${target}${suffix}`;
        }
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
  
  countersAnimated = true;
}

// Trigger counters when stats section is visible
const statsSection = document.getElementById('stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  statsObserver.observe(statsSection);
}

// ── Smooth Scroll for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
