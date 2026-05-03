/* ═══════════════════════════════════════════════════════════════
   BEEEEE BBBB — Portfolio JavaScript (FULLY FIXED)
   Fixes: mobile menu tappable, theme toggle visible, all features
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ───────────────────────────────────────────
   LOADING SCREEN
─────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroAnimations();
    }, 1600);
  });
  document.body.style.overflow = 'hidden';
})();

/* ───────────────────────────────────────────
   CUSTOM CURSOR (disabled on touch devices)
─────────────────────────────────────────── */
(function initCursor() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (dot) dot.style.display = 'none';
    if (outline) outline.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-toggle, .exp-card, .interest-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovering'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovering'));
  });
})();

/* ───────────────────────────────────────────
   SCROLL PROGRESS BAR
─────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min((scrolled / total) * 100, 100);
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ───────────────────────────────────────────
   NAVBAR: Scrolled class + active links + mobile menu (FIXED)
─────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const body = document.body;

  if (!nav || !hamburger || !navLinks) return;

  // Scrolled class & active link highlight
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }, { passive: true });

  // Toggle mobile menu
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close menu when a nav link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  // Close menu when clicking outside (optional but good UX)
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ───────────────────────────────────────────
   DARK / LIGHT THEME TOGGLE (FIXED: visible & persistent)
─────────────────────────────────────────── */
let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  
  // Update both theme icons (header and footer)
  const themeIcon = document.getElementById('theme-icon');
  const footerThemeIcon = document.getElementById('footer-theme-icon');
  
  if (themeIcon) {
    themeIcon.className = 'fas ' + (isDark ? 'fa-sun' : 'fa-moon');
  }
  if (footerThemeIcon) {
    footerThemeIcon.className = 'fas ' + (isDark ? 'fa-moon' : 'fa-sun');
  }
  
  // Save preference to localStorage
  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
}

function loadSavedTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    isDark = false;
    document.documentElement.setAttribute('data-theme', 'light');
    const themeIcon = document.getElementById('theme-icon');
    const footerThemeIcon = document.getElementById('footer-theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
    if (footerThemeIcon) footerThemeIcon.className = 'fas fa-sun';
  } else {
    // Default dark
    isDark = true;
  }
}

// Attach event listeners after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  const themeToggleBtn = document.getElementById('theme-toggle');
  const footerThemeBtn = document.getElementById('footer-theme-toggle');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (footerThemeBtn) footerThemeBtn.addEventListener('click', toggleTheme);
});

/* ───────────────────────────────────────────
   TYPED.JS — Hero subtitle (manual implementation)
─────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-output');
  if (!el) return;
  const strings = [
    'Full-Stack Developer',
    'AI Enthusiast',
    'CSIT Student',
    'RAG Engineer',
    'Open-Source Contributor',
  ];
  let si = 0, ci = 0, deleting = false;
  const TYPE_SPEED = 80, DELETE_SPEED = 40, PAUSE = 1800;

  function type() {
    const current = strings[si];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
      }
    }
    setTimeout(type, deleting ? DELETE_SPEED : TYPE_SPEED);
  }
  setTimeout(type, 1800);
})();

/* ───────────────────────────────────────────
   THREE.JS HERO BACKGROUND (lightweight)
─────────────────────────────────────────── */
(function initThreeHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Torus knot
  const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 160, 24, 2, 3);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true, transparent: true, opacity: 0.25 });
  const torusKnot = new THREE.Mesh(torusGeo, torusMat);
  torusKnot.position.set(3, 0, 0);
  scene.add(torusKnot);

  // Particle field
  const PARTICLE_COUNT = 1200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x00F0FF, size: 0.03, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Ring
  const ring2Geo = new THREE.TorusGeometry(2.5, 0.02, 8, 120);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xFF007F, transparent: true, opacity: 0.3 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 2.2;
  ring2.position.set(-2, 1, -2);
  scene.add(ring2);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
  });

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.008;
    torusKnot.rotation.x = t * 0.4;
    torusKnot.rotation.y = t * 0.6;
    particles.rotation.y = t * 0.05;
    particles.rotation.x = t * 0.02;
    ring2.rotation.z = t * 0.15;
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();

/* ───────────────────────────────────────────
   GSAP HERO ANIMATIONS
─────────────────────────────────────────── */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  gsap.fromTo('.name-line', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
  gsap.fromTo('.hero-typed-wrap', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.8 });
  gsap.fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.0 });
  gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.2 });
  gsap.fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 1.5 });
  gsap.fromTo('.profile-glow-ring', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)', delay: 0.5 });

  // Stat counters
  gsap.utils.toArray('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let start = 0;
        const duration = 1500;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
      }
    });
  });
}

/* ───────────────────────────────────────────
   GSAP SCROLL ANIMATIONS (fallback for headers)
─────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section-header h2').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  });
});

/* ───────────────────────────────────────────
   AOS INIT
─────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });
  }
});

/* ───────────────────────────────────────────
   VANILLA TILT (cards and about image)
─────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.15, perspective: 1200
  });
  const aboutImg = document.getElementById('about-tilt');
  if (aboutImg) {
    VanillaTilt.init(aboutImg, { max: 12, speed: 300, glare: true, 'max-glare': 0.2 });
  }
  VanillaTilt.init(document.querySelectorAll('.interest-card'), { max: 6, speed: 400 });
});

/* ───────────────────────────────────────────
   SKILLS: Collapsible + progress bar animation
─────────────────────────────────────────── */
(function initSkills() {
  const toggles = document.querySelectorAll('.skill-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const content = toggle.nextElementSibling;
      if (!expanded) {
        toggle.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
        });
        setTimeout(() => animateBars(content), 100);
        content.addEventListener('transitionend', () => {
          content.style.overflow = '';
          content.style.maxHeight = '';
        }, { once: true });
      } else {
        toggle.setAttribute('aria-expanded', 'false');
        content.style.overflow = 'hidden';
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          content.style.maxHeight = '0';
        });
        content.addEventListener('transitionend', () => {
          content.hidden = true;
          content.style.overflow = '';
          content.style.maxHeight = '';
          content.querySelectorAll('.skill-fill').forEach(bar => bar.style.width = '0');
        }, { once: true });
      }
    });
  });

  function animateBars(content) {
    const bars = content.querySelectorAll('.skill-fill');
    bars.forEach((bar, i) => {
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, i * 80);
    });
  }
})();

/* ───────────────────────────────────────────
   SMOOTH SCROLL (native with offset)
─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ───────────────────────────────────────────
   CONTACT FORM HANDLER
─────────────────────────────────────────── */
function handleFormSubmit() {
  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();
  if (!name || !email || !message) {
    showToast('Please fill in all fields!', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email!', 'error');
    return;
  }
  console.log('📬 Form Submission:', { name, email, message });
  showToast(`Thanks, ${name}! Message received. I'll get back to you soon.`, 'success');
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('message').value = '';
}

/* ───────────────────────────────────────────
   CV DOWNLOAD (dummy)
─────────────────────────────────────────── */
function handleCVDownload() {
  console.log('📥 CV Download triggered');
  showToast('CV would download here. Integrate your actual PDF link!', 'info');
}

/* ───────────────────────────────────────────
   TOAST NOTIFICATION
─────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  const colors = { success: '#22ff88', error: '#FF007F', info: '#00F0FF' };
  const color = colors[type] || colors.info;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '28px', right: '28px',
    background: 'rgba(10,10,15,0.95)', border: `1px solid ${color}`,
    color: color, padding: '14px 22px', borderRadius: '12px',
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem',
    maxWidth: '360px', zIndex: '99999', boxShadow: `0 0 20px ${color}55`,
    backdropFilter: 'blur(20px)', transform: 'translateY(10px)', opacity: '0',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ───────────────────────────────────────────
   NEON GLOW ON SECTION LABELS (Intersection Observer)
─────────────────────────────────────────── */
(function initObservers() {
  const glowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.textShadow = '0 0 30px var(--cyan)';
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-label').forEach(el => glowObserver.observe(el));
})();

console.log('%c✦ Beeeee BBBB Portfolio — Fully fixed for mobile + theme toggle', 'color:#00F0FF;font-family:Orbitron,sans-serif;font-size:14px;');