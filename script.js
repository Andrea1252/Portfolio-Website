document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 1.2 Auto-scroll to align Project Hero bottom with screen bottom
    // Triggers on project pages (heropages) for Desktop/Tablet only
    const projectHero = document.querySelector('.project-hero-image');
    if (projectHero && window.innerWidth > 768) {
        setTimeout(() => {
            const heroBottom = projectHero.getBoundingClientRect().bottom + window.scrollY;
            const target = heroBottom - window.innerHeight;
            if (target > 0) {
                lenis.scrollTo(target, {
                    duration: 1.5,
                    easing: (t) => 1 - Math.pow(1 - t, 3)
                });
            }
        }, 600);
    }

    // 1.5 Header scroll behavior (Hide on scroll down, show on scroll up)
    const navbar = document.querySelector('.navbar');
    const projectHeader = document.querySelector('.project-header');
    const workSection = document.querySelector('.work-section');
    const carouselScrollSection = document.getElementById('scroll-carousel');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const isMobileOrTablet = window.innerWidth <= 1024;
        let canHide = true;
        let forceHide = false;

        if (isMobileOrTablet) {
            // On mobile/tablet, don't hide navbar until content reaches it
            const triggerElement = projectHeader || workSection;
            if (triggerElement) {
                const rect = triggerElement.getBoundingClientRect();
                if (rect.top > 70) {
                    canHide = false;
                }
            }
        }

        // NEW: Disable navbar show on scroll up for carousel section
        if (carouselScrollSection) {
            const rect = carouselScrollSection.getBoundingClientRect();
            // If the carousel is currently sticky/in-view
            if (rect.top <= 0 && rect.bottom >= 0) {
                forceHide = true;
            }
        }

        if (window.scrollY > lastScrollY && window.scrollY > 100 && canHide) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else if (forceHide) {
            // Force hidden even when scrolling up
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Hero Slideshow Logic
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length > 0) {
        // Pick a random starting slide
        let currentSlide = Math.floor(Math.random() * slides.length);

        // Initialize the random starting slide
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        function updateIndicators(index) {
            indicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // Initial indicator sync
        updateIndicators(currentSlide);

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            updateIndicators(currentSlide);
        }

        // Change slide every 1.5 seconds
        setInterval(nextSlide, 1500);
    }

    // 4. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0);
        });
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 6. Expandable Process Logic
    const unfoldBtn = document.getElementById('unfold-process');
    const processWrapper = document.querySelector('.expandable-process-wrapper');
    if (unfoldBtn && processWrapper) {
        unfoldBtn.addEventListener('click', () => {
            const isExpanding = !processWrapper.classList.contains('active');
            processWrapper.classList.toggle('active');

            if (isExpanding) {
                // Scroll to show the start of the process content
                setTimeout(() => {
                    lenis.scrollTo(processWrapper, {
                        offset: 0,
                        duration: 1.5
                    });
                }, 150);
            } else {
                lenis.scrollTo(processWrapper, { offset: -100 });
            }
        });
    }

    // 7. Pause Boghylde video on mobile
    const boghyldeVideo = document.querySelector('a[href*="boghylde"] video');
    if (boghyldeVideo && window.innerWidth <= 768) {
        boghyldeVideo.removeAttribute('autoplay');
        boghyldeVideo.pause();
    }

    // 8. Rotating Carousel logic (Scroll Triggered)
    const carouselSection = document.getElementById('scroll-carousel');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselLabels = document.querySelectorAll('.carousel-label');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const mobileTextContainer = document.querySelector('.mobile-carousel-text');

    if (carouselSection && carouselTrack && carouselLabels.length > 0) {
        let lastIdx = -1;
        let isSnapping = false;

        // Snapping Function
        const handleSnap = (progress) => {
            if (isSnapping) return;

            const totalSlides = carouselLabels.length;
            const targetIdx = Math.round(progress * (totalSlides - 1));
            const targetProgress = targetIdx / (totalSlides - 1);

            // Only snap if we aren't already very close
            if (Math.abs(progress - targetProgress) > 0.01) {
                isSnapping = true;
                const sectionHeight = carouselSection.offsetHeight;
                const viewHeight = window.innerHeight;
                const targetScroll = carouselSection.offsetTop + targetProgress * (sectionHeight - viewHeight);

                lenis.scrollTo(targetScroll, {
                    duration: 0.8,
                    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // Ease in-out
                    onComplete: () => {
                        isSnapping = false;
                    }
                });
            }
        };

        let snapTimeout;

        lenis.on('scroll', () => {
            const sectionRect = carouselSection.getBoundingClientRect();
            const sectionHeight = sectionRect.height;
            const viewHeight = window.innerHeight;

            // Calculate progress through the section
            let progress = -sectionRect.top / (sectionHeight - viewHeight);
            progress = Math.max(0, Math.min(1, progress));

            // Snap logic: Debounce snapping when scrolling stops
            clearTimeout(snapTimeout);
            // Only trigger snap if we are in the carousel's scrollable range
            if (sectionRect.top <= 100 && sectionRect.bottom >= viewHeight - 100) {
                snapTimeout = setTimeout(() => handleSnap(progress), 200);
            }

            const totalSlides = carouselLabels.length;
            const currentIdx = Math.round(progress * (totalSlides - 1));

            // Sync Labels
            carouselLabels.forEach((label, idx) => {
                if (idx === currentIdx) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });

            // Sync Slides and Mobile Text
            const isMobile = window.innerWidth <= 1100;

            carouselSlides.forEach((slide, idx) => {
                const targetProgress = idx / (totalSlides - 1);
                const overlay = slide.querySelector('.slide-overlay');

                if (isMobile) {
                    // Mobile: Update external text container
                    if (idx === currentIdx && currentIdx !== lastIdx && mobileTextContainer) {
                        mobileTextContainer.style.opacity = 0;
                        setTimeout(() => {
                            mobileTextContainer.innerHTML = overlay ? overlay.outerHTML : '';
                            mobileTextContainer.style.opacity = 1;
                        }, 250);
                        lastIdx = currentIdx;
                    }
                } else {
                    // Desktop: Snap text visibility via CSS class
                    if (overlay) {
                        if (idx === currentIdx) {
                            overlay.classList.add('active');
                        } else {
                            overlay.classList.remove('active');
                            // Dynamic exit direction
                            const xOffset = progress > targetProgress ? -30 : 30;
                            overlay.style.transform = `translateX(${xOffset}px)`;
                        }
                    }
                }

                if (idx === currentIdx) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update Track Transform (Snapping)
            const targetTranslateY = currentIdx * (100 / totalSlides);
            carouselTrack.style.transform = `translateY(-${targetTranslateY}%)`;
        });

        // Click to navigate
        carouselLabels.forEach((label, idx) => {
            label.addEventListener('click', () => {
                const sectionHeight = carouselSection.offsetHeight;
                const viewHeight = window.innerHeight;
                // Calculate the scroll position for this specific index
                // progress = idx / (totalSlides - 1)
                const targetScroll = carouselSection.offsetTop + (idx / (carouselLabels.length - 1)) * (sectionHeight - viewHeight);
                lenis.scrollTo(targetScroll, { duration: 1.5 });
            });
        });
    }

    // 9. Swipe Navigation & Next Project Card for Project Pages
    if (document.body.classList.contains('project-page')) {
        const projectData = [
            { path: 'Product/dune.html', nextPath: '../Product/lifeaid.html', nextTitle: 'LifeAID', nextImg: '../assets/Lifeaid/lifeaid landscape 3.jpg' },
            { path: 'Product/lifeaid.html', nextPath: '../Product/revvo.html', nextTitle: 'Revvo', nextImg: '../assets/Revvo/REVO FINDAL RENDER.bip.63 (1).jpg' },
            { path: 'Product/revvo.html', nextPath: '../Furniture/boghylde.html', nextTitle: 'Boghylde', nextImg: '../assets/Boghylde/boghylde_natural_photoshoot1.png' },
            { path: 'Furniture/boghylde.html', nextPath: '../Furniture/cove.html', nextTitle: 'Cove', nextImg: '../assets/Cove/Cove Lounge Chair Hotel Render.jpeg' },
            { path: 'Furniture/cove.html', nextPath: '../Furniture/panel.html', nextTitle: 'Panel', nextImg: '../assets/Panel/panel chair render v3.png' },
            { path: 'Furniture/panel.html', nextPath: '../Product/deskscape.html', nextTitle: 'Deskscape', nextImg: '../assets/Deskscape/Deskscape Hero.png' },
            { path: 'Product/deskscape.html', nextPath: '../Product/weeding-fork.html', nextTitle: 'Weeding Fork', nextImg: '../assets/Weeding Fork/Lululemon weeding fork hero.png' },
            { path: 'Product/weeding-fork.html', nextPath: '../Product/jet.html', nextTitle: 'Jet', nextImg: '../assets/Jet/IMG_3646.jpg' },
            { path: 'Product/jet.html', nextPath: '../Product/verge.html', nextTitle: 'Verge', nextImg: '../assets/Verge/Verge Wallet Photo.png' },
            { path: 'Product/verge.html', nextPath: '../Product/swirl.html', nextTitle: 'Swirl', nextImg: '../assets/Swirl/Swirl Portrait Hero.jpeg' },
            { path: 'Product/swirl.html', nextPath: '../Product/dune.html', nextTitle: 'Dune', nextImg: '../assets/Dune/speaker portfolio1 .jpg' }
        ];

        let currentPath = window.location.pathname;
        if (currentPath.endsWith('/')) currentPath += 'index.html';

        const currentProj = projectData.find(p => currentPath.includes(p.path));
        const currentIndex = projectData.findIndex(p => currentPath.includes(p.path));

        // Inject Next Project Card in Metadata Section
        if (currentProj) {
            const descDetails = document.querySelector('.description-details');
            if (descDetails) {
                let metaGroup = descDetails.querySelector('.meta-items-group');
                if (!metaGroup) {
                    metaGroup = document.createElement('div');
                    metaGroup.className = 'meta-items-group';
                    const detailItems = Array.from(descDetails.querySelectorAll('.detail-item'));
                    detailItems.forEach(item => metaGroup.appendChild(item));
                    descDetails.insertBefore(metaGroup, descDetails.firstChild);
                }

                if (!descDetails.querySelector('.next-project-card')) {
                    const nextCard = document.createElement('a');
                    nextCard.href = currentProj.nextPath;
                    nextCard.className = 'next-project-card';
                    nextCard.setAttribute('aria-label', `Next Project: ${currentProj.nextTitle}`);
                    nextCard.innerHTML = `
                        <div class="next-project-bg">
                            <img src="${currentProj.nextImg}" alt="${currentProj.nextTitle}">
                            <div class="next-project-overlay"></div>
                        </div>
                        <div class="next-project-content">
                            <div class="next-project-circle">
                                <span>Next</span>
                            </div>
                        </div>
                    `;
                    descDetails.appendChild(nextCard);
                }
            }
        }

        let touchStartX = 0;
        let touchEndX = 0;

        function handleSwipe() {
            const swipeThreshold = 100;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentIndex !== -1 && currentIndex < projectData.length - 1) {
                    navigateToProject(projectData[currentIndex + 1].path);
                } else if (diff < 0 && currentIndex > 0) {
                    navigateToProject(projectData[currentIndex - 1].path);
                }
            }
        }

        function navigateToProject(target) {
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = '../' + target;
            }, 600);
        }

        window.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        window.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
});
