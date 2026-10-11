// Apply immediately after <body> to avoid a dark first paint.
(() => {
    const key = 'portfolio-theme';
    let current = 'light';
    try { if (localStorage.getItem(key) === 'dark') current = 'dark'; } catch {}
    function apply() {
        document.body.classList.toggle('dark-mode', current === 'dark');
        document.body.classList.toggle('light-mode', current === 'light');
        const button = document.getElementById('themeToggle');
        if (button) {
            button.setAttribute('aria-label', current === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
            button.setAttribute('aria-pressed', String(current === 'dark'));
            button.querySelector('i').className = current === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: current } }));
    }
    apply();
    function init() {
        apply();
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            current = current === 'light' ? 'dark' : 'light'; apply();
            try { localStorage.setItem(key, current); } catch {}
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
