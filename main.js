(function () {
  'use strict';

  // LOADER
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('out'); animateCounters(); }, 400);
  });

  // NAV scroll
  const nav = document.getElementById('nav');
  const railFill = document.getElementById('railFill');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const tot = document.documentElement.scrollHeight - window.innerHeight;
    const pct = tot > 0 ? (window.scrollY / tot * 100) : 0;
    document.getElementById('sb').style.width = pct + '%';
    if (railFill) railFill.style.height = pct + '%';
  }, { passive: true });

  // Rail dot click-to-scroll
  document.querySelectorAll('.rail-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.s);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Mobile menu
  document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('navUl').classList.toggle('open');
  });
  document.querySelectorAll('.nl').forEach(a => a.addEventListener('click', () => {
    document.getElementById('navUl').classList.remove('open');
  }));

  // Active nav link + rail dot
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nl').forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
        );
        document.querySelectorAll('.rail-dot').forEach(d =>
          d.classList.toggle('active', d.dataset.s === e.target.id)
        );
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

  // Reveal on scroll
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.r').forEach(el => ro.observe(el));

  // Counters
  function animateCounters() {
    document.querySelectorAll('.sc').forEach(el => {
      const tgt = parseInt(el.dataset.t, 10);
      let cur = 0;
      const iv = setInterval(() => {
        cur = Math.min(cur + Math.ceil(tgt / 30), tgt);
        el.textContent = cur;
        if (cur >= tgt) clearInterval(iv);
      }, 45);
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Contact box particle animation
  (function ctParticles() {
    const canvas = document.getElementById('ctParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const box = canvas.parentElement;
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = box.clientWidth; h = box.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const N = 32;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      a: Math.random() * 0.5 + 0.15
    }));

    let visible = true;
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.05 });
    io.observe(box);

    function tick() {
      requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      });

      // soft connecting lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = particles[i], b = particles[j];
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(184,130,31,${0.12 * (1 - dist / 90)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,130,31,${p.a})`;
        ctx.fill();
      });
    }
    tick();
  })();

})();
