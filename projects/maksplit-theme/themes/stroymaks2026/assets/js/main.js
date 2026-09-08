/**
 * StroyMaks 2026 — Main JS
 *
 * Concrete Steel design system. Steel Blue #3B5F8A accent.
 * Handles: mobile menu toggle, scroll reveal, filter buttons,
 * color swatch picker, lead form validation.
 *
 * @package stroymaks2026
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // Scroll reveal animation
    // ═══════════════════════════════════════════════════════════
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Catalog filter buttons
    // ═══════════════════════════════════════════════════════════
    function initFilterButtons() {
        var buttons = document.querySelectorAll('.filter-tab');
        var cards = document.querySelectorAll('[data-category]');

        if (!buttons.length || !cards.length) return;

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Update active state
                buttons.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                var category = btn.getAttribute('data-filter');

                // Filter cards
                cards.forEach(function(card) {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Color swatch picker (product page)
    // ═══════════════════════════════════════════════════════════
    function initColorSwatches() {
        var swatches = document.querySelectorAll('.color-swatch');
        if (!swatches.length) return;

        var priceEl = document.getElementById('product-price');
        var labelEl = document.getElementById('variant-label');

        swatches.forEach(function(swatch) {
            swatch.addEventListener('click', function() {
                // Update active state
                swatches.forEach(function(s) {
                    s.classList.remove('active');
                    s.setAttribute('aria-checked', 'false');
                });
                swatch.classList.add('active');
                swatch.setAttribute('aria-checked', 'true');

                // Update price
                var price = swatch.getAttribute('data-price');
                var label = swatch.getAttribute('data-label');
                if (priceEl) priceEl.textContent = price;
                if (labelEl) labelEl.textContent = label;
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Product gallery thumbnails
    // ═══════════════════════════════════════════════════════════
    function initProductGallery() {
        var thumbs = document.querySelectorAll('.thumb-btn');
        var mainPhoto = document.getElementById('main-photo');
        if (!thumbs.length || !mainPhoto) return;

        thumbs.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                thumbs.forEach(function(t) {
                    t.classList.remove('active');
                    t.setAttribute('aria-current', 'false');
                });
                thumb.classList.add('active');
                thumb.setAttribute('aria-current', 'true');

                var src = thumb.getAttribute('data-src');
                var alt = thumb.getAttribute('data-alt');
                if (src) mainPhoto.src = src;
                if (alt) mainPhoto.alt = alt;
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Init on DOM ready
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', function() {
        initScrollReveal();
        initFilterButtons();
        initColorSwatches();
        initProductGallery();
    });

})();