import { renderCart } from '../components/Cart.js';

export const CartPageTemplate = `
<div id="cartPage" class="page">
    <div class="container mx-auto px-6 py-16">
        <h1 class="text-4xl font-fancy text-center mb-12 text-[var(--brand-color)] reveal">Your Shopping Cart</h1>
        <div id="cart-content" class="grid grid-cols-1 lg:grid-cols-3 gap-8"></div>
    </div>
</div>
`;

export const initCartPage = () => {
    renderCart();
};