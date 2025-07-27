import { startCountdown } from '../utils/helpers.js';
import { openSpinningWheel } from '../components/SpinningWheel.js';
import { createProductCard } from '../components/ProductCard.js';
import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';

export const RakhiPageTemplate = `
<div id="rakhiPage" class="page">
    <section class="festival-banner h-[60vh] flex items-center justify-center text-white text-center" style="background-image: url('https://placehold.co/1200x800/ffeadb/7c3f44?text=Rakhi');">
        <div class="relative z-10 p-4">
            <h1 class="text-5xl md:text-7xl font-script mb-4 reveal">Rakhi Celebration</h1>
            <p class="text-xl md:text-2xl mb-8 reveal" style="animation-delay: 200ms;">A Bond as Precious as Gold 🎁</p>
            <div id="rakhi-countdown" class="flex justify-center gap-4 text-center reveal" style="animation-delay: 400ms;"></div>
        </div>
    </section>
    <section class="py-16 md:py-24">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-4 text-[var(--brand-color)] reveal">Gifts for Your Sibling</h2>
            <p class="max-w-2xl mx-auto text-lg text-gray-600 mb-12 reveal" style="animation-delay: 100ms;">Elegant jewelry that celebrates your unique bond.</p>
            <div id="product-grid" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"></div>
            <button id="rakhi-spin-trigger" class="btn-primary mt-12 py-3 px-8 rounded-full text-lg font-semibold">Spin for a Rakhi Offer!</button>
        </div>
    </section>
</div>
`;

const renderRakhiProducts = (addInteractionListeners) => {
    const productGrid = qs('#product-grid');
    if (!productGrid) return;
    
    // Correctly filter products using the imported 'products' array
    const filteredProducts = products.filter(p => p.tags && p.tags.includes('rakhi'));
    
    // Correctly render them using the imported 'createProductCard' function
    productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
    lucide.createIcons();
    addInteractionListeners('#product-grid');
};

export const initRakhiPage = (addInteractionListeners) => {
    renderRakhiProducts(addInteractionListeners);
    startCountdown('2025-08-19T00:00:00', 'rakhi-countdown');
    qs('#rakhi-spin-trigger')?.addEventListener('click', () => {
        openSpinningWheel('Rakhi Special', 'An offer for your special bond!', ['10% Off', '20% Off', 'Free Ship', 'Gift Box', 'Try Again', '₹100 Off']);
    });
};