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
