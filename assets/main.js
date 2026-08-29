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

// ---- Contact form (Formspree) ----
// Swap FORM_ENDPOINT below for the real endpoint from your Formspree dashboard,
// e.g. "https://formspree.io/f/xxxxabcd" — see README for the 3-step setup.
const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID';

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const statusEl = contactForm.querySelector('.form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (FORM_ENDPOINT.includes('REPLACE_WITH_YOUR_FORM_ID')) {
      statusEl.textContent = 'Form not connected yet — add your Formspree endpoint in assets/main.js.';
      statusEl.classList.add('visible', 'err');
      statusEl.classList.remove('ok');
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.classList.remove('visible', 'ok', 'err');

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        statusEl.textContent = "Message sent. We'll be in touch soon.";
        statusEl.classList.add('visible', 'ok');
        contactForm.reset();
      } else {
        statusEl.textContent = 'Something went wrong sending that — please try again or email us directly.';
        statusEl.classList.add('visible', 'err');
      }
    } catch (err) {
      statusEl.textContent = 'Network error — please try again or email us directly.';
      statusEl.classList.add('visible', 'err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
