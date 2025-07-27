import { state } from '../services/state.js';

export const createProductCard = (p, index) => {
    const isWishlisted = state.wishlist.includes(p.id);
    const image1 = p.media && p.media.length > 0 ? p.media[0] : 'https://placehold.co/400x500/f8c8dc/7c3f44?text=Tanushka';
    const image2 = p.media && p.media.length > 1 ? p.media[1] : image1;

    return `
    <div class="text-center product-card" style="opacity: 0; animation-delay: ${index * 60}ms">
        <a href="#productDetailPage" class="product-card-link group" data-id="${p.id}">
            <div class="relative product-image-container bg-gray-100 rounded-lg overflow-hidden mb-4 hover-glow aspect-[4/5]">
                <img src="${image1}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover front-image transition-opacity duration-400" loading="lazy" onerror="this.src='https://placehold.co/400x500/f8c8dc/7c3f44?text=Tanushka';">
                <img src="${image2}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover back-image" loading="lazy" onerror="this.style.display='none';">
                <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button class="add-to-wishlist-btn bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white text-[var(--brand-color)] transition-colors" data-id="${p.id}">
                        <i data-lucide="heart" class="w-5 h-5 pointer-events-none ${isWishlisted ? 'fill-current' : ''}"></i>
                    </button>
                    ${p.tryOnImage ? `<button class="try-on-btn bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white text-[var(--brand-color)] transition-colors" data-id="${p.id}"><i data-lucide="camera" class="w-5 h-5 pointer-events-none"></i></button>` : ''}
                </div>
                <button class="add-to-cart-btn absolute bottom-0 left-0 right-0 bg-[var(--brand-color)] text-white font-bold py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300" data-id="${p.id}">Add to Cart</button>
            </div>
            <h3 class="font-bold text-lg">${p.name}</h3>
            <p class="text-[var(--brand-color)]">₹${p.price}</p>
            <div class="flex items-center justify-center mt-2">
                <div class="flex items-center">
                    ${[...Array(5)].map((_, i) => `<i data-lucide="star" class="w-4 h-4 ${i < Math.round(p.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>`).join('')}
                </div>
                <span class="text-xs text-gray-500 ml-2">(${p.reviews})</span>
            </div>
        </a>
    </div>
    `;
};