/**
 * ANIMATIONS.JS - Gestion des animations au scroll
 * BTS SIO - Portfolio Professionnel
 * Utilise IntersectionObserver pour performances optimales
 */

(function() {
    'use strict';
    
    /**
     * Configuration de l'Intersection Observer
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    /**
     * Callback pour l'intersection observer
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animation spéciale pour les barres de compétences
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
                
                // Optionnel : arrêter d'observer après animation
                // observer.unobserve(entry.target);
            }
        });
    }
    
    /**
     * Anime une barre de compétence
     */
    function animateSkillBar(progressBar) {
        const targetWidth = progressBar.getAttribute('data-level') || progressBar.style.width;
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 100);
    }
    
    /**
     * Initialise les animations de scroll
     */
    function initScrollAnimations() {
        // Créer l'observer
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observer tous les éléments avec classe scroll-reveal
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        revealElements.forEach(el => observer.observe(el));
        
        // Observer les barres de compétences
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.setAttribute('data-level', bar.style.width);
            observer.observe(bar);
        });
        
        // Observer les cartes si elles n'ont pas d'animation CSS
        const cards = document.querySelectorAll('.card:not([style*="animation"])');
        cards.forEach(card => {
            card.classList.add('scroll-reveal');
            observer.observe(card);
        });
    }
    
    /**
     * Ajoute un effet parallax subtil au scroll
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    /**
     * Smooth scroll pour les ancres
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorer # seul
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * Ajoute un effet de typing sur un élément
     */
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    /**
     * Initialise l'effet typing si présent
     */
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.textContent;
            const speed = parseInt(el.getAttribute('data-typing-speed')) || 50;
            
            // Observer pour déclencher l'animation au scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter(el, text, speed);
                        observer.unobserve(el);
                    }
                });
            });
            
            observer.observe(el);
        });
    }
    
    /**
     * Ajoute un compteur animé
     */
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    /**
     * Initialise les compteurs animés
     */
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter, target, duration);
                        observer.unobserve(counter);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    /**
     * Initialisation globale
     */
    function init() {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => el.classList.add('active'));
            return;
        }
        // Vérifier le support d'IntersectionObserver
        if ('IntersectionObserver' in window) {
            initScrollAnimations();
            initTypingEffect();
            initCounters();
        } else {
            // Fallback : activer toutes les animations immédiatement
            document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
                .forEach(el => el.classList.add('active'));
        }
        
        // Initialiser les autres effets
        initSmoothScroll();
        initParallax();
    }
    
    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export pour utilisation externe si nécessaire
    window.PortfolioAnimations = {
        typeWriter,
        animateCounter,
        animateSkillBar
    };
    
})();
