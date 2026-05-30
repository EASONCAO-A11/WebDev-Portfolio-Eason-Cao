// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add fade-in animation to sections on scroll without risking hidden content.
// The content stays visible by default, then enhanced browsers get a small motion effect.
const sections = document.querySelectorAll('section');
const revealSection = (section) => {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
};

sections.forEach(section => {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealSection(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0.01';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });

    // Fallback for browsers or embedded previews that do not fire observers promptly.
    window.setTimeout(() => {
        sections.forEach(revealSection);
    }, 3000); // 3s timeout to reduce risk of flash
}

// ===== Navigation: highlight current page =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});

// ===== Contact Form =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Success (for now — add a real backend or Formspree later)
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }
});

// ===== Click effect on project cards =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// ===== Dynamic year in footer =====
document.addEventListener('DOMContentLoaded', function() {
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Eason Cao. All rights reserved.`;
    }
});

// ===== Wrap standalone numeric text nodes with <span class="num"> for MGS1 Ammo font =====
document.addEventListener('DOMContentLoaded', function() {
    function wrapNumbers(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        nodes.forEach(textNode => {
            const text = textNode.nodeValue.trim();
            // match integers or decimals (e.g., 42 or 3.14)
            if (/^\d+(?:\.\d+)?$/.test(text)) {
                const parent = textNode.parentNode;
                // skip if already wrapped or inside tags we shouldn't touch
                const forbidden = ['A','BUTTON','INPUT','TEXTAREA','SELECT','CODE','PRE','SCRIPT','STYLE','SVG'];
                if (parent && forbidden.includes(parent.nodeName)) return;
                const span = document.createElement('span');
                span.className = 'num';
                span.textContent = text;
                parent.replaceChild(span, textNode);
            }
        });
    }

    wrapNumbers(document.body);
});

// ===== Accessibility: top bar, colorblind, narrator(TTS), translate(EN/中文) =====
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    // Top bar collapse toggle (in case HTML exists)
    const accToggle = document.getElementById('acc-toggle');
    const accPanel = document.getElementById('accessibility-panel');

    function setPanelOpen(open) {
        if (!accPanel || !accToggle) return;
        accPanel.classList.toggle('open', open);
        accToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (accToggle) {
        accToggle.addEventListener('click', () => {
            const isOpen = accPanel && accPanel.classList.contains('open');
            setPanelOpen(!isOpen);
        });
    }

    // Mode toggles
    const modeButtons = document.querySelectorAll('[data-acc-mode]');
    const stopBtn = document.getElementById('acc-tts-stop');

    const LS = {
        cb: 'acc_mode_cb',
        narrator: 'acc_mode_narrator',
        translate: 'acc_mode_translate',
        lang: 'acc_lang'
    };

    const applyMode = () => {
        const cbOn = localStorage.getItem(LS.cb) === '1';
        const cbVariant = localStorage.getItem('acc_cb_variant') || 'green';
        const narrator = localStorage.getItem(LS.narrator) === '1';
        const translate = localStorage.getItem(LS.translate) === '1';

        // Color-blind variants: red/green/blue + full-screen overlay
        root.classList.toggle('cb-mode', cbOn);
        root.classList.remove('cb-mode', 'cb-mode.red', 'cb-mode.green', 'cb-mode.blue');
        if (cbOn) root.classList.add('cb-mode', `cb-mode.${cbVariant}`);

        root.classList.toggle('narrator-mode', narrator);
        root.classList.toggle('translated-active', translate);


        // Update aria-pressed
        modeButtons.forEach(btn => {
            const m = btn.getAttribute('data-acc-mode');
            let pressed = (m === 'narrator' && narrator) || (m === 'translate' && translate);
            const cbVariant = localStorage.getItem('acc_cb_variant') || 'green';
            if (!pressed) {
                if (m === 'cb') pressed = cb;
                if (m === 'cb_red') pressed = cb && cbVariant === 'red';
                if (m === 'cb_green') pressed = cb && cbVariant === 'green';
                if (m === 'cb_blue') pressed = cb && cbVariant === 'blue';
            }


            btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        });
    };

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const m = btn.getAttribute('data-acc-mode');
            if (!m) return;

            if (m === 'cb' || m === 'cb_cycle' || m === 'cb_red' || m === 'cb_green' || m === 'cb_blue') {
                // cycle: none -> green -> blue -> red -> none
                const order = ['none','green','blue','red','gray'];
                const cbOnNow = localStorage.getItem(LS.cb) === '1';
                const currentRaw = cbOnNow ? (localStorage.getItem('acc_cb_variant') || 'green') : 'none';
                const idx = order.indexOf(currentRaw);
                const next = order[(idx + 1) % order.length];

                if (next === 'none') {
                    localStorage.setItem(LS.cb, '0');
                } else {
                    localStorage.setItem(LS.cb, '1');
                    localStorage.setItem('acc_cb_variant', next);
                }
            } else if (m === 'narrator') {
                const next = !(localStorage.getItem(LS.narrator) === '1');
                localStorage.setItem(LS.narrator, next ? '1' : '0');
            } else if (m === 'translate') {
                const next = !(localStorage.getItem(LS.translate) === '1');
                localStorage.setItem(LS.translate, next ? '1' : '0');
                localStorage.setItem(LS.lang, next ? 'zh' : 'en');
            }


            applyMode();
            if (m === 'narrator') {
                if (!(localStorage.getItem(LS.narrator) === '1')) stopNarration();
                else speakMain();
            }
        });
    });

    // Translation: store original in .original-text/.translated-text wrappers (lightweight)
    // Strategy: wrap common UI labels + page headings/intro/paragraphs within #accessibility and others via a small dictionary.
    const dict = {
        'Accessibility Statement': '无障碍声明',
        'Our Commitment': '我们的承诺',
        'Accessibility Features Implemented': '已实现的无障碍功能',
        'Screen Reader Support': '屏幕阅读器支持',
        'Browser Compatibility': '浏览器兼容性',
        'Accessibility Resources Used': '使用的无障碍资源',
        'Feedback and Improvements': '反馈与改进',
        'Contact me': '联系我',
        'Colorblind mode': '色盲模式',
        'Narrator mode': '叙述者模式',
        'Translate: EN / 中文': '翻译：EN / 中文',
        'Stop Narrator': '停止朗读',
        'My Portfolio': '我的作品集',
        'Here are some of my projects and work that demonstrate my skills in web development, programming, and filmmaking.': '以下是一些展示我在网页开发、编程与影像制作方面能力的项目与作品。',
        'My Projects': '我的项目',
        'Contact Me': '联系我'
    };

    function ensureTranslationWrappers() {
        // Wrap only text nodes in a few likely containers to reduce DOM complexity.
        const candidates = document.querySelectorAll('h1, h2, p, a, li');
        candidates.forEach(el => {
            // Skip if already wrapped
            if (el.classList && el.classList.contains('translated-text')) return;
            const original = el.textContent.trim();
            if (!original) return;

            if (dict[original]) {
                const spanOriginal = document.createElement('span');
                spanOriginal.className = 'original-text';
                spanOriginal.textContent = original;

                const spanTranslated = document.createElement('span');
                spanTranslated.className = 'translated-text';
                spanTranslated.textContent = dict[original];

                el.textContent = '';
                el.appendChild(spanOriginal);
                el.appendChild(spanTranslated);
            }
        });

        // Set initial language visibility
        applyMode();
    }

    // Narrator (TTS)
    let currentUtterance = null;

    function pickVoice(langWanted) {
        const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        if (!voices || !voices.length) return null;
        const exact = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langWanted));
        return exact || voices[0] || null;
    }

    function getNarrationText() {
        // Prefer currently visible main content; fallback to section
        const section = document.querySelector('main, section, #accessibility') || document.body;
        const text = section.innerText || '';
        return text.trim().slice(0, 2500); // keep it reasonable
    }

    function stopNarration() {
        try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        } catch (e) {}
        currentUtterance = null;
    }

    function speakMain() {
        if (!window.speechSynthesis) return;
        stopNarration();

        const translateOn = localStorage.getItem(LS.translate) === '1';
        const lang = translateOn ? 'zh' : 'en';
        const langWanted = lang === 'zh' ? 'zh' : 'en';

        const utter = new SpeechSynthesisUtterance(getNarrationText());
        utter.rate = 1.0;
        utter.pitch = 1.0;
        utter.lang = langWanted === 'zh' ? 'zh-CN' : 'en-US';

        const voice = pickVoice(langWanted === 'zh' ? 'zh' : 'en');
        if (voice) utter.voice = voice;

        currentUtterance = utter;
        window.speechSynthesis.speak(utter);
    }

    // Apply saved settings on load
    applyMode();
    ensureTranslationWrappers();

    // If narrator enabled persistently, start speaking once
    const narratorOn = localStorage.getItem(LS.narrator) === '1';
    if (narratorOn) {
        // voices list sometimes loads async; call speak after a moment
        window.setTimeout(() => speakMain(), 400);
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            stopNarration();
        });
    }
});

