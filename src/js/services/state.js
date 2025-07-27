import { products } from '../data/products.js';
import { db } from './firebase.js';
import { showToast } from '../components/Toasts.js';
import { renderCart, updateCartCount } from '../components/Cart.js';
import { renderWishlist, updateWishlistCount } from '../components/Wishlist.js';

export let state = {
    cart: [],
    wishlist: [],
    currentUser: null,
    confirmationResult: null, // For OTP verification
};

export const setState = (newState) => {
    state = { ...state, ...newState };
};

export const syncUserData = async () => {
    if (!state.currentUser || !db) return;
    const userDocRef = db.collection('users').doc(state.currentUser.uid);
    
    // Sync Cart
    const cartRef = userDocRef.collection('cart');
    const cartSnapshot = await cartRef.get();
    state.cart = cartSnapshot.docs.map(doc => doc.data());

    // Sync Wishlist
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
        state.wishlist = userDoc.data().wishlist || [];
    }
    
    updateCartCount();
    updateWishlistCount();
    // Re-render components that depend on this data if they are visible
    if(document.getElementById('cartPage')) renderCart();
    renderWishlist();
};

export const addToCart = async (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItemIndex = state.cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        state.cart[existingItemIndex].quantity++;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    if (state.currentUser && db) {
        const itemRef = db.collection('users').doc(state.currentUser.uid).collection('cart').doc(String(productId));
        await itemRef.set(state.cart.find(item => item.id === productId));
    }
    
    showToast(`Added ${product.name} to cart!`, '🛒');
    updateCartCount();
};

export const toggleWishlist = async (productId) => {
    if (!state.currentUser) {
        showToast('Please log in to use the wishlist.', '🔒');
        document.getElementById('loginModal').classList.remove('hidden');
        return;
    }
    const product = products.find(p => p.id === productId);
    const userDocRef = db.collection('users').doc(state.currentUser.uid);

    if (state.wishlist.includes(productId)) {
        state.wishlist = state.wishlist.filter(id => id !== productId);
        await userDocRef.update({ wishlist: firebase.firestore.FieldValue.arrayRemove(productId) });
        showToast(`Removed ${product.name} from wishlist.`, '💔');
    } else {
        state.wishlist.push(productId);
        await userDocRef.update({ wishlist: firebase.firestore.FieldValue.arrayUnion(productId) });
        showToast(`Added ${product.name} to wishlist!`, '❤️');
    }
    
    document.querySelectorAll(`.add-to-wishlist-btn[data-id="${productId}"] i`).forEach(icon => {
        icon.classList.toggle('fill-current', state.wishlist.includes(productId));
    });
    renderWishlist();
    updateWishlistCount();
};