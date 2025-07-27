import { qs, createAndObserve } from './utils/helpers.js';
import { addToCart, toggleWishlist } from './services/state.js';
import { openTryOnModal } from './components/VirtualTryOn.js';

// Page Templates
import { HomePageTemplate, initHomePage, initHomePageObserver } from './pages/HomePage.js';
import { CollectionsPageTemplate, initCollectionsPage, updateCollectionsView } from './pages/CollectionsPage.js';
import { ProductDetailPageTemplate, initProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPageTemplate, initCartPage } from './pages/CartPage.js';
import { FriendshipDayPageTemplate, initFriendshipDayPage } from './pages/FriendshipDayPage.js';
import { RakhiPageTemplate, initRakhiPage } from './pages/RakhiPage.js';
import { ContactPageTemplate, initContactPage } from './pages/ContactPage.js';
import { ReturnPolicyPageTemplate, initReturnPolicyPage } from './pages/ReturnPolicyPage.js';

const mainContent = qs('#main-content');

const pageModules = {
    homePage: { template: HomePageTemplate, init: initHomePage, observerInit: initHomePageObserver },
    collectionsPage: { template: CollectionsPageTemplate, init: initCollectionsPage },
    productDetailPage: { template: ProductDetailPageTemplate, init: initProductDetailPage },
    cartPage: { template: CartPageTemplate, init: initCartPage },
    friendshipDayPage: { template: FriendshipDayPageTemplate, init: initFriendshipDayPage },
    rakhiPage: { template: RakhiPageTemplate, init: initRakhiPage },
    contactPage: { template: ContactPageTemplate, init: initContactPage },
    returnPolicyPage: { template: ReturnPolicyPageTemplate, init: initReturnPolicyPage },
};

export const showPage = (pageId, param) => {
    const page = pageModules[pageId] || pageModules.homePage;
    mainContent.innerHTML = page.template;
    initPage(pageId, param);
    window.scrollTo(0, 0);
};

const initPage = (pageId, param) => {
    const page = pageModules[pageId] || pageModules.homePage;
    createAndObserve(page.observerInit);
    if (page.init) {
        page.init(addInteractionListeners, param);
    }
};

const addInteractionListeners = (containerSelector) => {
    const container = qs(containerSelector);
    if (!container) return;
    container.addEventListener('click', e => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        const addToWishlistBtn = e.target.closest('.add-to-wishlist-btn');
        const tryOnBtn = e.target.closest('.try-on-btn');

        if (addToCartBtn) { e.preventDefault(); addToCart(parseInt(addToCartBtn.dataset.id)); }
        if (addToWishlistBtn) { e.preventDefault(); toggleWishlist(parseInt(addToWishlistBtn.dataset.id)); }
        if (tryOnBtn) { e.preventDefault(); openTryOnModal(parseInt(tryOnBtn.dataset.id)); }
    });
};

const initNavigation = () => {
    document.body.addEventListener('click', e => {
        const navLink = e.target.closest('.nav-link');
        const productCardLink = e.target.closest('.product-card-link');
        const dealButton = e.target.closest('.deal-button');

        if (dealButton) {
            e.preventDefault();
            showPage('collectionsPage', dealButton.dataset.filter);
        } else if (navLink) {
            e.preventDefault();
            const href = navLink.getAttribute('href');
            const pageId = href.substring(1);

            if (navLink.classList.contains('scroll-link')) {
                const targetElement = document.getElementById(pageId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showPage('homePage');
                    setTimeout(() => document.getElementById(pageId)?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
            } else if (pageModules[pageId]) {
                showPage(pageId);
            }
        } else if (productCardLink) {
            if (e.target.closest('button')) return; // Ignore clicks on buttons inside the link
            e.preventDefault();
            showPage('productDetailPage', parseInt(productCardLink.dataset.id));
        }
    });
};

const initSearch = () => {
    const searchContainer = qs('#animated-search-container');
    const searchBtn = qs('#animated-search-btn');
    const searchInput = qs('#animated-search-input');

    if (searchContainer && searchBtn && searchInput) {
        const searchIcon = searchBtn.querySelector('.search-icon');
        const closeIcon = searchBtn.querySelector('.close-icon');

        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = searchContainer.classList.contains('active');
            if (isActive && searchInput.value) {
                searchInput.value = '';
                if (qs('#collectionsPage')) {
                    updateCollectionsView(addInteractionListeners);
                }
            } else {
                searchContainer.classList.toggle('active');
                searchIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
                if (searchContainer.classList.contains('active')) {
                    searchInput.focus();
                }
            }
        });

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value;
            const currentPageIsCollections = !!qs('#collectionsPage');
            if (!currentPageIsCollections) {
                showPage('collectionsPage');
                setTimeout(() => {
                    const newSearchInput = qs('#animated-search-input');
                    if (newSearchInput) {
                        newSearchInput.value = searchTerm;
                        newSearchInput.focus();
                        const newSearchContainer = qs('#animated-search-container');
                        const newSearchBtn = qs('#animated-search-btn');
                        newSearchContainer.classList.add('active');
                        newSearchBtn.querySelector('.search-icon').classList.add('hidden');
                        newSearchBtn.querySelector('.close-icon').classList.remove('hidden');
                        updateCollectionsView(addInteractionListeners);
                    }
                }, 150);
            } else {
                updateCollectionsView(addInteractionListeners);
            }
        });
    }
};

export const initializeApp = () => {
    showPage('homePage');
    initNavigation();
    initSearch();
};