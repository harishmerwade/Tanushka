import { state, toggleWishlist } from '../services/state.js';
import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';

export const updateWishlistCount = () => {
    qs('#wishlist-count').textContent = state.wishlist.length;
};

export const initWishlistPanel = () => {
    qs('#wishlistBtn').addEventListener('click', () => {
        qs('#wishlistPanel').classList.remove('translate-x-full');
    });
    qs('#closeWishlistBtn').addEventListener('click', () => {
        qs('#wishlistPanel').classList.add('translate-x-full');
    });
    renderWishlist();
};

export const renderWishlist = () => {
    const container = qs('#wishlist-items');
    if (!container) return;

    if (state.wishlist.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-10">Your wishlist is empty. Start adding some sparkle!</p>`;
        return;
    }

    container.innerHTML = state.wishlist.map(id => {
        const p = products.find(prod => prod.id === id);
        if (!p) return '';
        return `
        <div class="flex items-center gap-4 mb-4 bg-white p-2 rounded-lg">
            <img src="${p.media[0]}" alt="${p.name}" class="w-16 h-16 object-cover rounded-md" onerror="this.src='https://placehold.co/64x64/f8c8dc/7c3f44?text=Img';">
            <div class="flex-grow"><h4 class="font-bold">${p.name}</h4><p class="text-[var(--brand-color)]">₹${p.price}</p></div>
            <button class="remove-from-wishlist-btn text-gray-400 hover:text-red-500 p-2" data-id="${p.id}"><i data-lucide="x" class="w-5 h-5 pointer-events-none"></i></button>
        </div>`;
    }).join('');

    lucide.createIcons();
    container.querySelectorAll('.remove-from-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleWishlist(parseInt(btn.dataset.id)));
    });
};