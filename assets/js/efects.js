// ============================================
// CURSOR HÍBRIDO - FUSÃO COMPLETA
// ============================================
// ============================================
// CURSOR HÍBRIDO - CORRIGIDO
// ============================================

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        // Cursor principal - rápido
        cursorX += (mouseX - cursorX) * 1.2;
        cursorY += (mouseY - cursorY) * 1.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower - delay suave
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll(
        'a, button, .menu-mobile, input, textarea'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    document.body.style.cursor = 'none';
}


/* OBSERVER DAS SECTIONS */

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
});

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

