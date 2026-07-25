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
    if (slides.length > 0) {
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
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

        lenis.on('scroll', () => {
            const sectionRect = carouselSection.getBoundingClientRect();
            const sectionHeight = sectionRect.height;
            const viewHeight = window.innerHeight;

            // Calculate progress through the section
            let progress = -sectionRect.top / (sectionHeight - viewHeight);
            progress = Math.max(0, Math.min(1, progress));

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
            const isMobile = window.innerWidth <= 768;

            carouselSlides.forEach((slide, idx) => {
                const targetProgress = idx / (totalSlides - 1);
                const distance = Math.abs(progress - targetProgress);
                const maxDistance = 0.125; // Halfway to next slide
                const plateauThreshold = 0.0875; // 70% of the 0.25 gap

                const overlay = slide.querySelector('.slide-overlay');

                if (isMobile) {
                    // Mobile: Update external text container
                    if (idx === currentIdx && currentIdx !== lastIdx && mobileTextContainer) {
                        // Fade out, swap, fade in
                        mobileTextContainer.style.opacity = 0;
                        setTimeout(() => {
                            mobileTextContainer.innerHTML = overlay ? overlay.outerHTML : '';
                            mobileTextContainer.style.opacity = 1;
                        }, 250);
                        lastIdx = currentIdx;
                    }
                } else {
                    // Desktop: Maintain overlay-on-image fading
                    if (overlay) {
                        let opacity = 0;
                        let xOffset = 0;

                        if (distance <= plateauThreshold) {
                            opacity = 1;
                            xOffset = 0;
                        } else if (distance < maxDistance) {
                            const fadeProgress = (distance - plateauThreshold) / (maxDistance - plateauThreshold);
                            opacity = 1 - fadeProgress;
                            const direction = progress > targetProgress ? -1 : 1;
                            xOffset = direction * fadeProgress * 30;
                        }

                        overlay.style.opacity = opacity;
                        overlay.style.transform = `translateX(${xOffset}px)`;
                    }
                }

                if (distance < 0.1) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update Track Transform (Rolling)
            const translateY = progress * (totalSlides - 1) * 100;
            carouselTrack.style.transform = `translateY(-${translateY / totalSlides}%)`;
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

    // 9. Swipe Navigation for Project Pages
    if (document.body.classList.contains('project-page')) {
        const projects = [
            'Product/dune.html',
            'Product/lifeaid.html',
            'Product/revvo.html',
            'Furniture/boghylde.html',
            'Furniture/cove.html',
            'Furniture/panel.html',
            'Product/deskscape.html',
            'Product/weeding-fork.html',
            'Product/jet.html',
            'Product/verge.html',
            'Product/swirl.html'
        ];

        // Determine current project path relative to root
        let currentPath = window.location.pathname;
        // Normalize path: handle relative paths if opened locally
        if (currentPath.endsWith('/')) currentPath += 'index.html';

        const currentProject = projects.find(p => currentPath.includes(p));
        const currentIndex = projects.indexOf(currentProject);

        let touchStartX = 0;
        let touchEndX = 0;

        function handleSwipe() {
            const swipeThreshold = 100;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentIndex < projects.length - 1) {
                    // Swipe Left -> Next Project
                    navigateToProject(projects[currentIndex + 1]);
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe Right -> Previous Project
                    navigateToProject(projects[currentIndex - 1]);
                }
            }
        }

        function navigateToProject(target) {
            document.body.classList.add('page-exit');
            setTimeout(() => {
                // Adjust path based on current subdirectory depth
                const depth = (currentPath.match(/\//g) || []).length;
                let prefix = depth > 1 ? '../' : '';
                // If we are already in a subdirectory and the target is in a subdirectory,
                // we might need to go up one then down.
                // Simple fix: if current is in folder and target has folder, use root-relative if possible
                // or just construct the path.
                // Given the structure, ../target should work from Product/ or Furniture/
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
