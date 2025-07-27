import { products } from '../data/products.js';
import { createProductCard } from '../components/ProductCard.js';
import { qs } from '../utils/helpers.js';

export const CollectionsPageTemplate = `
<div id="collectionsPage" class="page">
    <div class="container mx-auto px-6 py-16">
        <h1 class="text-5xl font-fancy text-center mb-4 text-[var(--brand-color)] reveal">Our Collections</h1>
        <p id="collection-subtitle" class="text-lg text-center text-gray-600 mb-6 reveal">Find the piece that tells your story.</p>
        
        <div class="flex flex-col gap-6 mb-12 reveal">
            <div id="filters" class="flex justify-center items-center flex-wrap gap-3 sm:gap-4"></div>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div id="material-filters" class="flex justify-center items-center flex-wrap gap-3">
                    <span class="font-semibold text-sm mr-2">Material:</span>
                </div>
                <div class="relative">
                    <select id="sort-products" class="appearance-none bg-white border border-[var(--accent-color)] text-[var(--brand-color)] font-semibold rounded-full py-2 px-5 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] cursor-pointer">
                        <option value="newest">Sort by: Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--brand-color)]">
                        <i data-lucide="chevron-down" class="w-4 h-4"></i>
                    </div>
                </div>
            </div>
        </div>

        <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"></div>
    </div>
</div>
`;

const renderProducts = (filterOrTag = 'all', searchTerm = '', sortBy = 'newest', materialFilter = 'all', addInteractionListeners) => {
    const productGrid = qs('#product-grid');
    if (!productGrid) return;

    let filteredProducts = [];
    const isCategoryFilter = ['all', 'earrings', 'necklaces', 'bracelets', 'others', 'combo'].includes(filterOrTag);
    
    if (isCategoryFilter) {
        filteredProducts = (filterOrTag === 'all') ? products : products.filter(p => p.category === filterOrTag);
    } else {
        filteredProducts = products.filter(p => p.tags && p.tags.includes(filterOrTag));
        const subtitle = qs('#collection-subtitle');
        if(subtitle){
            let dealName = filterOrTag.replace('under', 'Under ₹');
            if(filterOrTag === 'bogo') dealName = 'Buy 1 Get 1';
            if(filterOrTag === 'buy2get1') dealName = 'Buy 2 Get 1 Free';
            subtitle.textContent = `Showing deals for: ${dealName.charAt(0).toUpperCase() + dealName.slice(1)}`;
        }
    }

    if (materialFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.tags && p.tags.includes(materialFilter));
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.tags && p.tags.some(tag => tag.includes(searchTerm.toLowerCase())))
        );
    }

    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
        filteredProducts.sort((a, b) => b.newArrival - a.newArrival);
    }

    productGrid.innerHTML = filteredProducts.length > 0
        ? filteredProducts.map(createProductCard).join('')
        : `<div class="col-span-full text-center py-10 text-gray-500"><h3>No products found!</h3><p>Try adjusting your filters.</p></div>`;
    
    lucide.createIcons();
    addInteractionListeners('#product-grid');
};

const renderFilters = (activeFilterOrTag = 'all') => {
    const filtersContainer = qs('#filters');
    if (!filtersContainer) return;
    const categories = ['all', 'earrings', 'necklaces', 'bracelets', 'combo', 'others'];
    const categoryEmojis = { all: '✨', earrings: '💎', necklaces: '💫', bracelets: '🪬', combo: '💞', others: '👜' };
    
    const activeCategory = categories.includes(activeFilterOrTag) ? activeFilterOrTag : 'all';

    filtersContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
            ${categoryEmojis[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');

    const materialFiltersContainer = qs('#material-filters');
    if (!materialFiltersContainer) return;
    const materials = ['gold', 'silver', 'pearl'];
    const materialButtons = materials.map(mat => `
        <button class="material-filter-btn text-sm border border-gray-300 px-3 py-1 rounded-full transition-colors hover:bg-gray-200" data-material="${mat}">
            ${mat.charAt(0).toUpperCase() + mat.slice(1)}
        </button>
    `).join('');
    const existingSpan = materialFiltersContainer.querySelector('span');
    materialFiltersContainer.innerHTML = '';
    materialFiltersContainer.appendChild(existingSpan);
    materialFiltersContainer.innerHTML += materialButtons;
};

export const updateCollectionsView = (addInteractionListeners, filterOverride = null) => {
    const activeCategoryEl = qs('#filters .filter-btn.active');
    const activeMaterialEl = qs('#material-filters .material-filter-btn.active');
    const sortEl = qs('#sort-products');
    const searchEl = qs('#animated-search-input');

    const activeCategoryFromDOM = activeCategoryEl ? activeCategoryEl.dataset.category : 'all';
    const filterToUse = filterOverride || activeCategoryFromDOM;

    const activeMaterial = activeMaterialEl ? activeMaterialEl.dataset.material : 'all';
    const sortBy = sortEl ? sortEl.value : 'newest';
    const searchTerm = searchEl ? searchEl.value : '';
    
    renderProducts(filterToUse, searchTerm, sortBy, activeMaterial, addInteractionListeners);
};

export const initCollectionsPage = (addInteractionListeners, param) => {
    renderFilters(param || 'all');
    updateCollectionsView(addInteractionListeners, param);

    qs('#filters')?.addEventListener('click', e => {
        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');
            const subtitle = qs('#collection-subtitle');
            if(subtitle) subtitle.textContent = "Find the piece that tells your story.";
            updateCollectionsView(addInteractionListeners);
        }
    });

    qs('#sort-products')?.addEventListener('change', () => updateCollectionsView(addInteractionListeners));

    qs('#material-filters')?.addEventListener('click', e => {
        const materialBtn = e.target.closest('.material-filter-btn');
        if (materialBtn) {
            if (materialBtn.classList.contains('active')) {
                materialBtn.classList.remove('active', 'bg-[var(--brand-color)]', 'text-white', 'border-[var(--brand-color)]');
            } else {
                document.querySelectorAll('.material-filter-btn').forEach(btn => btn.classList.remove('active', 'bg-[var(--brand-color)]', 'text-white', 'border-[var(--brand-color)]'));
                materialBtn.classList.add('active', 'bg-[var(--brand-color)]', 'text-white', 'border-[var(--brand-color)]');
            }
            updateCollectionsView(addInteractionListeners);
        }
    });
};