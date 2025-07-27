import { startCountdown } from '../utils/helpers.js';
import { openSpinningWheel } from '../components/SpinningWheel.js';
import { createProductCard } from '../components/ProductCard.js';
import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';

export const FriendshipDayPageTemplate = `
<div id="friendshipDayPage" class="page">
    <section class="festival-banner h-[60vh] flex items-center justify-center text-white text-center" style="background-image: url('https://placehold.co/1200x800/f8c8dc/7c3f44?text=Friendship');">
         <div class="relative z-10 p-4">
            <h1 class="text-5xl md:text-7xl font-script mb-4 reveal">Friendship Day Specials</h1>
            <p class="text-xl md:text-2xl mb-8 reveal" style="animation-delay: 200ms;">Celebrate Your Bond with a Touch of Sparkle 💞</p>
            <div id="friendship-countdown" class="flex justify-center gap-4 text-center reveal" style="animation-delay: 400ms;"></div>
        </div>
    </section>
    <section class="py-16 md:py-24">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-4 text-[var(--brand-color)] reveal">Gifts for Your Bestie</h2>
            <p class="max-w-2xl mx-auto text-lg text-gray-600 mb-12 reveal" style="animation-delay: 100ms;">Find the perfect matching sets and charming pieces.</p>
            <div id="product-grid" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"></div>
            <button id="friendship-spin-trigger" class="btn-primary mt-12 py-3 px-8 rounded-full text-lg font-semibold">Get a Special Discount!</button>
        </div>
    </section>
</div>
`;

const renderFriendshipProducts = (addInteractionListeners) => {
    const productGrid = qs('#product-grid');
    if (!productGrid) return;

    // Correctly filter products using the imported 'products' array
    const filteredProducts = products.filter(p => p.tags && p.tags.includes('friendship'));
    
    // Correctly render them using the imported 'createProductCard' function
    productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
    lucide.createIcons();
    addInteractionListeners('#product-grid');
};

export const initFriendshipDayPage = (addInteractionListeners) => {
    renderFriendshipProducts(addInteractionListeners);
    startCountdown('2025-08-03T00:00:00', 'friendship-countdown');
    qs('#friendship-spin-trigger')?.addEventListener('click', () => {
        openSpinningWheel('Friendship Day', 'Celebrate with a treat!', ['5% Off', '10% Off', 'BOGO', 'Free Gift', 'Try Again', '15% Off']);
    });
};