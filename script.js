// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || (hamburger && hamburger.contains(event.target));
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });

    // Smooth scroll behavior for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Add scroll animation for featured cards
    observeElements();
    // Initialize left-side custom scrollbar for featured projects
    initLeftScrollbar();
});

// Create and sync a custom left-side scrollbar for the projects pane
function initLeftScrollbar() {
    const container = document.querySelector('.featured-container');
    if (!container) return;
    const scrollEl = container.querySelector('.featured-projects-scroll');
    if (!scrollEl) return;

    // ensure container is positioned
    const computed = window.getComputedStyle(container);
    if (computed.position === 'static') container.style.position = 'relative';

    const leftBar = document.createElement('div');
    leftBar.className = 'left-scrollbar';
    const track = document.createElement('div');
    track.className = 'track';
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    track.appendChild(thumb);
    leftBar.appendChild(track);
    container.appendChild(leftBar);

    function updateThumb() {
        const trackHeight = track.clientHeight;
        const visible = scrollEl.clientHeight;
        const total = scrollEl.scrollHeight;
        const ratio = Math.min(1, visible / (total || 1));
        const thumbHeight = Math.max(24, trackHeight * ratio);
        thumb.style.height = thumbHeight + 'px';
        const maxScroll = Math.max(0, total - visible);
        const maxTop = Math.max(0, trackHeight - thumbHeight);
        const top = (scrollEl.scrollTop / (maxScroll || 1)) * maxTop;
        thumb.style.top = top + 'px';
    }

    scrollEl.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    updateThumb();

    // Drag-to-scroll
    let dragging = false;
    let startY = 0;
    let startTop = 0;

    thumb.addEventListener('pointerdown', (e) => {
        dragging = true;
        startY = e.clientY;
        startTop = parseFloat(thumb.style.top) || 0;
        thumb.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    document.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dy = e.clientY - startY;
        const trackHeight = track.clientHeight;
        const thumbHeight = thumb.clientHeight;
        const maxTop = Math.max(0, trackHeight - thumbHeight);
        const newTop = Math.max(0, Math.min(maxTop, startTop + dy));
        thumb.style.top = newTop + 'px';
        const scrollRatio = newTop / (maxTop || 1);
        scrollEl.scrollTop = scrollRatio * (scrollEl.scrollHeight - scrollEl.clientHeight);
    });

    document.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        try { thumb.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    // Click track to jump
    track.addEventListener('click', (e) => {
        if (e.target === thumb) return;
        const rect = track.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const thumbHalf = thumb.clientHeight / 2;
        const targetTop = Math.max(0, Math.min(track.clientHeight - thumb.clientHeight, clickY - thumbHalf));
        const scrollRatio = targetTop / (track.clientHeight - thumb.clientHeight || 1);
        scrollEl.scrollTop = scrollRatio * (scrollEl.scrollHeight - scrollEl.clientHeight);
    });
}

// Intersection Observer for scroll animations
function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, options);

    // Observe featured cards in scrollable section
    const featuredCards = document.querySelectorAll('.featured-card');
    featuredCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    // Close mobile menu on Escape key
    if (event.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});
