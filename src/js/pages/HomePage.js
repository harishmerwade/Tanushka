import { renderSlider } from '../components/HeroSlider.js';
import { renderFaq } from '../components/Faq.js';
import { createProductCard } from '../components/ProductCard.js';
import { products } from '../data/products.js';
import { qs, initOurStoryAnimation } from '../utils/helpers.js';

export const HomePageTemplate = `
<div id="homePage" class="page">
    <section id="hero-slider" class="relative h-[85vh] min-h-[600px] text-white overflow-hidden"></section>
    
    <section id="new-arrivals" class="py-16 md:py-24">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-4 text-[var(--brand-color)] reveal">New Arrivals</h2>
            <p class="max-w-2xl mx-auto text-lg text-gray-600 mb-12 reveal" style="animation-delay: 100ms;">Be the first to wear our latest creations, crafted with love.</p>
            <div id="new-arrivals-grid" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"></div>
        </div>
    </section>
    
    <section id="why-us" class="py-16 md:py-24 bg-white">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-12 text-[var(--brand-color)] reveal">🌟 Why Choose Tanushka?</h2>
            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div class="why-us-card text-center reveal">
                    <div class="icon-bg"><i data-lucide="gem" class="w-10 h-10"></i></div>
                    <h3 class="text-2xl font-fancy mb-2 text-[var(--brand-color)]">Exquisite Craftsmanship</h3>
                    <p class="text-gray-600">Heritage-meets-modern design in every single piece, ensuring quality that lasts a lifetime.</p>
                </div>
                <div class="why-us-card text-center reveal" style="animation-delay: 200ms;">
                    <div class="icon-bg"><i data-lucide="package-check" class="w-10 h-10"></i></div>
                    <h3 class="text-2xl font-fancy mb-2 text-[var(--brand-color)]">A Joyful Experience</h3>
                    <p class="text-gray-600">Enjoy fast delivery across the country and easy, no-questions-asked returns.</p>
                </div>
                <div class="why-us-card text-center reveal" style="animation-delay: 400ms;">
                    <div class="icon-bg"><i data-lucide="heart-handshake" class="w-10 h-10"></i></div>
                    <h3 class="text-2xl font-fancy mb-2 text-[var(--brand-color)]">Loved By Thousands</h3>
                    <p class="text-gray-600">Join our community of 50,000+ happy customers who adore our sparkle.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="offers" class="py-16 md:py-24" style="background: linear-gradient(180deg, var(--bg-cream) 0%, var(--secondary-accent) 100%);">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-2 text-[var(--brand-color)] reveal">✨ Our Sweetest Deals ✨</h2>
            <p class="text-lg text-gray-600 mb-12 reveal" style="animation-delay: 100ms;">Don’t miss out on these incredible offers!</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="deal-card-new reveal" style="animation-delay: 200ms;">
                    <div class="relative z-10">
                        <div class="deal-icon">🎁</div>
                        <h3 class="deal-title font-fancy">Buy 1 Get 1</h3>
                        <p class="deal-subtitle">On select earring collections.</p>
                        <button data-filter="bogo" class="deal-button btn-deal">Shop BOGO</button>
                    </div>
                </div>
                <div class="deal-card-new reveal" style="animation-delay: 400ms;">
                    <div class="relative z-10">
                        <div class="deal-icon">💖</div>
                        <h3 class="deal-title font-fancy">Buy 2 Get 1 Free</h3>
                        <p class="deal-subtitle">Bundle up on your favs!</p>
                        <button data-filter="buy2get1" class="deal-button btn-deal">Shop Bundles</button>
                    </div>
                </div>
                <div class="deal-card-new reveal" style="animation-delay: 600ms;">
                    <div class="relative z-10">
                        <div class="deal-icon">🛍️</div>
                        <h3 class="deal-title font-fancy">Under Price Store</h3>
                        <p class="deal-subtitle">Cute & affordable sparkle.</p>
                        <div class="grid grid-cols-3 gap-2">
                            <button data-filter="under99" class="deal-button btn-deal text-sm">₹99</button>
                            <button data-filter="under199" class="deal-button btn-deal text-sm">₹199</button>
                            <button data-filter="under299" class="deal-button btn-deal text-sm">₹299</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="festival-offers" class="py-16 md:py-24 bg-white">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-fancy mb-2 text-[var(--brand-color)] reveal">The Festive Edit</h2>
            <p class="text-lg text-gray-600 mb-12 reveal" style="animation-delay: 100ms;">Celebrate every occasion with a touch of Tanushka magic.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <a href="#friendshipDayPage" class="nav-link festival-portal-card reveal" style="animation-delay: 200ms;">
                    <img src="https://placehold.co/600x400/f8c8dc/7c3f44?text=Friendship+Day" class="w-full h-full object-cover" onerror="this.style.backgroundColor='#f8c8dc';">
                    <div class="overlay"></div>
                    <div class="card-content">
                        <h3 class="text-3xl font-script">Friendship Day</h3>
                        <p class="font-semibold">Gifts for your Bestie 💞</p>
                    </div>
                </a>
                <a href="#rakhiPage" class="nav-link festival-portal-card reveal" style="animation-delay: 400ms;">
                    <img src="https://placehold.co/600x400/ffeadb/7c3f44?text=Rakhi" class="w-full h-full object-cover" onerror="this.style.backgroundColor='#ffeadb';">
                    <div class="overlay"></div>
                    <div class="card-content">
                        <h3 class="text-3xl font-script">Rakhi Specials</h3>
                        <p class="font-semibold">A Bond as Precious as Gold 🎁</p>
                    </div>
                </a>
            </div>
        </div>
    </section>
    
    <section id="our-story" class="py-16 md:py-24 bg-[var(--bg-cream)]">
        <div class="container mx-auto px-6">
            <div class="max-w-3xl mx-auto text-center reveal">
                <img src="https://placehold.co/150x150/ffeadb/7c3f44?text=Tanushka" alt="Founder Tanushka" class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg">
                <h2 class="text-4xl font-fancy text-[var(--brand-color)] mb-4">A Note from Our Founder</h2>
                <p class="text-xl text-gray-600 mb-12 font-script">"Jewelry is more than adornment; it's a piece of your story." - Tanushka</p>
            </div>
            <div class="grid md:grid-cols-2 gap-12 items-center reveal" style="animation-delay: 200ms;">
                <div id="story-animation-container" class="w-full h-80 md:h-96 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg shadow-xl relative overflow-hidden">
                    <canvas id="story-canvas"></canvas>
                </div>
                <div class="space-y-4 text-gray-700 leading-relaxed text-left">
                    <h3 class="text-3xl font-fancy text-[var(--brand-color)] mb-4">Our Story</h3>
                    <p>The story of Tanushka Jewelry begins not in a workshop, but in my grandmother’s cherished wooden jewelry box. As a little girl in Bengaluru, I was mesmerized by the stories each piece held – the delicate pearl necklace from her wedding day, the gold hoops gifted by my grandfather. They were symbols of love, milestones, and timeless elegance.</p>
                    <p>But as I grew, I realized that beautiful, meaningful jewelry often felt out of reach. I dreamt of creating a collection that blended the rich heritage of Indian craftsmanship with a modern, free-spirited soul. I wanted to design pieces that could be worn every day, not just saved for special occasions – jewelry that empowers you to tell your own story, celebrate your small wins, and express your unique sparkle.</p>
                    <p>Tanushka Jewelry is that dream come to life. Each piece is crafted with this vision in mind: to offer you affordable luxury, impeccable quality, and designs that feel both timeless and personal. Thank you for being a part of our journey.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="faq" class="py-16 md:py-24">
        <div class="container mx-auto px-6">
            <h2 class="text-4xl font-fancy text-center mb-12 text-[var(--brand-color)]">Frequently Asked Questions</h2>
            <div id="faq-container" class="max-w-3xl mx-auto space-y-4"></div>
        </div>
    </section>
</div>
`;

const renderNewArrivals = (addInteractionListeners) => {
    const grid = qs('#new-arrivals-grid');
    if (!grid) return;
    const newProducts = products.filter(p => p.newArrival).slice(0, 4);
    grid.innerHTML = newProducts.map(createProductCard).join('');
    lucide.createIcons();
    addInteractionListeners('#new-arrivals-grid');
};

export const initHomePage = (addInteractionListeners) => {
    renderSlider();
    renderNewArrivals(addInteractionListeners);
    renderFaq();
};

export const initHomePageObserver = (target) => {
    if (target.id === 'our-story') {
        setTimeout(initOurStoryAnimation, 100);
    }
}