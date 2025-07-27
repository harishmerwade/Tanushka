import { qs } from '../utils/helpers.js';

export const showToast = (message, icon) => {
    const toast = qs('#toast-notification');
    qs('#toast-message').textContent = message;
    qs('#toast-icon').textContent = icon;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};