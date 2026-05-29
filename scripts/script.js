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
    }, 700);
}

// Simple form validation for contact (if added later)
function validateForm() {
    // Placeholder for form validation
    console.log('Form validation would go here');
}

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert('Thank you for your message! I\'ll get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});
// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Dynamic year in footer
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Eason Cao. All rights reserved.`;
    }
})

// Wrap standalone numeric text nodes with <span class="num"> for MGS1 Ammo font
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
