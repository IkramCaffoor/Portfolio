Script · JS
/* ═══════════════════════════════════════════════════════
   IKRAM CAFFOOR — Portfolio Script
   ═══════════════════════════════════════════════════════ */
 
'use strict';
 
/* ────────────────────────────────────────
   1. PARTICLE CANVAS
──────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('network');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
 
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  const NODE_COUNT = 55;
  const MAX_DIST   = 110;
  const SPEED      = 0.35;
 
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
  }));
 
  let mouse = { x: -999, y: -999 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    // update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
 
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,180,255,0.5)';
      ctx.shadowBlur  = 6;
      ctx.shadowColor = 'rgba(0,180,255,0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
 
    // draw edges between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,180,255,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
      // mouse interaction
      const mdx  = nodes[i].x - mouse.x;
      const mdy  = nodes[i].y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < MAX_DIST * 1.5) {
        const alpha = (1 - mdist / (MAX_DIST * 1.5)) * 0.3;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,180,255,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
 
    requestAnimationFrame(draw);
  }
  draw();
})();
 
 
/* ────────────────────────────────────────
   2. NAVIGATION — sticky + mobile toggle + active
──────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('topnav');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
 
  // scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
 
  // mobile toggle
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    // prevent body scroll when menu open
    document.body.style.overflow = open ? 'hidden' : '';
  });
 
  // close on link click
  menu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
 
  // close on outside click
  document.addEventListener('click', e => {
    if (menu?.classList.contains('open') && !menu.contains(e.target) && e.target !== toggle && !toggle?.contains(e.target)) {
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
 
  // active link on scroll (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
})();
 
 
/* ────────────────────────────────────────
   3. HERO TERMINAL TYPEWRITER
──────────────────────────────────────── */
(function initTerminal() {
  const el = document.getElementById('terminalText');
  if (!el) return;
 
  const lines = [
    '$ whoami',
    'ikram_caffoor',
    '',
    '$ cat profile.txt',
    'Role     : Cybersecurity Analyst',
    'Focus    : Red Team | Blue Team | OSINT',
    'Tools    : Kali · Metasploit · Burp · Wireshark',
    'Platform : HackTheBox · picoCTF · TryHackMe',
    'Status   : [✓] Available for opportunities',
    '',
    '$ ls certifications/',
    'cicra_cybersec_2024.pdf  linux_tcm_2024.pdf  [+more incoming]',
    '',
    '$ echo "Hack Ethically. Defend Relentlessly."',
    '"Hack Ethically. Defend Relentlessly."',
    '',
    '$ _',
  ];
 
  const full = lines.join('\n');
  let i = 0;
  const SPEED = 18;
 
  function type() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(type, SPEED);
    }
  }
  setTimeout(type, 400);
})();
 
 
/* ────────────────────────────────────────
   4. HERO ROLE ROTATOR
──────────────────────────────────────── */
(function initRoles() {
  const el = document.getElementById('roleText');
  if (!el) return;
 
  const roles = [
    'Cybersecurity Analyst',
    'Penetration Tester',
    'Blue Team Engineer',
    'CTF Player',
    'OSINT Researcher',
    'SOC Analyst (Aspiring)',
  ];
  let idx = 0;
 
  function rotate() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx];
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350);
  }
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setInterval(rotate, 2800);
})();
 
 
/* ────────────────────────────────────────
   5. STAT COUNTERS
──────────────────────────────────────── */
(function initCounters() {
  const elements = document.querySelectorAll('.stat-number[data-target]');
  if (!elements.length) return;
 
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const step   = Math.ceil(dur / target);
      let current  = 0;
 
      const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, step);
 
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
 
  elements.forEach(el => observer.observe(el));
})();
 
 
/* ────────────────────────────────────────
   6. SKILL BAR ANIMATION
──────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;
 
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
 
  bars.forEach(b => observer.observe(b));
})();
 
 
/* ────────────────────────────────────────
   7. SCROLL REVEAL
──────────────────────────────────────── */
(function initReveal() {
  // Mark all section children for reveal
  document.querySelectorAll('.section > .container > *').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });
 
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
 
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
 
 
/* ────────────────────────────────────────
   8. CERTIFICATE MODAL
──────────────────────────────────────── */
(function initCertModal() {
  const modal   = document.getElementById('certModal');
  const content = document.getElementById('certModalContent');
  const closeBtn= document.getElementById('closeCertModal');
  const direct  = document.getElementById('certDirectLink');
 
  if (!modal) return;
 
  document.querySelectorAll('.view-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.cert;
      if (!url) {
        alert('Certificate not available yet.');
        return;
      }
      // populate
      content.innerHTML = `<iframe src="${url}" title="Certificate"></iframe>`;
      direct.href = url;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });
 
  function closeModal() {
    modal.hidden = true;
    content.innerHTML = '';
    document.body.style.overflow = '';
  }
 
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
 
 
/* ────────────────────────────────────────
   9. CONTACT FORM
──────────────────────────────────────── */
(function initContactForm() {
  const form   = document.querySelector('.contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;
 
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
 
    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await res.json();
 
      if (data.success) {
        status.className = 'success';
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      status.className = 'error';
      status.textContent = `✗ Error: ${err.message}`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
})();
 
 
/* ────────────────────────────────────────
   10. BACK TO TOP
──────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
 
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
 
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
 
 
/* ────────────────────────────────────────
   11. HOBBY CARDS — click to expand on mobile
──────────────────────────────────────── */
(function initHobbies() {
  document.querySelectorAll('.hobby-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('expanded');
      }
    });
  });
})();
 
 
/* ────────────────────────────────────────
   12. REDUCE MOTION SUPPORT
──────────────────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', '0.01ms');
}




