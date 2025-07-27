import { slides } from '../data/slides.js';
import { qs, qsa } from '../utils/helpers.js';

let currentSlide = 0;
let slideInterval;

const showSlide = (index) => {
    currentSlide = index;
    const slideData = slides[index];

    qsa('.hero-slide').forEach(slide => slide.classList.remove('active'));
    qs(`#slide-${slideData.id}`)?.classList.add('active');

    qsa('.slider-dot').forEach(dot => {
        dot.classList.toggle('bg-white', parseInt(dot.dataset.index) === index);
        dot.classList.toggle('w-6', parseInt(dot.dataset.index) === index);
        dot.classList.toggle('bg-white/50', parseInt(dot.dataset.index) !== index);
    });
};

const nextSlide = () => { showSlide((currentSlide + 1) % slides.length); };
const prevSlide = () => { showSlide((currentSlide - 1 + slides.length) % slides.length); };

export const renderSlider = () => {
    const sliderContainer = qs('#hero-slider');
    if (!sliderContainer) return;
    sliderContainer.innerHTML = slides.map(slide => `
        <div class="hero-slide" id="slide-${slide.id}">
            <div class="absolute inset-0 overflow-hidden"><div class="slide-bg-image absolute inset-0 w-full h-full" style="background-image: url('${slide.image}');"></div></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative z-10 container mx-auto px-6 h-full flex items-center">
                <div class="w-full grid md:grid-cols-2 gap-8 items-center">
                    <div class="slide-content-box text-left">
                        <h1 class="text-5xl lg:text-7xl font-fancy mb-4 drop-shadow-lg">${slide.title}</h1>
                        <p class="text-xl lg:text-2xl mb-8 font-light drop-shadow-md">${slide.subtitle}</p>
                        <div class="flex flex-wrap gap-4">
                            <a href="#collectionsPage" class="nav-link btn-primary py-3 px-8 text-lg font-semibold">Shop All</a>
                            ${slide.cta ? `<a href="${slide.cta.href}" class="nav-link btn-secondary py-3 px-8 text-lg font-semibold !border-white !text-white hover:!bg-white hover:!text-black">${slide.cta.text}</a>` : ''}
                        </div>
                    </div>
                    <div class="hidden md:block slide-image-box"><img src="${slide.boxImage}" class="rounded-lg shadow-2xl w-full max-w-sm ml-auto" alt="${slide.title}" onerror="this.style.display='none'"></div>
                </div>
            </div>
        </div>
    `).join('') + `<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3" id="slider-dots"></div>
                        <button id="slider-prev" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"><i data-lucide="chevron-left" class="w-8 h-8"></i></button>
                        <button id="slider-next" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"><i data-lucide="chevron-right" class="w-8 h-8"></i></button>`;

    sliderContainer.addEventListener('click', e => {
        if (e.target.closest('#slider-next')) nextSlide();
        if (e.target.closest('#slider-prev')) prevSlide();
        const dot = e.target.closest('.slider-dot');
        if (dot) showSlide(parseInt(dot.dataset.index));
    });

    const sliderDotsContainer = qs('#slider-dots');
    sliderDotsContainer.innerHTML = slides.map((_, index) => `<button class="slider-dot w-3 h-3 bg-white/50 rounded-full transition-all" data-index="${index}"></button>`).join('');
    
    showSlide(0);
    if(slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
};