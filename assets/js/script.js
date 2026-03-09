/**
 * Pathy Systems - Main JavaScript
 * Versão corrigida e otimizada
 */

// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================
const CONFIG = {
    breakpoints: {
        mobile: 440,
        tablet: 834,  // Atualizado para 834px
        desktop: 1024
    },
    particles: {
        maxArrows: 40,
        maxUpRightIcons: 150,
        maxServiceIcons: 30
    },
    animations: {
        typingSpeed: 100,
        startDelay: 500
    }
};

// ============================================
// UTILITÁRIOS
// ============================================
const Utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    isMobileView: () => window.matchMedia(`(max-width: ${CONFIG.breakpoints.tablet}px)`).matches,

    isTabletView: () => window.matchMedia(`(max-width: ${CONFIG.breakpoints.tablet}px)`).matches,

    getElement: (selector, context = document) => context.querySelector(selector),

    getElements: (selector, context = document) => context.querySelectorAll(selector)
};

// ============================================
// MÓDULO: MENU MOBILE
// ============================================
const MobileMenu = (() => {
    let menuMobileIcon, menuMobileOverlay, menuMobileClose, menuMobileLinks, header, body;
    let isInitialized = false;

    function init() {
        if (isInitialized) return;
        
        menuMobileIcon = Utils.getElement('.menu-mobile');
        menuMobileOverlay = Utils.getElement('#menuMobileOverlay');
        menuMobileClose = Utils.getElement('.menu-mobile-close');
        menuMobileLinks = Utils.getElements('.menu-mobile-link');
        header = Utils.getElement('header');
        body = document.body;

        if (!menuMobileIcon || !menuMobileOverlay) {
            console.warn('MobileMenu: Elementos necessários não encontrados');
            return;
        }

        bindEvents();
        isInitialized = true;
    }

    function bindEvents() {
        menuMobileIcon.addEventListener('click', openMenu);
        menuMobileIcon.addEventListener('touchstart', handleTouchStart, { passive: false });
        menuMobileClose?.addEventListener('click', closeMenu);

        menuMobileLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        menuMobileOverlay.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleKeyDown);
        initScrollObserver();
    }

    function handleTouchStart(e) {
        e.preventDefault();
        openMenu();
    }

    function handleLinkClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = Utils.getElement(targetId);
        
        closeMenu();
        
        setTimeout(() => {
            targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    function handleOverlayClick(e) {
        if (e.target === menuMobileOverlay) {
            closeMenu();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' && menuMobileOverlay.classList.contains('active')) {
            closeMenu();
        }
    }

    function openMenu() {
        menuMobileOverlay.classList.add('active');
        header?.classList.add('menu-open');
        body.classList.add('menu-mobile-open');
        createMenuParticles();
        setTimeout(() => menuMobileClose?.focus(), 100);
    }

    function closeMenu() {
        menuMobileOverlay.classList.remove('active');
        header?.classList.remove('menu-open');
        body.classList.remove('menu-mobile-open');
        Utils.getElements('.menu-mobile-particle', menuMobileOverlay).forEach(p => p.remove());
    }

    function createMenuParticles() {
        const container = document.createElement('div');
        container.className = 'menu-mobile-particles';
        const icons = ['bi-code-slash', 'bi-brush', 'bi-phone', 'bi-lightning', 'bi-globe', 'bi-cpu'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('i');
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            particle.className = `bi ${randomIcon} menu-mobile-particle`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(particle);
        }
        
        menuMobileOverlay.appendChild(container);
    }

    function initScrollObserver() {
        const sectionsContainer = Utils.getElement('.sections');
        if (!sectionsContainer) return;

        const updateActiveLink = Utils.debounce(() => {
            const sections = Utils.getElements('.section');
            const scrollPosition = sectionsContainer.scrollTop;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop - sectionHeight / 3) {
                    menuMobileLinks.forEach(link => {
                        link.classList.toggle('active', 
                            link.getAttribute('href') === `#${sectionId}`
                        );
                    });
                }
            });
        }, 100);

        sectionsContainer.addEventListener('scroll', updateActiveLink);
    }

    return { init };
})();

// ============================================
// MÓDULO: TYPEWRITER EFFECT
// ============================================
const TypeWriter = (() => {
    function init() {
        const element = Utils.getElement('.typewriter-text');
        const cursor = Utils.getElement('.typewriter-cursor');
        
        if (!element) return;

        const config = {
            text: "Pathy Systems",
            element,
            cursor,
            typingSpeed: CONFIG.animations.typingSpeed,
            startDelay: CONFIG.animations.startDelay,
            pauseEnd: 2000,
            loop: false
        };

        typeWriter(config);
    }

    function typeWriter(config) {
        const { text, element, cursor, typingSpeed, startDelay, loop, pauseEnd } = config;
        
        let index = 0;
        let isDeleting = false;
        
        element.textContent = '';
        cursor?.classList.add('typing');
        
        function type() {
            if (isDeleting) {
                element.textContent = text.substring(0, index - 1);
                index--;
            } else {
                element.textContent = text.substring(0, index + 1);
                index++;
            }
            
            if (!isDeleting && index === text.length) {
                cursor?.classList.remove('typing');
                cursor?.classList.add('finished');
                
                if (loop) {
                    setTimeout(() => {
                        isDeleting = true;
                        cursor?.classList.remove('finished');
                        cursor?.classList.add('typing');
                        setTimeout(type, typingSpeed);
                    }, pauseEnd);
                    return;
                } else {
                    setTimeout(() => {
                        if (cursor) cursor.style.opacity = '0';
                    }, 1000);
                    return;
                }
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                setTimeout(type, startDelay);
                return;
            }
            
            const speed = isDeleting ? typingSpeed / 2 : typingSpeed;
            const randomSpeed = speed + (Math.random() * 50 - 25);
            
            setTimeout(type, randomSpeed);
        }
        
        setTimeout(type, startDelay);
    }

    return { init };
})();

// ============================================
// MÓDULO: TS PARTICLES
// ============================================
const ParticlesModule = (() => {
    function init() {
        if (typeof tsParticles === 'undefined' || !tsParticles?.load) {
            console.warn('tsParticles não disponível');
            return;
        }

        try {
            const isSmallScreen = Utils.isTabletView();
            const particleCount = isSmallScreen ? 18 : 60;

            tsParticles.load("particles", {
                particles: {
                    number: { value: particleCount },
                    move: { enable: true, speed: 0.8 },
                    size: { value: 2 },
                    color: { value: "#ffffff" },
                    links: { 
                        enable: true, 
                        distance: 200, 
                        color: "#ffffff", 
                        opacity: 0.25, 
                        width: 1 
                    },
                },
                interactivity: {
                    events: { 
                        onHover: { enable: true, mode: "grab" } 
                    },
                    modes: { 
                        grab: { distance: 180, links: { opacity: 0.8 } } 
                    }
                }
            });
        } catch (e) {
            console.warn('tsParticles.load falhou:', e);
        }
    }

    return { init };
})();

// ============================================
// MÓDULO: SCROLL BUTTONS
// ============================================
const ScrollButtons = (() => {
    function init() {
        initHomeButton();
        initPortfolioButton();
    }

    function initHomeButton() {
        const btnHome = Utils.getElement('.btn-home');
        const target = Utils.getElement('#servicos');

        if (!btnHome || !target) return;

        btnHome.addEventListener('click', () => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function initPortfolioButton() {
        const btnPortfolio = Utils.getElement('.btn-portfolio');
        const portfolioSection = Utils.getElement('#portfolio');
        const project1Section = Utils.getElement('#project1');

        if (!btnPortfolio || !project1Section) return;

        let arrowsInterval = null;

        btnPortfolio.addEventListener('click', () => {
            project1Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        btnPortfolio.addEventListener('mouseenter', () => {
            for (let i = 0; i < 6; i++) createFallingArrow(portfolioSection);
            if (!arrowsInterval) {
                arrowsInterval = setInterval(() => createFallingArrow(portfolioSection), 350);
            }
        });

        btnPortfolio.addEventListener('mouseleave', () => {
            if (arrowsInterval) {
                clearInterval(arrowsInterval);
                arrowsInterval = null;
            }
        });
    }

    function createFallingArrow(container) {
        if (!container) return;
        
        const existing = Utils.getElements('.falling-arrow', container);
        if (existing.length >= CONFIG.particles.maxArrows) return;

        const el = document.createElement('i');
        el.className = 'bi bi-arrow-down falling-arrow';
        el.style.left = `${Math.random() * 100}%`;
        el.style.fontSize = `${Math.random() * 25 + 20}px`;
        const duration = Math.random() * 2 + 3;
        el.style.animationDuration = `${duration}s`;
        el.style.opacity = 0;
        
        container.appendChild(el);
        setTimeout(() => el.remove(), duration * 1000 + 300);
    }

    return { init };
})();

// ============================================
// MÓDULO: PROJECT BUTTONS EFFECTS
// ============================================
const ProjectButtons = (() => {
    function init() {
        const buttons = Utils.getElements('.project-info .btn-project, .btn-project');
        
        if (!buttons.length) return;

        buttons.forEach(btn => {
            let interval = null;

            btn.addEventListener('mouseenter', () => {
                for (let i = 0; i < 12; i++) createUpRightIcon();
                if (!interval) interval = setInterval(createUpRightIcon, 180);
            });

            btn.addEventListener('mouseleave', () => {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            });
        });
    }

    function createUpRightIcon() {
        const existing = Utils.getElements('.up-right-icon');
        if (existing.length >= CONFIG.particles.maxUpRightIcons) return;

        const el = document.createElement('i');
        el.className = 'bi bi-arrow-up-right up-right-icon';
        el.style.left = `${Math.random() * 100}%`;
        el.style.bottom = `${8 + Math.random() * 32}%`;
        el.style.fontSize = `${Math.random() * 25 + 20}px`;
        const duration = Math.random() * 2 + 3;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${Math.random() * 0.6}s`;

        document.body.appendChild(el);
        setTimeout(() => el.remove(), duration * 1000 + 1000);
    }

    return { init };
})();

// ============================================
// MÓDULO: MOCKUP SWITCHER
// ============================================
const MockupSwitcher = (() => {
    function init() {
        const projectSections = document.querySelectorAll('.section[id^="project"]');
        
        projectSections.forEach(section => {
            new ProjectMockup(section);
        });
    }

    class ProjectMockup {
        constructor(section) {
            this.section = section;
            this.mockupImg = null;
            this.mockupBtns = Utils.getElements('.mockup-controls .mockup-btn', section);
            this.mockupControls = Utils.getElement('.mockup-controls', section);
            this.projectMockup = Utils.getElement('.project-mockup', section);
            this.isSwitching = false;

            if (!this.mockupBtns.length) return;

            this.init();
        }

        init() {
            const hasActive = Array.from(this.mockupBtns).some(b => b.classList.contains('active'));
            if (!hasActive) {
                this.mockupBtns[0].classList.add('active');
            }

            this.preloadImages();
            this.setupIntersectionObserver();
            
            this.mockupBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleButtonClick(btn));
            });
        }

        preloadImages() {
            this.mockupBtns.forEach(btn => {
                const src = btn.getAttribute('data-src');
                if (src) {
                    const img = new Image();
                    img.src = src;
                }
            });
        }

        setupIntersectionObserver() {
            if (!('IntersectionObserver' in window)) {
                this.ensureInitialMockup();
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.ensureInitialMockup();
                        observer.unobserve(this.section);
                    }
                });
            }, { threshold: 0.25 });

            observer.observe(this.section);
        }

        ensureInitialMockup() {
            const activeBtn = Array.from(this.mockupBtns).find(b => b.classList.contains('active')) 
                || this.mockupBtns[0];
            
            if (!activeBtn) return;

            const src = activeBtn.getAttribute('data-src');
            const size = activeBtn.getAttribute('data-size');
            
            if (!src) return;

            if (!this.mockupImg) {
                this.createMockupElement();
            }

            const currentSrc = this.mockupImg.getAttribute('src');
            if (currentSrc === src && this.mockupImg.classList.contains(size)) {
                this.mockupImg.style.opacity = 1;
                return;
            }

            this.loadImage(src, size);
        }

        createMockupElement() {
            this.mockupImg = document.createElement('img');
            this.mockupImg.className = 'mockup';
            this.mockupImg.style.opacity = 0;
            
            if (this.projectMockup && this.mockupControls) {
                this.projectMockup.insertBefore(this.mockupImg, this.mockupControls);
            } else if (this.projectMockup) {
                this.projectMockup.appendChild(this.mockupImg);
            }
        }

        loadImage(src, size) {
            const pre = new Image();
            
            pre.onload = () => {
                this.mockupImg.setAttribute('src', src);
                this.mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                if (size) this.mockupImg.classList.add(size);
                requestAnimationFrame(() => {
                    this.mockupImg.style.opacity = 1;
                });
            };

            pre.onerror = () => {
                console.warn('Erro ao carregar imagem do mockup:', src);
                this.mockupImg.setAttribute('src', src);
                this.mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                if (size) this.mockupImg.classList.add(size);
                requestAnimationFrame(() => {
                    this.mockupImg.style.opacity = 1;
                });
            };

            pre.src = src;
        }

        handleButtonClick(btn) {
            this.mockupBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const src = btn.getAttribute('data-src');
            const size = btn.getAttribute('data-size');

            if (!this.mockupImg) {
                this.createMockupElement();
            }

            const currentSrc = this.mockupImg.getAttribute('src');
            if (currentSrc === src && this.mockupImg.classList.contains(size)) return;
            if (this.isSwitching) return;

            this.isSwitching = true;
            this.mockupImg.style.opacity = 0;

            const pre = new Image();
            let done = false;

            const finalize = () => {
                if (done) return;
                done = true;

                this.mockupImg.setAttribute('src', src);
                this.mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                this.mockupImg.classList.add(size);
                this.mockupImg.loading = 'lazy';
                this.mockupImg.decoding = 'async';

                requestAnimationFrame(() => {
                    this.mockupImg.style.opacity = 1;
                });

                setTimeout(() => { this.isSwitching = false; }, 450);
            };

            pre.onload = finalize;
            pre.onerror = () => {
                console.warn('Erro ao carregar imagem do mockup:', src);
                finalize();
            };
            pre.src = src;

            setTimeout(finalize, 2000);
        }
    }

    return { init };
})();

// ============================================
// MÓDULO: SERVIÇOS PARTICLES
// ============================================
const ServicosParticles = (() => {
    let particlesContainer, servicosSection, particlesInterval;
    let isInitialized = false;

    const icons = [
        'bi-code-slash', 'bi-brush', 'bi-phone', 'bi-lightning',
        'bi-globe', 'bi-cpu', 'bi-diagram-3', 'bi-window'
    ];

    function init() {
        if (isInitialized) return;

        particlesContainer = Utils.getElement('#particles-servicos');
        servicosSection = Utils.getElement('#servicos');

        if (!particlesContainer || !servicosSection) {
            console.warn('ServicosParticles: Container não encontrado');
            return;
        }

        setupObserver();
        isInitialized = true;
    }

    function setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (particlesContainer.children.length === 0) {
                        preloadIcons();
                    }
                    if (!particlesInterval) {
                        particlesInterval = setInterval(createFloatingIcon, 900);
                    }
                } else {
                    clearInterval(particlesInterval);
                    particlesInterval = null;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(servicosSection);
    }

    function preloadIcons() {
        for (let i = 0; i < CONFIG.particles.maxServiceIcons; i++) {
            createFloatingIcon(true);
        }
    }

    function createFloatingIcon(startRandomHeight = false) {
        if (particlesContainer.children.length >= CONFIG.particles.maxServiceIcons) return;

        const icon = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        icon.className = `bi ${randomIcon} floating-icon`;

        icon.style.fontSize = `${Math.random() * 18 + 28}px`;
        icon.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 8 + 15;
        icon.style.animationDuration = `${duration}s`;

        if (startRandomHeight) {
            icon.style.bottom = `${Math.random() * 100}vh`;
        }

        particlesContainer.appendChild(icon);
        setTimeout(() => icon.remove(), duration * 1000);
    }

    return { init };
})();

// ============================================
// MÓDULO: CAROUSEL DE PROJETOS
// ============================================
const ProjectsCarousel = (() => {
    const projectSections = document.querySelectorAll('.project-section');
    const navLinks = document.querySelectorAll('.projects-nav a');
    const progressFill = document.querySelector('.progress-fill');
    const currentNum = document.querySelector('.project-progress .current');
    const body = document.body;
    
    let currentIndex = 0;

    function init() {
        if (!projectSections.length) return;
        
        setupIntersectionObserver();
        setupNavigation();
        setupKeyboardNav();
    }

    function setupIntersectionObserver() {
        const options = {
            root: null,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(projectSections).indexOf(entry.target);
                    updateActiveState(index);
                    body.classList.add('in-projects');
                }
            });
        }, options);

        projectSections.forEach(section => observer.observe(section));

        const portfolioSection = document.getElementById('portfolio');
        const contatoSection = document.getElementById('contato');
        
        [portfolioSection, contatoSection].forEach(section => {
            if (!section) return;
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        body.classList.remove('in-projects');
                    }
                });
            }, { threshold: 0.5 });
            obs.observe(section);
        });
    }

    function updateActiveState(index) {
        currentIndex = index;
        
        navLinks.forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
        
        if (progressFill) {
            const progress = ((index + 1) / projectSections.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        if (currentNum) {
            currentNum.textContent = String(index + 1).padStart(2, '0');
        }
    }

    function setupNavigation() {
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (!body.classList.contains('in-projects')) return;
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                navigateTo(currentIndex + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateTo(currentIndex - 1);
            }
        });
    }

    function navigateTo(index) {
        if (index < 0 || index >= projectSections.length) return;
        projectSections[index].scrollIntoView({ behavior: 'smooth' });
    }

    return { init };
})();

// ============================================
// MÓDULO: NOVA SEÇÃO CONTATO - MOBILE TOGGLE
// ============================================
const ContactSection = (() => {
    let contactWrapper, contactCards, contactFormWrapper, toggleBtn, backBtn;
    let isInitialized = false;

    function init() {
        if (isInitialized) return;

        contactWrapper = Utils.getElement('.contact-wrapper');
        contactCards = Utils.getElement('.contact-cards');
        contactFormWrapper = Utils.getElement('.contact-form-wrapper');
        
        if (!contactWrapper || !contactCards || !contactFormWrapper) {
            console.warn('ContactSection: Elementos não encontrados');
            return;
        }

        createToggleButton();
        createBackButton();
        bindEvents();
        handleResize();
        
        isInitialized = true;
    }



    function createBackButton() {
        // Verifica se já existe
        if (Utils.getElement('.btn-back-cards')) return;

        backBtn = document.createElement('button');
        backBtn.className = 'btn-back-cards';
        backBtn.innerHTML = '<i class="bi bi-arrow-left"></i> Voltar';
        
        // Insere no início do formulário
        contactFormWrapper.insertBefore(backBtn, contactFormWrapper.firstChild);
    }

    function createToggleButton() {
        // Se já foi criado, retorna
        if (Utils.getElement('.btn-toggle-form')) return;

        toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-toggle-form';
        toggleBtn.textContent = 'ENVIAR MENSAGEM';

        // Coloca dentro da coluna esquerda logo abaixo dos cartões
        contactCards.appendChild(toggleBtn);
    }

    function bindEvents() {
        if (toggleBtn) {
            toggleBtn.addEventListener('click', showForm);
        }

        if (backBtn) {
            backBtn.addEventListener('click', showCards);
        }

        window.addEventListener('resize', Utils.debounce(handleResize, 250));
    }

    function showForm() {
        // only trigger on very small devices (<= mobile breakpoint)
        if (window.innerWidth > CONFIG.breakpoints.mobile) return;
        
        contactCards.classList.add('hidden');
        contactFormWrapper.classList.add('active');
        contactWrapper.classList.add('form-active');

        // hide the toggle button once form is visible
        if (toggleBtn) toggleBtn.style.display = 'none';
        if (backBtn) backBtn.style.display = 'flex';
        
        // Scroll suave para o formulário - REMOVIDO PARA MANTER ESTÁTICO
    }

    function showCards() {
        // only on small mobile
        if (window.innerWidth > CONFIG.breakpoints.mobile) return;
        
        contactCards.classList.remove('hidden');
        contactFormWrapper.classList.remove('active');
        contactWrapper.classList.remove('form-active');

        // restore toggle button
        if (toggleBtn) toggleBtn.style.display = 'flex';
        if (backBtn) backBtn.style.display = 'none';
        
        // Scroll suave para os cards - REMOVIDO PARA MANTER ESTÁTICO
    }

    function handleResize() {
        if (window.innerWidth <= CONFIG.breakpoints.mobile) {
            // very small mobile: show toggle button only
            if (toggleBtn) toggleBtn.style.display = 'flex';
            if (backBtn) backBtn.style.display = 'none';
            
            // Reset para estado inicial (mostrar cards)
            contactCards.classList.remove('hidden');
            contactFormWrapper.classList.remove('active');
            contactWrapper.classList.remove('form-active');
        } else {
            // Larger screens: hide toggle button and back button, show both sides
            if (toggleBtn) toggleBtn.style.display = 'none';
            if (backBtn) backBtn.style.display = 'none';
            
            contactCards.classList.remove('hidden');
            contactFormWrapper.classList.remove('active');
            contactWrapper.classList.remove('form-active');
        }
    }

    return { init };
})();



// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pathy Systems - Script inicializado');

    MobileMenu.init();
    TypeWriter.init();
    ParticlesModule.init();
    ScrollButtons.init();
    ProjectButtons.init();
    MockupSwitcher.init();
    ServicosParticles.init();
    ProjectsCarousel.init();
    ContactSection.init();
});