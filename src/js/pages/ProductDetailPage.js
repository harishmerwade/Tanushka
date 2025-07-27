import { products } from '../data/products.js';
import { state } from '../services/state.js';
import { showPage } from '../App.js';
import { qs } from '../utils/helpers.js';

export const ProductDetailPageTemplate = `
<div id="productDetailPage" class="page">
    <div class="container mx-auto px-6 py-16">
        <div id="product-detail-content" class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"></div>
    </div>
</div>
`;

export const initProductDetailPage = (addInteractionListeners, productId) => {
    const container = qs('#product-detail-content');
    const product = products.find(p => p.id === productId);
    if (!container || !product) {
        showPage('collectionsPage');
        return;
    }
    const isWishlisted = state.wishlist.includes(product.id);

    const thumbnailsHTML = product.media.map((src, index) => `
        <button class="thumbnail-button w-16 h-16 rounded-md overflow-hidden focus:outline-none ${index === 0 ? 'active' : ''}" data-type="image" data-src="${src}">
            <img src="${src}" class="w-full h-full object-cover">
        </button>
    `).join('') + (product.video ? `
        <button class="thumbnail-button w-16 h-16 rounded-md overflow-hidden focus:outline-none relative bg-black" data-type="video" data-src="${product.video}">
            <img src="${product.media[0]}" class="w-full h-full object-cover opacity-50">
            <div class="play-icon"><i data-lucide="play" class="w-6 h-6"></i></div>
        </button>
    ` : '');

    container.innerHTML = `
        <div class="product-images">
            <div id="main-media-display" class="relative rounded-lg overflow-hidden shadow-lg hover-glow aspect-[4/5] bg-gray-100 mb-4">
                <img src="${product.media[0]}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x750/f8c8dc/7c3f44?text=Tanushka';">
            </div>
            <div id="thumbnail-container" class="flex items-center justify-center gap-3 flex-wrap">
                ${thumbnailsHTML}
            </div>
        </div>
        <div class="product-info">
            <h1 class="text-4xl lg:text-5xl font-fancy text-[var(--brand-color)] mb-4">${product.name}</h1>
            <p class="text-3xl font-fancy mb-6">₹${product.price}</p>
            <div id="product-description-container">
                <p id="product-description" class="text-gray-600 leading-relaxed mb-6">${product.description}</p>
            </div>
            <div class="my-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-center">
                <p class="font-semibold text-rose-800 flex items-center justify-center gap-2">
                    <i data-lucide="heart" class="w-5 h-5 text-rose-500 fill-current"></i>
                    Loved by ${Math.floor(Math.random() * 1000) + 200} Fashionistas this month
                </p>
                <div class="flex items-center justify-center mt-2">
                    <div class="flex items-center">
                        ${[...Array(5)].map((_, i) => `<i data-lucide="star" class="w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>`).join('')}
                    </div>
                    <span class="text-sm text-gray-600 ml-2">${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
                </div>
            </div>
            <div class="mb-8">
                <h4 class="font-bold text-lg mb-2">Materials & Care</h4>
                <p class="text-gray-600">${product.materials || "High-quality fashion jewelry materials."}</p>
                <p class="text-sm text-gray-500 mt-2">Care: Avoid contact with water, perfumes, and lotions. Store in a dry place.</p>
            </div>
            <div class="flex items-center gap-4">
                <button class="add-to-cart-btn btn-primary flex-grow py-3 px-8 text-lg font-bold" data-id="${product.id}">Add to Cart</button>
                <button class="add-to-wishlist-btn btn-secondary p-3 rounded-lg" data-id="${product.id}">
                    <i data-lucide="heart" class="w-6 h-6 pointer-events-none ${isWishlisted ? 'fill-current' : ''}"></i>
                </button>
                ${product.tryOnImage ? `<button class="try-on-btn btn-secondary p-3 rounded-lg" data-id="${product.id}"><i data-lucide="camera" class="w-6 h-6 pointer-events-none"></i></button>` : ''}
            </div>
        </div>
    `;
    lucide.createIcons();
    addInteractionListeners('#product-detail-content');

    const mainMediaDisplay = qs('#main-media-display');
    document.querySelectorAll('.thumbnail-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const type = button.dataset.type;
            const src = button.dataset.src;

            if (type === 'image') {
                mainMediaDisplay.innerHTML = `<img src="${src}" alt="${product.name}" class="w-full h-full object-cover">`;
            } else if (type === 'video') {
                mainMediaDisplay.innerHTML = `<video src="${src}" class="w-full h-full object-cover" controls autoplay loop></video>`;
            }
        });
    });
};