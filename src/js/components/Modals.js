import { qs } from '../utils/helpers.js';
import { showToast } from './Toasts.js';

export const initFirstOrderPopup = () => {
    const popup = qs('#firstOrderPopup');
    const closePopupBtn = qs('#closePopupBtn');
    
    if (!sessionStorage.getItem('popupShown')) {
        setTimeout(() => {
            if (popup) {
                popup.classList.remove('pointer-events-none');
                popup.style.opacity = '1';
                popup.querySelector('div').style.transform = 'scale(1)';
                sessionStorage.setItem('popupShown', 'true');
            }
        }, 3000);
    }

    const closeThePopup = () => {
        if (popup) {
            popup.style.opacity = '0';
            popup.querySelector('div').style.transform = 'scale(0.95)';
            setTimeout(() => popup.classList.add('pointer-events-none'), 300);
        }
    };

    closePopupBtn?.addEventListener('click', closeThePopup);
    qs('#popup-form')?.addEventListener('submit', e => {
        e.preventDefault();
        closeThePopup();
        showToast('Thanks for subscribing! Your 10% code is WELCOME10.', '🎉');
    });
};