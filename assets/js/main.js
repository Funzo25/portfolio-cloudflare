/**
 * MAIN.JS - Script principal du portfolio
 * BTS SIO - Portfolio Professionnel
 * Gestion de la navigation mobile, formulaires, etc.
 */

(function() {
    'use strict';
    
    /**
     * NAVIGATION MOBILE
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;
        
        function setOpen(open) {
            navMenu.classList.toggle('active', open);
            menuToggle.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', String(open));
        }
        menuToggle.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('click', e => { if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && navMenu.classList.contains('active')) { setOpen(false); menuToggle.focus(); } });
        window.addEventListener('resize', () => { if (innerWidth > 1100) setOpen(false); });
    }
    

initMobileMenu();
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const navbar = document.querySelector('.navbar');
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Retour en haut');
backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
document.body.appendChild(backToTop);
function onScroll() {
    navbar?.classList.toggle('scrolled', scrollY > 100);
    backToTop.classList.toggle('visible', scrollY > 300);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
backToTop.addEventListener('click', () => scrollTo({top: 0, behavior: reducedMotion() ? 'auto' : 'smooth'}));
document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', event => {
        form.querySelectorAll('[required]').forEach(field => field.setCustomValidity(field.value.trim() ? '' : 'Ce champ est requis'));
        if (!form.reportValidity()) event.preventDefault();
    });
    form.querySelectorAll('input, textarea').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
});
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(button.dataset.copy);
        const original = button.textContent; button.textContent = 'Copié !';
        setTimeout(() => { button.textContent = original; }, 2000);
    } catch { button.setAttribute('title', 'Copie indisponible dans ce navigateur'); }
}));
const lazyImages = document.querySelectorAll('img[data-src]');
function loadImage(img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { loadImage(entry.target); observer.unobserve(entry.target); }
    }));
    lazyImages.forEach(img => observer.observe(img));
} else lazyImages.forEach(loadImage);
const projectImages = document.querySelectorAll('.project-image[data-modal]');
if (projectImages.length) {
    const modal = document.createElement('dialog'); modal.className = 'modal';
    modal.setAttribute('aria-label', 'Aperçu du projet');
    modal.innerHTML = '<button type="button" class="modal-close" aria-label="Fermer">×</button><img alt="">';
    document.body.appendChild(modal);
    let opener;
    function close() { modal.close(); document.body.style.overflow = ''; opener?.focus(); }
    modal.querySelector('button').addEventListener('click', close);
    modal.addEventListener('cancel', event => { event.preventDefault(); close(); });
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    projectImages.forEach(img => {
        img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'Agrandir : ' + img.alt);
        function open() { opener = img; modal.querySelector('img').src = img.src; modal.querySelector('img').alt = img.alt; modal.showModal(); document.body.style.overflow = 'hidden'; }
        img.addEventListener('click', open);
        img.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    });
}
const filters = document.querySelector('.project-filters');
if (filters) {
    filters.hidden = false;
    const cards = [...document.querySelectorAll('[data-category]')];
    const count = document.getElementById('projectCount');
    count.textContent = cards.length + ' projets';
    filters.addEventListener('click', event => {
        const button = event.target.closest('[data-filter]'); if (!button) return;
        filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        cards.forEach(card => { card.hidden = button.dataset.filter !== 'Tous' && card.dataset.category !== button.dataset.filter; });
        count.textContent = cards.filter(c => !c.hidden).length + ' projets affichés';
    });
}
})();
