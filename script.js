/* =========================================
   PROMPT BATTLE 2K26 — JavaScript
   ========================================= */

'use strict';

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Hamburger Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Particle Canvas ──
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.5, 2.5),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.5, -0.1),
      alpha: rand(0.2, 0.8),
      color: Math.random() > 0.5
        ? `rgba(0,200,255,`
        : Math.random() > 0.5
        ? `rgba(168,85,247,`
        : `rgba(0,255,225,`
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color + '0.6)';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.001;

      if (p.y < -10 || p.alpha <= 0) {
        Object.assign(p, createParticle(), { y: H + 5 });
      }
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - dist/80)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', () => { resize(); init(); });
})();

// ── Scroll Reveal Animations ──
(function initReveal() {
  const targets = document.querySelectorAll(
    '.about-card, .rule-card, .step-item, .sample-card, .challenge-block, .section-header'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// ── Fullscreen Image Modal ──
const imageModal  = document.getElementById('imageModal');
const modalClose  = document.getElementById('modalClose');
const fullImgBtn  = document.getElementById('fullscreenImgBtn');

function openModal() {
  imageModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  imageModal.classList.remove('active');
  document.body.style.overflow = '';
}

fullImgBtn && fullImgBtn.addEventListener('click', openModal);
modalClose && modalClose.addEventListener('click', closeModal);
imageModal && imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Video Player (Challenge Section) ──
(function initMainVideo() {
  const video      = document.getElementById('sampleVideo');
  const overlay    = document.getElementById('videoOverlay');
  const playBtn    = document.getElementById('playBtn');
  const controls   = document.getElementById('videoControls');
  const vcPlayPause = document.getElementById('vcPlayPause');
  const vcPlayIcon  = document.getElementById('vcPlayIcon');
  const vcPauseIcon = document.getElementById('vcPauseIcon');
  const vcMute      = document.getElementById('vcMute');
  const vcFullscreen= document.getElementById('vcFullscreen');
  const progressWrap= document.getElementById('progressWrap');
  const progressBar = document.getElementById('progressBar');
  const vcTime      = document.getElementById('vcTime');

  if (!video) return;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
      overlay.classList.add('hidden');
      vcPlayIcon.style.display = 'none';
      vcPauseIcon.style.display = 'block';
    } else {
      video.pause();
      overlay.classList.remove('hidden');
      vcPlayIcon.style.display = 'block';
      vcPauseIcon.style.display = 'none';
    }
  }

  playBtn     && playBtn.addEventListener('click', togglePlay);
  vcPlayPause && vcPlayPause.addEventListener('click', togglePlay);

  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    progressBar.style.width = pct + '%';
    vcTime.textContent = formatTime(video.currentTime);
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
    vcPlayIcon.style.display = 'block';
    vcPauseIcon.style.display = 'none';
    progressBar.style.width = '0%';
    vcTime.textContent = '0:00';
  });

  progressWrap && progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  let muted = false;
  vcMute && vcMute.addEventListener('click', () => {
    muted = !muted;
    video.muted = muted;
    vcMute.style.opacity = muted ? '0.4' : '1';
  });

  vcFullscreen && vcFullscreen.addEventListener('click', () => {
    const wrap = video.closest('.preview-media-wrap') || video;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      (wrap.requestFullscreen || wrap.webkitRequestFullscreen).call(wrap);
    }
  });
})();

// ── Sample Video 2 (Samples Section) ──
(function initSampleVideo2() {
  const video = document.getElementById('sampleVideo2');
  const btn   = document.getElementById('samplePlayBtn2');
  if (!video || !btn) return;

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
      video.pause();
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  });
})();

// ── Smooth Scroll for CTA ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Active Nav Link on Scroll ──
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
})();

// ── Typing Effect on Hero ──
(function typewriterEffect() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;
  const original = el.textContent;
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < original.length) {
      el.textContent += original[i++];
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 1200);
})();

// ── Counter Animation ──
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = el.textContent;
        if (!isNaN(parseInt(val))) {
          const target = parseInt(val);
          let current = 0;
          const step = Math.ceil(target / 30);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
          }, 40);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => observer.observe(n));
})();

// ── Cursor Glow ──
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0,200,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

// ── Nav Active Style ──
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--neon-blue) !important; }`;
document.head.appendChild(style);

console.log('%cPROMPT BATTLE 2K26 ⚡', 'color:#00c8ff;font-family:monospace;font-size:18px;font-weight:900;');
console.log('%cImagine. Prompt. Create.', 'color:#a855f7;font-family:monospace;font-size:12px;');
