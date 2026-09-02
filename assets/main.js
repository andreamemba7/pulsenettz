// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---- Contact form (Resend via /api/contact) ----
// The Resend API key lives in Vercel's environment variables, not here.
// This just posts JSON to the serverless function in /api/contact.js.
const FORM_ENDPOINT = '/api/contact';

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const statusEl = contactForm.querySelector('.form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const setStatus = (text, kind) => {
    statusEl.textContent = text;
    statusEl.classList.remove('ok', 'err');
    statusEl.classList.add('visible', kind);
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(contactForm);
    const payload = {
      name: (data.get('name') || '').trim(),
      email: (data.get('email') || '').trim(),
      phone: (data.get('phone') || '').trim(),
      organization: (data.get('organization') || '').trim(),
      interests: data.getAll('interest'),
      message: (data.get('message') || '').trim(),
      website: data.get('website') || '', // honeypot — must stay empty
    };

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.classList.remove('visible', 'ok', 'err');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        contactForm.reset();
        setStatus("Message sent. We'll be in touch soon.", 'ok');
      } else {
        setStatus(result.error || 'Something went wrong sending that — please try again or email us directly.', 'err');
      }
    } catch (err) {
      setStatus('Network error — please try again or email pulsenettz@gmail.com directly.', 'err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
