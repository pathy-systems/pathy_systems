console.log('script.js loaded');

// Protege a execução do tsParticles caso a lib não carregue (evita que todo o script pare)
if (typeof tsParticles !== 'undefined' && tsParticles && typeof tsParticles.load === 'function') {
    try {
        // reduz a quantidade de partículas em telas pequenas (<=768px)
        const isSmallScreen = window.matchMedia('(max-width:768px)').matches;
        const particleCount = isSmallScreen ? 18 : 60;

        tsParticles.load("particles", {
            particles: {
                number: { value: particleCount },
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
        let mockupImg = section.querySelector('.project-mockup img.mockup');
        const mockupBtns = section.querySelectorAll('.mockup-controls .mockup-btn');
        const mockupControls = section.querySelector('.mockup-controls');
        const projectMockup = section.querySelector('.project-mockup');

        if (!mockupBtns.length) return;

        // garante que pelo menos um botão esteja ativo por seção
        if (![...mockupBtns].some(b => b.classList.contains('active'))) {
            mockupBtns[0].classList.add('active');
        }

        // preload images (útil para quando o usuário clicar)
        mockupBtns.forEach(btn => {
            const src = btn.getAttribute('data-src');
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });

        // cria ou carrega o mockup inicial baseado no botão ativo quando a seção entra em view
        function ensureInitialMockup() {
            const activeBtn = [...mockupBtns].find(b => b.classList.contains('active')) || mockupBtns[0];
            if (!activeBtn) return;
            const src = activeBtn.getAttribute('data-src');
            const size = activeBtn.getAttribute('data-size');
            if (!src) return;

            if (!mockupImg) {
                mockupImg = document.createElement('img');
                mockupImg.className = 'mockup';
                mockupImg.style.opacity = 0;
                if (projectMockup && mockupControls) {
                    projectMockup.insertBefore(mockupImg, mockupControls);
                } else if (projectMockup) {
                    projectMockup.appendChild(mockupImg);
                }
            }

            const currentSrc = mockupImg.getAttribute('src');
            if (currentSrc === src && mockupImg.classList.contains(size)) {
                mockupImg.style.opacity = 1;
                return;
            }

            const pre = new Image();
            pre.onload = () => {
                mockupImg.setAttribute('src', src);
                mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                if (size) mockupImg.classList.add(size);
                requestAnimationFrame(() => { mockupImg.style.opacity = 1; });
            };
            pre.onerror = () => {
                console.warn('Erro ao carregar imagem inicial do mockup:', src);
                mockupImg.setAttribute('src', src);
                mockupImg.classList.remove('mobile', 'desktop', 'tablet');
                if (size) mockupImg.classList.add(size);
                requestAnimationFrame(() => { mockupImg.style.opacity = 1; });
            };
            pre.src = src;
        }

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ensureInitialMockup();
                        io.unobserve(section);
                    }
                });
            }, { threshold: 0.25 });

            io.observe(section);
        } else {
            // fallback imediato
            ensureInitialMockup();
        }

        let isSwitching = false;

        mockupBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // atualiza classes active localmente
                mockupBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const src = btn.getAttribute('data-src');
                const size = btn.getAttribute('data-size');

                // se não há elemento <img> ainda, cria um dinamicamente
                if (!mockupImg) {
                    mockupImg = document.createElement('img');
                    mockupImg.className = 'mockup';
                    mockupImg.style.opacity = 0;
                    if (projectMockup && mockupControls) {
                        projectMockup.insertBefore(mockupImg, mockupControls);
                    } else if (projectMockup) {
                        projectMockup.appendChild(mockupImg);
                    }
                }

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

                // safety fallback
                setTimeout(() => { finalize(); }, 2000);
            });
        });
        
        // CONTACT HOVER ICONS: cria ícones flutuantes no fundo de #contato ao passar o mouse sobre cada .info-item
        const contactSection = document.getElementById('contato');
        const particlesContato = document.getElementById('particles-contato');
        if (contactSection && particlesContato) {
            const infoItems = contactSection.querySelectorAll('.info-item');
            const MAX_CONTACT_ICONS = 40;

            function createContactIcon(iconClass) {
                if (particlesContato.children.length >= MAX_CONTACT_ICONS) return;
                const el = document.createElement('i');
                el.className = `bi ${iconClass} contact-floating-icon`;
                el.style.left = `${Math.random() * 100}%`;
                el.style.fontSize = `${Math.random() * 30 + 35}px`;
                const duration = Math.random() * 6 + 6; // 6-12s
                el.style.animationDuration = `${duration}s`;
                el.style.bottom = `${-10 + Math.random() * 20}px`;
                particlesContato.appendChild(el);
                setTimeout(() => { el.remove(); }, duration * 1000 + 300);
            }

            infoItems.forEach(item => {
                let contactInterval = null;
                // armazena a classe de ícone atual para permitir limpeza ao sair do hover
                item._iconClass = null;

                item.addEventListener('mouseenter', () => {
                    // limpa ícones de hovers anteriores imediatamente (fade curto)
                    const existing = particlesContato.querySelectorAll('.contact-floating-icon');
                    existing.forEach(el => {
                        el.style.transition = 'opacity 0.18s';
                        el.style.opacity = '0';
                        setTimeout(() => { el.remove(); }, 200);
                    });

                    // garante que nenhum intervalo antigo continue ativo (prevenindo sobreposição)
                    infoItems.forEach(it => {
                        if (it._contactInterval) {
                            clearInterval(it._contactInterval);
                            it._contactInterval = null;
                        }
                    });

                    const iconEl = item.querySelector('i.bi');
                    const iconClass = iconEl ? Array.from(iconEl.classList).find(c => c.startsWith('bi-')) : 'bi-telephone';
                    item._iconClass = iconClass;
                    // burst inicial
                    for (let i = 0; i < 8; i++) createContactIcon(iconClass);
                    if (!contactInterval) contactInterval = setInterval(() => createContactIcon(iconClass), 300);
                    item._contactInterval = contactInterval;
                });

                item.addEventListener('mouseleave', () => {
                    if (item._contactInterval) {
                        clearInterval(item._contactInterval);
                        item._contactInterval = null;
                    }

                    // remove imediatamente os ícones restantes pertencentes a este item
                    const ic = item._iconClass;
                    if (ic) {
                        const nodes = particlesContato.querySelectorAll(`.contact-floating-icon.${ic}`);
                        nodes.forEach(el => {
                            // fade rápido antes de remover para ficar suave
                            el.style.transition = 'opacity 0.25s';
                            el.style.opacity = '0';
                            setTimeout(() => { el.remove(); }, 250);
                        });
                    }

                    item._iconClass = null;
                });

                item.addEventListener('click', () => {
                    const iconEl = item.querySelector('i.bi');
                    const iconClass = iconEl ? Array.from(iconEl.classList).find(c => c.startsWith('bi-')) : 'bi-telephone';
                    for (let i = 0; i < 10; i++) createContactIcon(iconClass);
                });
            });
        }

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


