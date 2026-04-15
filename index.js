/**
 * LuxStone Textures — Projects Page Logic
 * Handles: dynamic rendering, project headings, YouTube cards,
 *          thumbnail-first loading, skeleton placeholders, lightbox,
 *          scroll reveals, parallax.
 *
 * DATA STRUCTURE:
 *   Each subsection has a `title` and `projects` array.
 *   Each project has a `name`, `images` array, and an optional `youtube` URL.
 *
 *   To add a YouTube video to a project, paste the full YouTube URL in the
 *   `youtube` field below. Leave as empty string '' if not needed.
 */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // DATA — Interior
    // -------------------------------------------------------------------------
    const interiorData = [
         {
            title: 'Commercial',
            projects: [
                {
                    name: 'Soni Sapphire, Chhatarpur',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/Interior/commercial/Soni Sapphire, Chhatarpur/DSC07728.jpg',
                        'ASSETS/Interior/commercial/Soni Sapphire, Chhatarpur/DSC07748.jpg',
                        'ASSETS/Interior/commercial/Soni Sapphire, Chhatarpur/DSC07773.jpg'
                    ]
                },
                {
                    name: 'Pot Belly, Hauz Khas',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/Interior/commercial/Pot Belly, Hauz Khas/DSC07885.jpg',
                        'ASSETS/Interior/commercial/Pot Belly, Hauz Khas/DSC07920.jpg',
                        'ASSETS/Interior/commercial/Pot Belly, Hauz Khas/DSC07937.jpg'
                    ]
                },
                {
                    name: 'Soni Sapphire, Rajouri Garden',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/Interior/commercial/Soni Sapphire, Rajouri Garden/Soni_Saph-1.jpg',
                        'ASSETS/Interior/commercial/Soni Sapphire, Rajouri Garden/Soni_Saph-34.jpg',
                        'ASSETS/Interior/commercial/Soni Sapphire, Rajouri Garden/Soni_Saph-81.jpg'
                    ]
                }
            ]
        },
        {
            title: 'Residential',
            projects: [
                {
                    name: 'Sector 65, Gurugram',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/Interior/residential/sec_65-13.jpg',
                        'ASSETS/Interior/residential/sec_65-15.jpg',
                        'ASSETS/Interior/residential/sec_65-20.jpg'
                    ]
                }
            ]
        },
        {
            title: 'Offices',
            projects: [
                {
                    name: 'Jawa Bikes, Headquarters',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/Interior/offices/Jawa Bikes, Headquaters/DSC01641.jpg',
                        'ASSETS/Interior/offices/Jawa Bikes, Headquaters/DSC01669.jpg',
                        'ASSETS/Interior/offices/Jawa Bikes, Headquaters/DSC01946.jpg'
                    ]
                }
            ]
        }
    ];

    // -------------------------------------------------------------------------
    // DATA — Exterior
    // -------------------------------------------------------------------------
    const exteriorData = [
        {
            title: 'Commercial',
            projects: [
                {
                    name: 'Farmhouse, Sohna Road',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/exterior/commercial/Farmhouse, Sohna Road/DSC05795.jpg',
                        'ASSETS/exterior/commercial/Farmhouse, Sohna Road/DSC05811.jpg',
                        'ASSETS/exterior/commercial/Farmhouse, Sohna Road/DSC05819.jpg'
                    ]
                }
            ]
        },
        {
            title: 'Institutional',
            projects: [
                {
                    name: 'Homerton Grammar School, Faridabad',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/exterior/Institutional/Homerton Grammar School, Faridabad/luxstone-17.jpg',
                        'ASSETS/exterior/Institutional/Homerton Grammar School, Faridabad/luxstone-3.jpg',
                        'ASSETS/exterior/Institutional/Homerton Grammar School, Faridabad/luxstone-9.jpg'
                    ]
                }
            ]
        },
        {
            title: 'Offices',
            projects: [
                {
                    name: 'Property Master, Faridabad',
                    youtube: '',  // ← paste YouTube link here
                    images: [
                        'ASSETS/exterior/offices/Property Master, Faridabad/PROPERTY_MASTER-2.jpg',
                        'ASSETS/exterior/offices/Property Master, Faridabad/PROPERTY_MASTER-65.jpg',
                        'ASSETS/exterior/offices/Property Master, Faridabad/PROPERTY_MASTER-76.jpg'
                    ]
                }
            ]
        },
        {
            title: 'Residential',
            projects: [
                {
                    name: 'Residential Projects',
                    youtube: '',  // ← paste YouTube link here
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
                }
            ]
        }
    ];

    // -------------------------------------------------------------------------
    // DOM refs
    // -------------------------------------------------------------------------
    const container   = document.getElementById('projects-container');
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const bodyId      = document.body.id;

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    function getColumns() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768)  return 2;
        return 1;
    }

    /** Convert an original image path to its WebP thumbnail path */
    function thumbPath(src) {
        // Replace 'ASSETS/' with 'ASSETS/thumbs/' and swap extension to .webp
        return src.replace(/^ASSETS\//, 'ASSETS/thumbs/').replace(/\.[^.]+$/, '.webp');
    }

    /** Extract YouTube video ID from a URL */
    function ytVideoId(url) {
        if (!url) return null;
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/\s]+)/);
        return match ? match[1] : null;
    }

    // -------------------------------------------------------------------------
    // Card factory — image card
    // -------------------------------------------------------------------------
    function createImageCard(imgSrc, fullSrc, alt, cardTitleText, cardCategoryText, colIndex, isEager) {
        const card = document.createElement('div');
        card.classList.add('project-card', 'reveal-hidden', 'skeleton');
        card.style.transitionDelay = `${colIndex * 0.12}s`;

        // Store full-res path for lightbox
        card.dataset.fullsrc = fullSrc;

        const img = document.createElement('img');
        img.src = imgSrc;              // thumbnail
        img.alt = alt;
        img.loading = isEager ? 'eager' : 'lazy';

        // Remove skeleton once thumbnail loads
        img.addEventListener('load', () => card.classList.remove('skeleton'), { once: true });

        const overlay = document.createElement('div');
        overlay.classList.add('card-overlay');

        const titleEl = document.createElement('h4');
        titleEl.classList.add('card-title');
        titleEl.textContent = cardTitleText;

        const catEl = document.createElement('p');
        catEl.classList.add('card-category');
        catEl.textContent = cardCategoryText;

        overlay.appendChild(titleEl);
        overlay.appendChild(catEl);

        const accent = document.createElement('div');
        accent.classList.add('card-border-accent');

        card.addEventListener('click', () => openLightbox(fullSrc));

        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(accent);
        return card;
    }

    // -------------------------------------------------------------------------
    // Card factory — YouTube card
    // -------------------------------------------------------------------------
    function createYouTubeCard(youtubeUrl, colIndex) {
        const videoId = ytVideoId(youtubeUrl);
        if (!videoId) return null;

        const card = document.createElement('div');
        card.classList.add('project-card', 'youtube-card', 'reveal-hidden', 'skeleton');
        card.style.transitionDelay = `${colIndex * 0.12}s`;

        const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        const img = document.createElement('img');
        img.src = thumbUrl;
        img.alt = 'Watch on YouTube';
        img.loading = 'lazy';
        img.addEventListener('load', () => card.classList.remove('skeleton'), { once: true });

        // Play icon overlay
        const playOverlay = document.createElement('div');
        playOverlay.classList.add('play-icon-overlay');
        playOverlay.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#FF0000" opacity="0.9"/>
                <polygon points="26,20 26,44 46,32" fill="white"/>
            </svg>`;

        // YouTube badge
        const badge = document.createElement('span');
        badge.classList.add('yt-badge');
        badge.textContent = 'Watch on YouTube';

        card.addEventListener('click', () => window.open(youtubeUrl, '_blank', 'noopener'));

        card.appendChild(img);
        card.appendChild(playOverlay);
        card.appendChild(badge);
        return card;
    }

    // -------------------------------------------------------------------------
    // Main renderer
    // -------------------------------------------------------------------------
    function renderCategoryPage(dataArray, mainCategoryName) {
        if (!container) return;

        let globalImageIndex = 0; // used to identify above-the-fold images

        dataArray.forEach((sub, subIdx) => {

            // ── Subsection wrapper ──────────────────────────────────────────
            const subWrap = document.createElement('div');
            subWrap.classList.add('subcategory-wrap');

            const subTitle = document.createElement('h3');
            subTitle.classList.add('subcategory-title', 'reveal-hidden');
            subTitle.textContent = sub.title;
            subWrap.appendChild(subTitle);

            // ── Projects loop ───────────────────────────────────────────────
            sub.projects.forEach((project, projIdx) => {

                // Divider between projects (not before the first)
                if (projIdx > 0) {
                    const divider = document.createElement('div');
                    divider.classList.add('project-divider');
                    subWrap.appendChild(divider);
                }

                // Project group container
                const projectGroup = document.createElement('div');
                projectGroup.classList.add('project-group');

                // Project name heading
                const projectTitle = document.createElement('p');
                projectTitle.classList.add('project-group-title', 'reveal-hidden');
                projectTitle.textContent = project.name;
                projectGroup.appendChild(projectTitle);

                // Image grid
                const grid = document.createElement('div');
                grid.classList.add('projects-grid');

                const initialImages   = project.images.slice(0, 3);
                const remainingImages = project.images.slice(3);

                // Render first 3 images
                initialImages.forEach((imgSrc, idx) => {
                    const cols     = getColumns();
                    const colIndex = idx % cols;
                    const isEager  = globalImageIndex < 3; // first 3 images on page = eager
                    const full     = imgSrc;
                    const thumb    = thumbPath(imgSrc);
                    const alt      = `${project.name} — ${mainCategoryName} ${idx + 1}`;
                    const cardTitleText = `LuxStone ${sub.title}`;
                    const cardCategoryText = mainCategoryName;
                    const card     = createImageCard(thumb, full, alt, cardTitleText, cardCategoryText, colIndex, isEager);
                    grid.appendChild(card);
                    globalImageIndex++;
                });

                projectGroup.appendChild(grid);

                // Show More (if > 3 images in a project)
                if (remainingImages.length > 0) {
                    const btnWrap = document.createElement('div');
                    btnWrap.classList.add('show-more-wrap', 'reveal-hidden');

                    const btn = document.createElement('button');
                    btn.classList.add('btn-show-more');
                    btn.textContent = `Show More (+${remainingImages.length})`;

                    btn.addEventListener('click', () => {
                        remainingImages.forEach((imgSrc, idx) => {
                            const cols     = getColumns();
                            const colIndex = (idx + 3) % cols;
                            const full     = imgSrc;
                            const thumb    = thumbPath(imgSrc);
                            const alt      = `${project.name} — ${mainCategoryName} ${idx + 4}`;
                            const cardTitleText = `LuxStone ${sub.title}`;
                            const cardCategoryText = mainCategoryName;
                            const card     = createImageCard(thumb, full, alt, cardTitleText, cardCategoryText, colIndex, false);
                            grid.appendChild(card);
                            setTimeout(() => card.classList.add('reveal-visible'), 50);
                        });
                        btnWrap.remove();
                    });

                    btnWrap.appendChild(btn);
                    projectGroup.appendChild(btnWrap);
                }

                // YouTube card (optional 4th card)
                if (project.youtube) {
                    const cols     = getColumns();
                    const colIndex = initialImages.length % cols;
                    const ytCard   = createYouTubeCard(project.youtube, colIndex);
                    if (ytCard) grid.appendChild(ytCard);
                }

                subWrap.appendChild(projectGroup);
            });

            container.appendChild(subWrap);
        });

        initScrollReveals();
    }

    // -------------------------------------------------------------------------
    // Page routing
    // -------------------------------------------------------------------------
    if (bodyId === 'page-interior') {
        renderCategoryPage(interiorData, 'Interior');
    } else if (bodyId === 'page-exterior') {
        renderCategoryPage(exteriorData, 'Exterior');
    }

    // Parallax and reveals run on all pages
    initScrollReveals();
    initParallax();

    /* ========================================================================
       SCROLL REVEAL
       ====================================================================== */
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
            threshold: 0.08
        });

        revealElements.forEach(el => observer.observe(el));
    }

    /* ========================================================================
       PARALLAX
       ====================================================================== */
    function initParallax() {
        const parallaxEls = document.querySelectorAll('.parallax-element');
        if (parallaxEls.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxEls.forEach(el => {
                el.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
            });
        }, { passive: true });
    }

    /* ========================================================================
       LIGHTBOX — loads full-resolution image on open
       ====================================================================== */
    function openLightbox(fullSrc) {
        if (!lightbox) return;
        lightboxImg.src = '';
        lightboxImg.style.opacity = '0';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        const img = new Image();
        img.onload = () => {
            lightboxImg.src = fullSrc;
            lightboxImg.style.opacity = '1';
        };
        img.src = fullSrc;
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) lightboxImg.src = '';
        }, 300);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

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

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { /* could re-init stagger */ }, 250);
    });
});
