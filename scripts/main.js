// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.classList.toggle('is-dark', dark);
    themeBtn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
}

applyTheme(saved === 'dark' || (!saved && prefersDark));

themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form — usa EmailJS (gratuito)
// Pasos: 1) crea una cuenta en emailjs.com  2) conecta un servicio de email (ej. Gmail)
// 3) crea un template con las variables {{name}}, {{email}}, {{subject}}, {{message}}
// 4) reemplaza los valores de abajo con tu Public Key, Service ID y Template ID
const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'service_qf1sm4q';
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
const FALLBACK_EMAIL = 'alberto.rubio.isc@gmail.com';

if (EMAILJS_PUBLIC_KEY !== 'TU_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    const form = e.target;

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    status.className = 'form-status';
    status.style.display = 'none';

    const data = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
    };

    // Si no has configurado EmailJS, abre el cliente de correo como fallback
    if (EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY') {
        const body = encodeURIComponent(`Nombre: ${data.name}\nCorreo: ${data.email}\n\n${data.message}`);
        const subject = encodeURIComponent(data.subject || 'Mensaje desde tu CV');
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        submitBtn.textContent = 'Enviar mensaje';
        submitBtn.disabled = false;
        return;
    }

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
        status.className = 'form-status success';
        status.textContent = '¡Mensaje enviado! Te responderé pronto.';
        form.reset();
    } catch (err) {
        status.className = 'form-status error';
        status.textContent = `Algo salió mal. Inténtalo de nuevo o escríbeme a ${FALLBACK_EMAIL}.`;
        console.error('Contact form error:', err);
    }

    status.style.display = 'block';
    submitBtn.innerHTML = '<svg width="15" height="15" aria-hidden="true"><use href="assets/icons.svg#icon-send"/></svg> Enviar mensaje';
    submitBtn.disabled = false;
});

// Copiar correo al portapapeles
document.querySelectorAll('.email-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const email = btn.dataset.email;
    const tooltip = btn.querySelector('.email-tooltip');

    navigator.clipboard.writeText(email).then(() => {
      tooltip.classList.add('visible');
      setTimeout(() => tooltip.classList.remove('visible'), 2000);
    });
  });
});