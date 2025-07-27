import { faqData } from '../data/faqData.js';
import { qs } from '../utils/helpers.js';

export const renderFaq = () => {
    const container = qs('#faq-container');
    if (!container) return;
    container.innerHTML = faqData.map((item) => `
        <div class="border-b border-gray-200 py-4">
            <details class="group">
                <summary class="flex justify-between items-center font-semibold cursor-pointer text-lg text-gray-800 list-none">
                    <span>${item.q}</span>
                    <span class="faq-icon text-[var(--brand-color)]"><i data-lucide="plus"></i></span>
                </summary>
                <p class="text-gray-600 mt-4 leading-relaxed pl-2">${item.a}</p>
            </details>
        </div>
    `).join('');
    lucide.createIcons();
};