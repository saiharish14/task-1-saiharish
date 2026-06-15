// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = document.querySelector('.site-header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            closeMobileMenu();
        }
    });
});

// Mobile hamburger menu
const hamburger = document.querySelector('.hamburger');
const mainNavigation = document.querySelector('.main-navigation');

function closeMobileMenu() {
    if (!hamburger || !mainNavigation) return;
    hamburger.classList.remove('active');
    mainNavigation.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

if (hamburger && mainNavigation) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mainNavigation.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    });

    document.addEventListener('click', (e) => {
        if (
            mainNavigation.classList.contains('active') &&
            !mainNavigation.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Active navigation highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;

    let currentSection = 'home';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });
setActiveNavLink();

// Contact form handling
const contactForm = document.getElementById('contact-form');
const successPopup = document.getElementById('success-popup');
const successPopupClose = document.getElementById('success-popup-close');

function showSuccessPopup() {
    if (!successPopup) return;
    successPopup.hidden = false;
    requestAnimationFrame(() => {
        successPopup.classList.add('active');
    });
    document.body.classList.add('menu-open');
    successPopupClose?.focus();
}

function hideSuccessPopup() {
    if (!successPopup) return;
    successPopup.classList.remove('active');
    document.body.classList.remove('menu-open');
    setTimeout(() => {
        successPopup.hidden = true;
    }, 300);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');

        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const messageValue = message.value.trim();

        if (!nameValue || !emailValue || !messageValue) {
            alert('Please complete all fields before sending your message.');
            return;
        }

        contactForm.reset();
        showSuccessPopup();
    });
}

if (successPopupClose) {
    successPopupClose.addEventListener('click', hideSuccessPopup);
}

if (successPopup) {
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            hideSuccessPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successPopup.classList.contains('active')) {
            hideSuccessPopup();
        }
    });
}
