import { state } from '../services/state.js';
import { db } from '../services/firebase.js';
import { qs } from '../utils/helpers.js';

export const updateCartCount = () => {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    qs('#cart-count').textContent = count;
};

const removeFromCart = async (productId) => {
    state.cart = state.cart.filter(i => i.id !== productId);
    if (state.currentUser && db) {
        await db.collection('users').doc(state.currentUser.uid).collection('cart').doc(String(productId)).delete();
    }
    renderCart();
    updateCartCount();
};

const updateCartItemQuantity = async (productId, change) => {
    const itemIndex = state.cart.findIndex(i => i.id === productId);
    if (itemIndex > -1) {
        state.cart[itemIndex].quantity += change;
        if (state.cart[itemIndex].quantity <= 0) {
            await removeFromCart(productId);
        } else {
            if (state.currentUser && db) {
                const itemRef = db.collection('users').doc(state.currentUser.uid).collection('cart').doc(String(productId));
                await itemRef.update({ quantity: state.cart[itemIndex].quantity });
            }
            renderCart();
            updateCartCount();
        }
    }
};

export const renderCart = () => {
    const cartContent = qs('#cart-content');
    if (!cartContent) return;

    if (state.cart.length === 0) {
        cartContent.innerHTML = `<div class="lg:col-span-3 text-center py-16"><h2 class="text-2xl font-semibold text-gray-600">Your cart is empty</h2><p class="mt-4 text-gray-500">Looks like you haven't added any sparkle yet!</p><a href="#collectionsPage" class="nav-link btn-primary py-3 px-8 text-lg font-semibold mt-8 inline-block">Continue Shopping</a></div>`;
        return;
    }

    const itemsHtml = state.cart.map(item => `
        <div class="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
            <img src="${item.media[0]}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md" onerror="this.src='https://placehold.co/96x96/f8c8dc/7c3f44?text=Img';">
            <div class="flex-grow">
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-sm text-gray-500">${item.category}</p>
                <p class="font-semibold text-[var(--brand-color)] mt-1">₹${item.price}</p>
            </div>
            <div class="flex items-center gap-3">
                <button class="quantity-change-btn p-1 rounded-full bg-gray-200 hover:bg-gray-300" data-id="${item.id}" data-change="-1"><i data-lucide="minus" class="w-4 h-4 pointer-events-none"></i></button>
                <span>${item.quantity}</span>
                <button class="quantity-change-btn p-1 rounded-full bg-gray-200 hover:bg-gray-300" data-id="${item.id}" data-change="1"><i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i></button>
            </div>
            <p class="font-bold w-20 text-right">₹${item.price * item.quantity}</p>
            <button class="remove-from-cart-btn text-gray-400 hover:text-red-500" data-id="${item.id}"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
        </div>
    `).join('');

    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    const summaryHtml = `
        <div class="lg:col-span-2 space-y-4">${itemsHtml}</div>
        <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <h2 class="text-2xl font-fancy border-b pb-3 mb-4">Order Summary</h2>
                <div class="space-y-2">
                    <div class="flex justify-between"><p>Subtotal</p><p>₹${subtotal.toFixed(2)}</p></div>
                    <div class="flex justify-between"><p>Tax (5%)</p><p>₹${tax.toFixed(2)}</p></div>
                    <div class="flex justify-between font-bold text-lg border-t pt-2 mt-2"><p>Total</p><p>₹${total.toFixed(2)}</p></div>
                </div>
                <button class="btn-primary w-full py-3 mt-6 text-lg font-bold">Proceed to Checkout</button>
            </div>
        </div>`;

    cartContent.innerHTML = summaryHtml;
    lucide.createIcons();

    cartContent.addEventListener('click', e => {
        const changeBtn = e.target.closest('.quantity-change-btn');
        const removeBtn = e.target.closest('.remove-from-cart-btn');
        if (changeBtn) {
            updateCartItemQuantity(parseInt(changeBtn.dataset.id), parseInt(changeBtn.dataset.change));
        }
        if (removeBtn) {
            removeFromCart(parseInt(removeBtn.dataset.id));
        }
    });
};