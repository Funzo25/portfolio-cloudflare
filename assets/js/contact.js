(() => {
    'use strict';
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('contactStatus');
    const button = form.querySelector('[type="submit"]');
    const id = form.dataset.formspreeId.trim();
    const configured = /^[a-zA-Z0-9]{6,64}$/.test(id);
    function show(message, state) {
        status.textContent = message;
        status.dataset.state = state;
    }
    if (configured) {
        button.disabled = false;
        show('Les champs marqués d’un astérisque sont obligatoires.', 'ready');
    }
    let sending = false;
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (sending) return;
        if (!configured) {
            show('Le formulaire est momentanément indisponible. Réessayez plus tard.', 'error');
            return;
        }
        for (const field of form.querySelectorAll('[required]')) {
            field.value = field.value.trim();
            let error = field.value ? '' : 'Ce champ est requis';
            if (!error && field.minLength > 0 && field.value.length < field.minLength) {
                error = `Ce champ doit contenir au moins ${field.minLength} caractères.`;
            }
            if (!error && field.maxLength > 0 && field.value.length > field.maxLength) {
                error = `Ce champ doit contenir au maximum ${field.maxLength} caractères.`;
            }
            field.setCustomValidity(error);
        }
        if (!form.reportValidity()) return;
        sending = true;
        button.disabled = true;
        form.setAttribute('aria-busy', 'true');
        show('Envoi en cours…', 'pending');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(form.action, {
                method: 'POST', body: new FormData(form),
                headers: { Accept: 'application/json' }, signal: controller.signal
            });
            const result = await response.json();
            if (!response.ok || result.ok !== true) throw new Error('Envoi non confirmé');
            show('Votre message a bien été envoyé. Merci pour votre prise de contact.', 'success');
            form.reset();
        } catch {
            show('L’envoi n’a pas pu être confirmé. Réessayez dans quelques instants. Votre saisie a été conservée.', 'error');
        } finally {
            clearTimeout(timeout);
            sending = false;
            button.disabled = false;
            form.removeAttribute('aria-busy');
        }
    });
})();
