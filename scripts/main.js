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

// Contact form — usa Formspree (gratuito)
// Pasos: 1) ve a formspree.io  2) crea un form  3) reemplaza TU_FORM_ID abajo
const FORMSPREE_ID = 'TU_FORM_ID';

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

    // Si no has configurado Formspree, abre el cliente de correo como fallback
    if (FORMSPREE_ID === 'TU_FORM_ID') {
        const body = encodeURIComponent(`Nombre: ${data.name}\n\n${data.message}`);
        const subject = encodeURIComponent(data.subject || 'Mensaje desde tu CV');
        window.location.href = `mailto:tu@correo.com?subject=${subject}&body=${body}`;
        submitBtn.textContent = 'Enviar mensaje';
        submitBtn.disabled = false;
        return;
    }

    try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            status.className = 'form-status success';
            status.textContent = '¡Mensaje enviado! Te responderé pronto.';
            form.reset();
        } else {
            throw new Error('Error al enviar');
        }
    } catch {
        status.className = 'form-status error';
        status.textContent = 'Algo salió mal. Inténtalo de nuevo o escríbeme directamente.';
    }

    status.style.display = 'block';
    submitBtn.innerHTML = '<svg width="15" height="15" aria-hidden="true"><use href="assets/icons.svg#icon-send"/></svg> Enviar mensaje';
    submitBtn.disabled = false;
});