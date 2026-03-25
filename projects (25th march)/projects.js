/**
 * LuxStone Textures - Projects Page Logic (3-Page Flow)
 * Handled: dynamic rendering based on page ID, lightbox, scroll reveals, parallax.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Data separated by category
    // Only folders that actually exist are included
    const interiorData = [
        {
            title: 'Residential',
            images: [
                'ASSETS/Interior/residential/sec_65-13.jpg',
                'ASSETS/Interior/residential/sec_65-15.jpg',
                'ASSETS/Interior/residential/sec_65-20.jpg'
            ]
        },
        {
            title: 'Commercial',
            images: [
                'ASSETS/Interior/commercial/DSC07728.jpg',
                'ASSETS/Interior/commercial/DSC07748.jpg',
                'ASSETS/Interior/commercial/DSC07773.jpg',
                'ASSETS/Interior/commercial/DSC07885.jpg',
                'ASSETS/Interior/commercial/DSC07920.jpg',
                'ASSETS/Interior/commercial/DSC07937.jpg',
                'ASSETS/Interior/commercial/Soni_Saph-1.jpg',
                'ASSETS/Interior/commercial/Soni_Saph-34.jpg',
                'ASSETS/Interior/commercial/Soni_Saph-81.jpg'
            ]
        },
        {
            title: 'Office',
            images: [
                'ASSETS/Interior/offices/DSC01641.jpg',
                'ASSETS/Interior/offices/DSC01669.jpg',
                'ASSETS/Interior/offices/DSC01946.jpg'
            ]
        }
        // Note: Interior/Institutional folder does not exist — skipped
    ];

    const exteriorData = [
        {
            title: 'Residential',
            images: [
                'ASSETS/exterior/residential/DSC07597 (1).jpg',
                'ASSETS/exterior/residential/DSC07677.jpg',
                'ASSETS/exterior/residential/DSC07703.jpg',
                'ASSETS/exterior/residential/sec_10-1 (2).jpg',
                'ASSETS/exterior/residential/sec_10-15.jpg',
                'ASSETS/exterior/residential/sec_10-2.jpg',
                'ASSETS/exterior/residential/sec_2_Site_1-3.jpg',
                'ASSETS/exterior/residential/sec_2_Site_1-7.jpg',
                'ASSETS/exterior/residential/sec_2_Site_1-8.jpg',
                'ASSETS/exterior/residential/sec_2_Site_2-12.jpg',
                'ASSETS/exterior/residential/sec_2_Site_2-3.jpg',
                'ASSETS/exterior/residential/sec_2_Site_2-6.jpg'
            ]
        },
        {
            title: 'Commercial',
            images: [
                'ASSETS/exterior/commercial/DSC05795.jpg',
                'ASSETS/exterior/commercial/DSC05811.jpg',
                'ASSETS/exterior/commercial/DSC05819.jpg'
            ]
        },
        {
            title: 'Institutional',
            images: [
                'ASSETS/exterior/Institutional/luxstone-17.jpg',
                'ASSETS/exterior/Institutional/luxstone-3.jpg',
                'ASSETS/exterior/Institutional/luxstone-9.jpg'
            ]
        },
        {
            title: 'Office',
            images: [
                'ASSETS/exterior/offices/PROPERTY_MASTER-2.jpg',
                'ASSETS/exterior/offices/PROPERTY_MASTER-65.jpg',
                'ASSETS/exterior/offices/PROPERTY_MASTER-76.jpg'
            ]
        }
    ];

    const container = document.getElementById('projects-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const bodyId = document.body.id;

    function getColumns() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function renderCategoryPage(dataArray, mainCategoryName) {
        if (!container) return;

        dataArray.forEach(sub => {
            const subWrap = document.createElement('div');
            subWrap.classList.add('subcategory-wrap');

            const subTitle = document.createElement('h3');
            subTitle.classList.add('subcategory-title', 'reveal-hidden');
            subTitle.textContent = sub.title;
            subWrap.appendChild(subTitle);

            const grid = document.createElement('div');
            grid.classList.add('projects-grid');

            sub.images.forEach((imgSrc, index) => {
                const card = document.createElement('div');
                card.classList.add('project-card', 'reveal-hidden');
                
                // Stagger delay based on column index
                const cols = getColumns();
                const colIndex = index % cols;
                card.style.transitionDelay = `${colIndex * 0.15}s`;

                // Use image directly (no separate thumbnail)
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `LuxStone ${mainCategoryName} ${sub.title} Portfolio ${index + 1}`;
                img.loading = 'lazy'; 

                // Hover Overlay Elements
                const overlay = document.createElement('div');
                overlay.classList.add('card-overlay');
                
                const title = document.createElement('h4');
                title.classList.add('card-title');
                title.textContent = `LuxStone ${sub.title}`;
                
                const cat = document.createElement('p');
                cat.classList.add('card-category');
                cat.textContent = mainCategoryName;
                
                overlay.appendChild(title);
                overlay.appendChild(cat);

                // Border Element
                const accent = document.createElement('div');
                accent.classList.add('card-border-accent');

                // Click event for Lightbox
                card.addEventListener('click', () => {
                    openLightbox(imgSrc);
                });

                card.appendChild(img);
                card.appendChild(overlay);
                card.appendChild(accent);
                grid.appendChild(card);
            });

            subWrap.appendChild(grid);
            container.appendChild(subWrap);
        });
    }

    // Determine what to render based on page ID
    if (bodyId === 'page-interior') {
        renderCategoryPage(interiorData, 'Interior');
    } else if (bodyId === 'page-exterior') {
        renderCategoryPage(exteriorData, 'Exterior');
    }
    // Landing page (no ID or irrelevant ID) doesn't render grid dynamically.

    // Initialize Animations globally for all pages
    initScrollReveals();
    initParallax();

    /* --- Scroll & Parallax Logic --- */
    
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal-hidden');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));
    }

    function initParallax() {
        const parallaxEls = document.querySelectorAll('.parallax-element');
        if (parallaxEls.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxEls.forEach(el => {
                const speed = 0.1;
                el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });
        });
    }


    /* --- Lightbox Logic --- */
    
    function openLightbox(src) {
        if (!lightbox) return;
        const img = new Image();
        img.onload = () => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        img.src = src;
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 300);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Optional: Recalculate delays on resize if column count changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculating staggered layout could go here
        }, 250);
    });
});
