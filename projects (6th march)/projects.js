/**
 * LuxStone Textures - Projects Page Logic
 * Handled: dynamic rendering, lightbox, scroll reveal animations, parallax headers.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const projectsData = [
        {
            mainCategory: 'Interior',
            subcategories: [
                {
                    title: 'Residential',
                    images: [
                        'ASSETS/Interior/residential/luxstone-1.webp',
                        'ASSETS/Interior/residential/luxstone-4.webp',
                        'ASSETS/Interior/residential/luxstone-14.webp',
                        'ASSETS/Interior/residential/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Commercial',
                    images: [
                        'ASSETS/Interior/commercial/luxstone-1.webp',
                        'ASSETS/Interior/commercial/luxstone-4.webp',
                        'ASSETS/Interior/commercial/luxstone-14.webp',
                        'ASSETS/Interior/commercial/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Institutional',
                    images: [
                        'ASSETS/Interior/Institutional/luxstone-1.webp',
                        'ASSETS/Interior/Institutional/luxstone-4.webp',
                        'ASSETS/Interior/Institutional/luxstone-14.webp',
                        'ASSETS/Interior/Institutional/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Offices',
                    images: [
                        'ASSETS/Interior/offices/luxstone-1.webp',
                        'ASSETS/Interior/offices/luxstone-4.webp',
                        'ASSETS/Interior/offices/luxstone-14.webp',
                        'ASSETS/Interior/offices/luxstone-17.webp'
                    ]
                }
            ]
        },
        {
            mainCategory: 'Exterior',
            subcategories: [
                {
                    title: 'Residential',
                    images: [
                        'ASSETS/exterior/residential/luxstone-1.webp',
                        'ASSETS/exterior/residential/luxstone-4.webp',
                        'ASSETS/exterior/residential/luxstone-14.webp',
                        'ASSETS/exterior/residential/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Commercial',
                    images: [
                        'ASSETS/exterior/commercial/luxstone-1.webp',
                        'ASSETS/exterior/commercial/luxstone-4.webp',
                        'ASSETS/exterior/commercial/luxstone-14.webp',
                        'ASSETS/exterior/commercial/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Institutional',
                    images: [
                        'ASSETS/exterior/Institutional/luxstone-1.webp',
                        'ASSETS/exterior/Institutional/luxstone-4.webp',
                        'ASSETS/exterior/Institutional/luxstone-14.webp',
                        'ASSETS/exterior/Institutional/luxstone-17.webp'
                    ]
                },
                {
                    title: 'Offices',
                    images: [
                        'ASSETS/exterior/offices/luxstone-1.webp',
                        'ASSETS/exterior/offices/luxstone-4.webp',
                        'ASSETS/exterior/offices/luxstone-14.webp',
                        'ASSETS/exterior/offices/luxstone-17.webp'
                    ]
                }
            ]
        }
    ];

    const container = document.getElementById('projects-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Grid columns count varies by screen size for staggered animation.
    function getColumns() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function renderProjects() {
        if (!container) return;
        
        projectsData.forEach(section => {
            
            const sectionEl = document.createElement('section');
            sectionEl.classList.add('category-section');
            
            const sectionTitle = document.createElement('h2');
            sectionTitle.classList.add('section-title', 'parallax-element');
            sectionTitle.textContent = section.mainCategory;
            sectionEl.appendChild(sectionTitle);

            section.subcategories.forEach(sub => {
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
                    
                    // Add column-based stagger delay
                    const cols = getColumns();
                    const colIndex = index % cols;
                    card.style.transitionDelay = `${colIndex * 0.15}s`;

                    // Generate thumbnail src
                    const thumbSrc = imgSrc.replace('.webp', '-thumb.webp');
                    const img = document.createElement('img');
                    img.src = thumbSrc;
                    img.alt = `LuxStone ${section.mainCategory} ${sub.title} Portfolio ${index + 1}`;
                    img.loading = 'lazy'; 

                    // Overlay Elements
                    const overlay = document.createElement('div');
                    overlay.classList.add('card-overlay');
                    
                    const title = document.createElement('h4');
                    title.classList.add('card-title');
                    title.textContent = `LuxStone ${sub.title}`;
                    
                    const cat = document.createElement('p');
                    cat.classList.add('card-category');
                    cat.textContent = `${section.mainCategory}`;
                    
                    overlay.appendChild(title);
                    overlay.appendChild(cat);

                    // Border accent
                    const accent = document.createElement('div');
                    accent.classList.add('card-border-accent');

                    // Click handler
                    card.addEventListener('click', () => {
                        openLightbox(imgSrc);
                    });

                    card.appendChild(img);
                    card.appendChild(overlay);
                    card.appendChild(accent);
                    grid.appendChild(card);
                });

                subWrap.appendChild(grid);
                sectionEl.appendChild(subWrap);
            });

            container.appendChild(sectionEl);
        });
        
        initScrollReveals();
        initParallax();
    }

    /* SCROLL REVEAL (Intersection Observer) */
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal-hidden');
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    // Stop observing once revealed
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger slightly above viewport bottom
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));
    }

    /* PARALLAX EFFECT */
    function initParallax() {
        const parallaxEls = document.querySelectorAll('.parallax-element');
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxEls.forEach(el => {
                const speed = 0.1;
                el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });
        });
    }

    function openLightbox(src) {
        const img = new Image();
        img.onload = () => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        img.src = src;
    }

    function closeLightbox() {
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
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    renderProjects();
});

// Optional: recalculate delays on resize if column count changes
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // simple stub for resize, full app might recalculate staggering dynamically
    }, 250);
});
