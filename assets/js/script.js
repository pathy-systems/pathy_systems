console.log('script.js loaded');

// Protege a execução do tsParticles caso a lib não carregue (evita que todo o script pare)
if (typeof tsParticles !== 'undefined' && tsParticles && typeof tsParticles.load === 'function') {
    try {
        tsParticles.load("particles", {
            particles: {
                number: { value: 60 },
                move: { enable: true, speed: 0.8 },
                size: { value: 2 },
                color: { value: "#ffffff" },
                links: { enable: true, distance: 200, color: "#ffffff", opacity: 0.25, width: 1 },
            },
            interactivity: {
                events: { onHover: { enable: true, mode: "grab" }},
                modes: { grab: { distance: 180, links: { opacity: 0.8 }}}
            }
        });
    } catch (e) {
        console.warn('tsParticles.load falhou:', e);
    }
} else {
    console.warn('tsParticles não disponível (CDN falhou ou bloqueado).');
}

// ===============================
// SCROLL BUTTONS - HOME & PORTFOLIO
// ===============================

// garante que os elementos existam antes de adicionar handlers
document.addEventListener('DOMContentLoaded', () => {
    const btnHome = document.querySelector('.btn-home');
    const sectionServicosTarget = document.getElementById('servicos');

    if (btnHome && sectionServicosTarget) {
        btnHome.addEventListener('click', () => {
            sectionServicosTarget.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    } else {
        console.warn('btnHome ou #servicos não encontrado.');
    }

    // PORTFOLIO: scroll to project1 and create falling arrows on hover
    const btnPortfolio = document.querySelector('.btn-portfolio');
    const portfolioSection = document.getElementById('portfolio');
    const project1Section = document.getElementById('project1');

    if (btnPortfolio && project1Section) {
        console.log('Attach handlers to btnPortfolio');
        // scroll to next section
        btnPortfolio.addEventListener('click', () => {
            project1Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // falling arrows effect on hover
        let arrowsInterval = null;
        const MAX_ARROWS = 40;

        function createFallingArrow() {
            if (!portfolioSection) return;
            if (portfolioSection.querySelectorAll('.falling-arrow').length >= MAX_ARROWS) return;

            const el = document.createElement('i');
            el.className = 'bi bi-arrow-down falling-arrow';
            el.style.left = `${Math.random() * 100}%`;
            el.style.fontSize = `${Math.random() * 25 + 20}px`;
            const duration = Math.random() * 2 + 3; // 3-5s
            el.style.animationDuration = `${duration}s`;
            el.style.opacity = 0;
            portfolioSection.appendChild(el);

            // remove after animation ends
            setTimeout(() => {
                el.remove();
            }, duration * 1000 + 300);
        }

        btnPortfolio.addEventListener('mouseenter', () => {
            // burst of arrows immediately
            for (let i = 0; i < 6; i++) createFallingArrow();
            if (!arrowsInterval) arrowsInterval = setInterval(createFallingArrow, 350);
        });

        btnPortfolio.addEventListener('mouseleave', () => {
            if (arrowsInterval) {
                clearInterval(arrowsInterval);
                arrowsInterval = null;
            }
        });

        // mobile: small burst on click/touch
        btnPortfolio.addEventListener('click', (e) => {
            for (let i = 0; i < 6; i++) createFallingArrow();
        });

    } else {
        console.warn('btnPortfolio ou #project1 não encontrado:', !!btnPortfolio, !!project1Section);
    }

    // PROJECT BUTTON: diagonal up-right icons on hover (applied to all .btn-project)
    const btnProjects = document.querySelectorAll('.project-info .btn-project, .btn-project');
    if (btnProjects.length) {
        console.log('Attach handlers to btnProject(s)');
        const MAX_UR = 150; // maior limite para preencher a tela

        function createUpRightIcon() {
            if (document.querySelectorAll('.up-right-icon').length >= MAX_UR) return;
            const el = document.createElement('i');
            el.className = 'bi bi-arrow-up-right up-right-icon';

            el.style.left = `${Math.random() * 100}%`;
            el.style.bottom = `${8 + Math.random() * 32}%`;
            el.style.fontSize = `${Math.random() * 25 + 20}px`;
            const duration = Math.random() * 2 + 3; // 3-5s
            el.style.animationDuration = `${duration}s`;
            el.style.animationDelay = `${Math.random() * 0.6}s`;

            document.body.appendChild(el);

            setTimeout(() => { el.remove(); }, duration * 1000 + 1000);
        }

        btnProjects.forEach(btn => {
            let urInterval = null;

            btn.addEventListener('mouseenter', () => {
                for (let i = 0; i < 12; i++) createUpRightIcon();
                if (!urInterval) urInterval = setInterval(createUpRightIcon, 180);
            });

            btn.addEventListener('mouseleave', () => {
                if (urInterval) {
                    clearInterval(urInterval);
                    urInterval = null;
                }
            });

            btn.addEventListener('click', () => {
                for (let i = 0; i < 12; i++) createUpRightIcon();
            });
        });
    } else {
        console.warn('btnProject não encontrado');
    }

    // MOCKUP SWITCHER: aplica por seção (cada projeto tem seu próprio mockup e botões)
    document.querySelectorAll('.section').forEach(section => {
        const mockupImg = section.querySelector('.project-mockup img.mockup');
        const mockupBtns = section.querySelectorAll('.mockup-controls .mockup-btn');

        if (!mockupImg || !mockupBtns.length) return;

        // preload images for this section
        mockupBtns.forEach(btn => {
            const src = btn.getAttribute('data-src');
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });

        let isSwitching = false;

        mockupBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const size = btn.getAttribute('data-size');

                const currentSrc = mockupImg.getAttribute('src');
                if (currentSrc === src && mockupImg.classList.contains(size)) return;
                if (isSwitching) return;

                isSwitching = true;
                mockupImg.style.opacity = 0;

                const pre = new Image();
                let done = false;
                const finalize = () => {
                    if (done) return;
                    done = true;

                    mockupImg.setAttribute('src', src);
                    mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                    mockupImg.classList.add(size);

                    // only remove active from buttons in this section
                    mockupBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    requestAnimationFrame(() => {
                        mockupImg.style.opacity = 1;
                    });

                    setTimeout(() => { isSwitching = false; }, 450);
                };

                pre.onload = finalize;
                pre.onerror = () => {
                    console.warn('Erro ao carregar imagem do mockup:', src);
                    finalize();
                };
                pre.src = src;

                setTimeout(() => { finalize(); }, 2000);
            });
        });
    });
});

// ===============================
// PARTICLES - SERVIÇOS (PRELOAD)
// ===============================

const particlesContainer = document.getElementById('particles-servicos');
const servicosSection = document.getElementById('servicos');

let particlesInterval = null;
const MAX_ICONS = 30;
const INITIAL_ICONS = 30;

if (particlesContainer && servicosSection) {
    const icons = [
        'bi-code-slash',
        'bi-brush',
        'bi-phone',
        'bi-lightning',
        'bi-globe',
        'bi-cpu',
        'bi-diagram-3',
        'bi-window'
    ];

    function createFloatingIcon(startRandomHeight = false) {
        if (particlesContainer.children.length >= MAX_ICONS) return;

        const icon = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        icon.className = `bi ${randomIcon} floating-icon`;

        icon.style.fontSize = `${Math.random() * 18 + 28}px`;
        icon.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 8 + 15;
        icon.style.animationDuration = `${duration}s`;

        // 👇 começa em alturas aleatórias (pré-carga)
        if (startRandomHeight) {
            icon.style.bottom = `${Math.random() * 100}vh`;
        }

        particlesContainer.appendChild(icon);

        setTimeout(() => {
            icon.remove();
        }, duration * 1000);
    }

    function preloadIcons() {
        for (let i = 0; i < INITIAL_ICONS; i++) {
            createFloatingIcon(true);
        }
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                // 🔥 Pré-carrega antes do usuário perceber
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


