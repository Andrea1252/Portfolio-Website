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
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const isMobileOrTablet = window.innerWidth <= 1024;
        let canHide = true;

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

        if (window.scrollY > lastScrollY && window.scrollY > 100 && canHide) {
            // Scrolling down
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
});
