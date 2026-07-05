// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Nav scroll state + mobile toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

// Cursor glow (desktop only)
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
} else {
  glow.style.display = 'none';
}

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i * 70) + 'ms';
  io.observe(el);
});

// Reveal for feature/why/pricing/testimonial cards
const groupSelectors = ['.feature-card', '.why-item', '.price-card', '.testi-card', '.faq-item'];
groupSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.setAttribute('data-reveal-el', '');
    el.style.transitionDelay = (Math.min(i, 8) * 60) + 'ms';
  });
});
const io2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io2.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal-el]').forEach(el => io2.observe(el));

// Animated stat counters
const statNums = document.querySelectorAll('.stat-num');
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io3 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      io3.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
statNums.forEach(el => io3.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Hero console typing effect
const consoleLines = [
  '$ xplec deploy tarabot.zip',
  'Uploading archive... done',
  'Installing dependencies... done',
  'Starting process bot.py',
  '[INFO] Connected to Telegram API',
  '[INFO] Bot @tarabot is live ✔'
];
const consoleBody = document.getElementById('consoleBody');
let lineIndex = 0, charIndex = 0;

function typeConsole() {
  if (lineIndex >= consoleLines.length) {
    setTimeout(() => {
      consoleBody.innerHTML = '';
      lineIndex = 0; charIndex = 0;
      typeConsole();
    }, 2200);
    return;
  }
  const currentLine = consoleLines[lineIndex];
  let lineEl = consoleBody.children[lineIndex];
  if (!lineEl) {
    lineEl = document.createElement('div');
    lineEl.className = currentLine.startsWith('$') ? 'line-in' : '';
    consoleBody.appendChild(lineEl);
  }
  charIndex++;
  lineEl.textContent = currentLine.slice(0, charIndex);
  if (charIndex >= currentLine.length) {
    lineIndex++; charIndex = 0;
    setTimeout(typeConsole, 260);
  } else {
    setTimeout(typeConsole, 22);
  }
}
typeConsole();

// Contact form (front-end only demo)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Message received — we\'ll reply on Telegram shortly.';
  contactForm.reset();
});
