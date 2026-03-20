/* ===================================================
   VASUDEV GOUD BIKKI — PORTFOLIO SCRIPTS
=================================================== */

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.init(); }

  init() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.r  = Math.random() * 1.5 + 0.4;
    this.a  = Math.random() * 0.4 + 0.08;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,136,${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 13000);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,136,${0.07 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

resizeCanvas();
initParticles();
animate();

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


/* ===== MATRIX RAIN (hero section) ===== */
const matrixCanvas = document.getElementById('matrix-canvas');
const mCtx = matrixCanvas.getContext('2d');

// Mix of digits, hex, binary, and a few katakana for the hacker aesthetic
const MATRIX_CHARS = '0123456789ABCDEFabcdef01<>[]{}|\\!@#%^&*01110100ΛΣΩΨΔΦ01アイウカキサシタチ';
const M_FONT = 13;
let mDrops = [];

function resizeMatrix() {
  const hero = document.getElementById('hero');
  matrixCanvas.width  = hero.offsetWidth;
  matrixCanvas.height = hero.offsetHeight;
  const cols = Math.floor(matrixCanvas.width / M_FONT);
  // Randomise starting position so columns don't all start at once
  mDrops = Array.from({ length: cols }, () => Math.random() * -80);
}

function drawMatrix() {
  // Semi-transparent fill creates the fade trail
  mCtx.fillStyle = 'rgba(5,5,15,0.045)';
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  mCtx.font = `${M_FONT}px "JetBrains Mono", monospace`;

  for (let i = 0; i < mDrops.length; i++) {
    const y = mDrops[i] * M_FONT;
    if (y < 0) { mDrops[i] += 0.4 + Math.random() * 0.4; continue; }

    // Head character — bright white-green
    const headChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    mCtx.fillStyle = '#cfffea';
    mCtx.fillText(headChar, i * M_FONT, y);

    // Second character — slightly dimmer
    if (y - M_FONT > 0) {
      mCtx.fillStyle = `rgba(160,255,200,0.85)`;
      mCtx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], i * M_FONT, y - M_FONT);
    }

    // Body characters — varying opacity for depth
    for (let k = 2; k < 6; k++) {
      const by = y - k * M_FONT;
      if (by < 0) break;
      const fade = 0.72 - k * 0.1;
      mCtx.fillStyle = `rgba(0,255,136,${Math.max(fade, 0.05)})`;
      mCtx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], i * M_FONT, by);
    }

    // Reset column randomly after reaching bottom
    if (y > matrixCanvas.height && Math.random() > 0.975) mDrops[i] = 0;
    mDrops[i] += 0.38 + Math.random() * 0.45; // each column runs at its own pace
  }
}

resizeMatrix();
setInterval(drawMatrix, 48);
window.addEventListener('resize', resizeMatrix);


/* ===== NAVBAR ===== */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navItems.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active-nav');
  });
}, { passive: true });


/* ===== TYPING ANIMATION ===== */
const roles = [
  'Cybersecurity Specialist',
  'Penetration Tester',
  'Ethical Hacker',
  "DTU Master's Student",
  'Security Researcher',
  'Python Developer'
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = roles[roleIdx];

  if (deleting) {
    typedEl.textContent = current.substring(0, --charIdx);
    if (charIdx <= 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
      setTimeout(typeLoop, 450);
      return;
    }
    setTimeout(typeLoop, 42);
  } else {
    typedEl.textContent = current.substring(0, ++charIdx);
    if (charIdx >= current.length) {
      deleting = true;
      setTimeout(typeLoop, 2300);
      return;
    }
    setTimeout(typeLoop, 78);
  }
}

typeLoop();


/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      let delay = 0;
      siblings.forEach(el => {
        if (el === entry.target) {
          setTimeout(() => el.classList.add('visible'), delay);
          delay += 120;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ===== SKILL BAR ANIMATION ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));


/* ===== MEDIA MODAL ===== */
function openModal(src, type) {
  const overlay   = document.getElementById('media-modal');
  const container = document.getElementById('modal-media');
  container.innerHTML = '';

  if (type === 'video') {
    const video  = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    const source   = document.createElement('source');
    source.src  = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    container.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Activity photo';
    container.appendChild(img);
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('media-modal').classList.remove('active');
  document.getElementById('modal-media').innerHTML = '';
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('media-modal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ===== SCROLL PROGRESS BAR ===== */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (scrolled / maxScroll * 100) + '%';
}, { passive: true });


/* ===== CURSOR GLOW ===== */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });


/* ===== 3D CARD TILT ===== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ===== ACTIVITY PASSION METERS ===== */
const meterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.act-meter-fill').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });
    meterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.act-card').forEach(el => meterObserver.observe(el));


/* ===== ANIMATED STATS COUNTERS ===== */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.counter-num').forEach(el => {
      const target = +el.dataset.target;
      const duration = 1600;
      const step = duration / target;
      let current = 0;
      const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, step);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.counter-strip').forEach(el => counterObserver.observe(el));


