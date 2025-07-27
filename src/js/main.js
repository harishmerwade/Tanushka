import { initializeApp, showPage } from './App.js';
import { initializeAuth } from './services/auth.js';
import { initFirstOrderPopup } from './components/Modals.js';
import { initWishlistPanel } from './components/Wishlist.js';
import { initChatbot } from './components/Chatbot.js';
import { initVirtualTryOn } from './components/VirtualTryOn.js';
import { initSpinningWheel } from './components/SpinningWheel.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core app logic (routing, etc.)
    initializeApp();

    // Initialize one-time components that live outside the main content area
    initFirstOrderPopup();
    initWishlistPanel();
    initChatbot();
    initVirtualTryOn();
    initSpinningWheel();
    initializeAuth();

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'homePage';
        const [pageId, param] = hash.split('/');
        showPage(pageId, param);
    });
});