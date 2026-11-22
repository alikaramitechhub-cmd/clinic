document.addEventListener('DOMContentLoaded', () => {

  /* 1) mobile menu */
  const drawer = document.getElementById('drawer');
  document.getElementById('menu-btn')?.addEventListener('click', () => { drawer.open = !drawer.open; });

  /* 2) dark / light theme (saved in browser) */
  const themeBtn = document.getElementById('theme-btn');
  const applyTheme = (t) => {
    mdui.setTheme(t);
    themeBtn.textContent = t === 'dark' ? '\u2600' : '\u263E';
  };
  applyTheme(localStorage.getItem('theme') || 'light');
  themeBtn.addEventListener('click', () => {
    const next = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  /* 3) Django messages as snackbars */
  document.querySelectorAll('#django-messages span').forEach((el, i) => {
    setTimeout(() => mdui.snackbar({
      message: el.textContent.trim(),
      placement: 'top',
      closeable: true,
      autoCloseDelay: 4000,
    }), i * 400);
  });

  /* 4) reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  /* 5) animated counters (about page) */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, duration = 1500, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString('fa-IR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  /* 6) Persian/Arabic digits -> English in phone field */
  const toEn = (s) => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  document.querySelector('mdui-text-field[name="phone"]')?.addEventListener('input', (e) => {
    e.target.value = toEn(e.target.value).replace(/\D/g, '').slice(0, 11);
  });

  /* 7) password strength meter (register) */
  const pass1 = document.querySelector('mdui-text-field[name="password1"]');
  const bar = document.getElementById('strength');
  const txt = document.getElementById('strength-text');
  if (pass1 && bar) {
    const labels = ['خیلی ضعیف', 'ضعیف', 'متوسط', 'خوب', 'عالی'];
    pass1.addEventListener('input', () => {
      const v = pass1.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      bar.value = score;
      txt.textContent = v ? `قدرت رمز عبور: ${labels[score]}` : 'قدرت رمز عبور';
    });
  }

  /* 8) message character counter (contact) */
  const msg = document.querySelector('mdui-text-field[name="message"]');
  const counter = document.getElementById('char-count');
  if (msg && counter) {
    msg.setAttribute('maxlength', 1000);
    msg.addEventListener('input', () => { counter.textContent = msg.value.length; });
    counter.textContent = msg.value.length;
  }

  /* 9) client-side validation + loading state on submit */
  document.querySelectorAll('form[id$="-form"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      const p1 = form.querySelector('[name="password1"]');
      const p2 = form.querySelector('[name="password2"]');
      if (p1 && p2 && p1.value !== p2.value) {
        e.preventDefault();
        mdui.snackbar({ message: 'رمز عبور و تکرار آن یکسان نیستند.', placement: 'top' });
        return;
      }
      const empty = [...form.querySelectorAll('mdui-text-field[required]')].find(f => !f.value.trim());
      if (empty) {
        e.preventDefault();
        empty.focus();
        mdui.snackbar({ message: `لطفاً «${empty.label}» را پر کنید.`, placement: 'top' });
        return;
      }
      const btn = form.querySelector('#submit-btn');
      if (btn) btn.loading = true;
    });
  });
});
