/**
 * Ultimate China Travel Guide — Shared JavaScript
 * Handles: navigation, mobile menu, scroll effects, smooth scroll
 */
(function () {
    'use strict';

    // =========================================================================
    // Mobile Menu Toggle
    // =========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            if (menuIconOpen) menuIconOpen.classList.toggle('hidden', isHidden);
            if (menuIconClose) menuIconClose.classList.toggle('hidden', !isHidden);
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                if (menuIconOpen) menuIconOpen.classList.remove('hidden');
                if (menuIconClose) menuIconClose.classList.add('hidden');
            });
        });
    }

    // =========================================================================
    // Navbar Scroll Effect (only on pages with transparent navbar)
    // =========================================================================
    const navbar = document.getElementById('navbar');

    if (navbar && navbar.dataset.transparent === 'true') {
        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar(); // Initial check
    }

    // =========================================================================
    // Smooth scroll for anchor links with offset for fixed navbar
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = navbar ? navbar.offsetHeight : 64;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // City card interaction — scroll to city section from overview grid
    // (handled by anchor links with JS smooth scroll above)
    // =========================================================================

    // =========================================================================
    // Intersection Observer for entrance animations
    // =========================================================================
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe city guide cards
        document.querySelectorAll('.city-card, [id] section .bg-white.rounded-2xl').forEach(function (el) {
            observer.observe(el);
        });
    }

    // =========================================================================
    // Back to Top Button
    // =========================================================================
    var backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) {
        // Create the button if it doesn't exist in the HTML
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>';
        backToTopBtn.className = 'back-to-top-btn';
        document.body.appendChild(backToTopBtn);
    }

    var scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(function () {
            scrollTimeout = null;
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================================================
    // Log page load
    // =========================================================================
    console.log('Ultimate China Travel Guide — Ready');
    console.log('Current page:', document.title);

})();
