/* BRIDGP DYNAMICS
   Shadow-board background, navigation, reveal and contact form. */

document.addEventListener('DOMContentLoaded', () => {
    initLineFields();
    initNavigation();
    initReveal();
    initContactForm();
});

/* ---------- Shadow-board field ----------
   A 5S shadow board: every item has a marked place. Items start scattered,
   fly into their slots from left to right, and every few seconds a kaizen
   pulse sweeps across, knocks them loose and they sort themselves again.
   The cursor pushes items aside; they return to their slots. The hero runs
   it light-on-navy, other sections run it quietly in their own colours. */

const FIELD_THEMES = {
    hero:  { fill: 'rgba(236, 238, 251, 0.12)', slot: 'rgba(236, 238, 251, 0.07)', tape: 'rgba(255, 198, 26, 0.6)' },
    dark:  { fill: 'rgba(236, 238, 251, 0.07)', slot: 'rgba(236, 238, 251, 0.045)', tape: 'rgba(255, 198, 26, 0.4)' },
    light: { fill: 'rgba(10, 12, 59, 0.05)',    slot: 'rgba(10, 12, 59, 0.055)',   tape: 'rgba(224, 168, 0, 0.3)' }
};

function initLineFields() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hero = document.getElementById('heroField');
    if (hero) createShadowField(hero, hero.parentElement, FIELD_THEMES.hero, reduceMotion, 1);

    document.querySelectorAll('main > section').forEach((section, i) => {
        const canvas = document.createElement('canvas');
        canvas.className = 'section-field';
        canvas.setAttribute('aria-hidden', 'true');
        section.prepend(canvas);
        const theme = section.classList.contains('works') ? FIELD_THEMES.dark : FIELD_THEMES.light;
        createShadowField(canvas, section, theme, reduceMotion, i + 2);
    });
}

function createShadowField(canvas, host, theme, reduceMotion, seed) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, cell = 48, nc = 0, nr = 0, n = 0;
    let items = [];
    let raf = 0, running = false, started = false, t0 = performance.now();
    const pointer = { x: -999, y: -999, sx: -999, sy: -999, strength: 0, target: 0 };

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    function rng(a) {
        return () => {
            a |= 0; a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function build() {
        const rand = rng(seed * 9973);
        nc = Math.ceil(w / cell) + 1;
        nr = Math.ceil(h / cell) + 1;
        items = [];
        for (let r = 0; r < nr; r++) {
            for (let c = 0; c < nc; c++) {
                const has = rand() > 0.4;
                const iw = cell * (0.4 + rand() * 0.38);
                const ih = cell * (0.4 + rand() * 0.38);
                const ang = rand() * Math.PI * 2;
                const dist = 50 + rand() * 90;
                items.push({
                    cx: c * cell + cell / 2,
                    cy: r * cell + cell / 2,
                    iw, ih, has,
                    tape: has && rand() > 0.975,
                    ox: Math.cos(ang) * dist,
                    oy: Math.sin(ang) * dist,
                    or: (rand() - 0.5) * 1.6,
                    jitter: rand() * 0.5
                });
            }
        }
        n = items.length;
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        const dpr = Math.min(window.devicePixelRatio || 1, h > 1400 ? 1 : 1.5);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cell = w < 600 ? 44 : 64;
        build();
        if (reduceMotion || !running) draw(performance.now(), reduceMotion);
    }

    // Disorder of one item at time t: 1 = scattered, 0 = in its slot.
    function disorder(it, t) {
        const xr = it.cx / w;
        // Initial sort, sweeping left to right.
        let d = 1 - easeOut(clamp((t - 0.15 - xr * 1.4 - it.jitter * 0.5) / 1.5, 0, 1));
        // Kaizen pulse: every 10 seconds after the first sort.
        const cycle = Math.floor((t - 4) / 10);
        if (cycle >= 0) {
            const u = t - 4 - cycle * 10 - xr * 1.8 - it.jitter * 0.3;
            if (u > 0) {
                const pulse = u < 0.3 ? easeOut(u / 0.3) : 1 - easeOut(clamp((u - 0.3) / 1.5, 0, 1));
                d = Math.max(d, pulse * 0.85);
            }
        }
        return d;
    }

    function draw(now, settled) {
        const t = started ? (now - t0) / 1000 : 0;
        ctx.clearRect(0, 0, w, h);

        pointer.strength += (pointer.target - pointer.strength) * 0.08;
        pointer.sx += (pointer.x - pointer.sx) * 0.2;
        pointer.sy += (pointer.y - pointer.sy) * 0.2;
        const radius = 150;

        const slots = new Path2D();
        const fills = new Path2D();
        const tapes = new Path2D();
        const loose = [];
        const inset = 4;

        for (let i = 0; i < n; i++) {
            const it = items[i];
            slots.rect(it.cx - cell / 2 + inset, it.cy - cell / 2 + inset, cell - inset * 2, cell - inset * 2);
            if (!it.has) continue;

            const d = settled ? 0 : disorder(it, t);
            let x = it.cx + it.ox * d;
            let y = it.cy + it.oy * d;

            if (pointer.strength > 0.01) {
                const dx = x - pointer.sx;
                const dy = y - pointer.sy;
                const dist = Math.hypot(dx, dy);
                if (dist < radius && dist > 0.1) {
                    const push = Math.pow(1 - dist / radius, 2) * 44 * pointer.strength;
                    x += (dx / dist) * push;
                    y += (dy / dist) * push;
                }
            }

            if (d > 0.01) {
                loose.push(x, y, it.or * d, it.iw, it.ih, it.tape);
            } else {
                (it.tape ? tapes : fills).rect(x - it.iw / 2, y - it.ih / 2, it.iw, it.ih);
            }
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = theme.slot;
        ctx.stroke(slots);
        ctx.fillStyle = theme.fill;
        ctx.fill(fills);
        ctx.fillStyle = theme.tape;
        ctx.fill(tapes);

        for (let k = 0; k < loose.length; k += 6) {
            ctx.save();
            ctx.translate(loose[k], loose[k + 1]);
            ctx.rotate(loose[k + 2]);
            ctx.fillStyle = loose[k + 5] ? theme.tape : theme.fill;
            ctx.fillRect(-loose[k + 3] / 2, -loose[k + 4] / 2, loose[k + 3], loose[k + 4]);
            ctx.restore();
        }
    }

    function loop(now) {
        draw(now, false);
        raf = requestAnimationFrame(loop);
    }

    function start() {
        if (running || reduceMotion) return;
        if (!started) { started = true; t0 = performance.now(); }
        running = true;
        raf = requestAnimationFrame(loop);
    }

    function stop() {
        running = false;
        cancelAnimationFrame(raf);
    }

    host.addEventListener('pointermove', e => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        if (pointer.target === 0) { pointer.sx = pointer.x; pointer.sy = pointer.y; }
        pointer.target = 1;
    });
    host.addEventListener('pointerleave', () => { pointer.target = 0; });

    window.addEventListener('resize', resize);
    resize();

    if (reduceMotion) return;
    new IntersectionObserver(entries => {
        entries[0].isIntersecting ? start() : stop();
    }).observe(host);
}

/* ---------- Navigation ---------- */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setMenu(open) {
        toggle.classList.toggle('active', open);
        menu.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    links.forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('active')) setMenu(false);
    });

    // Highlight the link of the section in view.
    const byId = new Map();
    links.forEach(link => byId.set(link.getAttribute('href').slice(1), link));
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.remove('active'));
            const link = byId.get(entry.target.id);
            if (link) link.classList.add('active');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
}

/* ---------- Reveal ----------
   Words and blocks rise into place as they scroll into view, one after the
   other within each group. */

function initReveal() {
    const groups = [
        '.hero-content > *',
        '.section-title, .section-subtitle',
        '.about-list > div',
        '.service',
        '.work',
        '.why-grid > div',
        '.contact-list li, .social-links',
        '.contact-form .form-group',
        '.footer-section, .footer-bottom'
    ];

    groups.forEach(selector => {
        const seen = new Map();
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
            // Stagger siblings that sit in the same parent.
            const index = seen.get(el.parentElement) || 0;
            seen.set(el.parentElement, index + 1);
            el.style.setProperty('--d', `${Math.min(index, 5) * 0.09}s`);
        });
    });

    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
}

/* ---------- Contact form ---------- */

let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show${type === 'error' ? ' error' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate(input) {
        const value = input.value.trim();
        let ok = !input.required || value !== '';
        if (ok && input.type === 'email') ok = emailRegex.test(value);
        input.classList.toggle('error', !ok);
        return ok;
    }

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => { if (input.value || input.required) validate(input); });
        input.addEventListener('input', () => { if (input.classList.contains('error')) validate(input); });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const fields = [...form.querySelectorAll('input, textarea')];
        const valid = fields.map(validate).every(Boolean);
        if (!valid) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const whatsappNumber = '94770114515';
        const whatsappMessage = `*New Contact from bridgp.com*%0A%0A` +
            `*Name:* ${encodeURIComponent(name)}%0A` +
            `*Email:* ${encodeURIComponent(email)}%0A` +
            `*Phone:* ${encodeURIComponent(phone || 'Not provided')}%0A` +
            `*Subject:* ${encodeURIComponent(subject)}%0A%0A` +
            `*Message:*%0A${encodeURIComponent(message)}`;

        const gmailSubject = `Contact Form: ${subject} - From ${name}`;
        const gmailBody = `New contact form submission from bridgp.com%0D%0A%0D%0A` +
            `Name: ${name}%0D%0A` +
            `Email: ${email}%0D%0A` +
            `Phone: ${phone || 'Not provided'}%0D%0A` +
            `Subject: ${subject}%0D%0A%0D%0A` +
            `Message:%0D%0A${message}%0D%0A%0D%0A` +
            `----%0D%0ASent from bridgp.com contact form`;

        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=info@bridgp.com&su=${encodeURIComponent(gmailSubject)}&body=${gmailBody}`;
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        window.open(whatsappLink, '_blank');
        setTimeout(() => window.open(gmailLink, '_blank'), 800);

        showToast('Opening WhatsApp and Gmail...');

        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}
