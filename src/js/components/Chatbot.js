import { findGiftWithGemini } from '../services/geminiApi.js';
import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';
import { showPage } from '../App.js';

const chatbotWindow = qs('#chatbot-window');
const chatbotToggleBtn = qs('#chatbot-toggle-btn');
const closeChatbotBtn = qs('#close-chatbot-btn');
const chatbotMessages = qs('#chatbot-messages');
const chatbotInput = qs('#chatbot-input');
const chatbotSendBtn = qs('#chatbot-send-btn');
const chatbotOptions = qs('#chatbot-options');

let chatState = 'IDLE';
let giftFinderState = {};

const toggleChatbot = (forceOpen = null) => {
    if (!chatbotWindow || !chatbotToggleBtn) return;
    const isOpen = !chatbotWindow.classList.contains('hidden');
    const openIcon = chatbotToggleBtn.querySelector('.open-icon');
    const closeIcon = chatbotToggleBtn.querySelector('.close-icon');
    const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;
    chatbotWindow.classList.toggle('hidden', !shouldOpen);
    openIcon?.classList.toggle('hidden', shouldOpen);
    closeIcon?.classList.toggle('hidden', !shouldOpen);
};

const addMessage = (content, sender, options = []) => {
    if (!chatbotMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message max-w-[85%] mb-3 clear-both ${sender === 'user' ? 'float-right' : 'float-left'}`;

    const bubble = document.createElement('div');
    bubble.className = `p-3 rounded-2xl ${sender === 'user' ? 'bg-[var(--brand-color)] text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`;
    bubble.innerHTML = content;
    messageDiv.appendChild(bubble);

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    renderChatOptions(options);
};

const renderChatOptions = (options) => {
    if (!chatbotOptions) return;
    chatbotOptions.innerHTML = '';
    if (options.length > 0) {
        setTimeout(() => {
            options.forEach(opt => {
                const button = document.createElement('button');
                button.textContent = opt.text;
                button.className = 'chat-options-btn text-sm border border-[var(--accent-color)] text-[var(--brand-color)] font-semibold px-3 py-1 rounded-full transition-colors hover:bg-[var(--accent-color)]';
                button.dataset.payload = opt.payload;
                chatbotOptions.appendChild(button);
            });
        }, 300);
    }
};

const renderProductInChat = (product) => {
    return `
    <div class="chat-product-card" data-id="${product.id}">
        <img src="${product.media[0]}" class="w-12 h-12 object-cover rounded-md" onerror="this.src='https://placehold.co/48x48/f8c8dc/7c3f44?text=Img';"/>
        <div class="flex-1">
            <p class="font-bold text-sm">${product.name}</p>
            <p class="text-xs text-[var(--brand-color)] font-semibold">₹${product.price}</p>
        </div>
    </div>
    `;
};

const showTypingIndicator = () => {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'chat-message max-w-[85%] mb-3 clear-both float-left';
    typingIndicator.innerHTML = `<div class="p-3 rounded-2xl bg-gray-200 text-gray-500 rounded-bl-none italic">Tia is typing...</div>`;
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const removeTypingIndicator = () => {
    const indicator = qs('#typing-indicator');
    if (indicator) {
        chatbotMessages.removeChild(indicator);
    }
};

const processUserInput = async (input) => {
    // State-based responses
    if (chatState === 'TRACKING_ORDER') {
        if (input.match(/\d{5,}/)) {
            addMessage("Thanks! Let me check... Your order is currently out for delivery and should arrive by tomorrow evening! 🚚", 'bot', [
                { text: "Browse Products", payload: "products" },
                { text: "See Offers", payload: "offers" },
                { text: "Main Menu", payload: "main_menu" }
            ]);
        } else {
            addMessage("That doesn't look like a valid order ID. It's usually a 5+ digit number. Could you please provide the correct one?", 'bot', [
                { text: "Back to Menu", payload: "main_menu" }
            ]);
        }
        chatState = 'IDLE';
        return;
    }
    if (chatState === 'AWAITING_GIFT_OCCASION') {
        giftFinderState.occasion = input;
        chatState = 'AWAITING_GIFT_STYLE';
        addMessage("Great! Now, how would you describe their style?", 'bot', [
            { text: "Elegant & Classic", payload: "elegant" },
            { text: "Minimalist & Modern", payload: "minimalist" },
            { text: "Boho & Artsy", payload: "boho" },
            { text: "Bold & Statement", payload: "statement" },
        ]);
        return;
    }
    if (chatState === 'AWAITING_GIFT_STYLE') {
        giftFinderState.style = input;
        chatState = 'IDLE';
        await findGift();
        return;
    }

    // Keyword/Intent-based routing
    if (input.includes('hello') || input.includes('hi') || input === 'main_menu') {
        return showMainMenu();
    }
    if (input.match(/product|item|jewelry|show me|see all|collection/)) {
        return handleProductQuery(input);
    }
    if (input.match(/offer|deal|discount/)) {
        return handleOfferQuery();
    }
    if (input.match(/track|order|shipping|delivery/)) {
        return handleTrackingQuery();
    }
    if (input.match(/return|policy|exchange/)) {
        return handleReturnQuery();
    }
    if (input.match(/suggest|recommend|help me choose/)) {
        return handleSuggestionQuery();
    }
    if (input.match(/problem|issue|not working|bug/)) {
        return handleWebsiteIssue();
    }
    if (input.match(/contact|support|talk to/)) {
        addMessage("You can reach our support team by emailing <a href='mailto:support@tanushka.com' class='text-[var(--brand-color)] font-bold'>support@tanushka.com</a>. We're happy to help!", 'bot', [
            { text: "Back to Menu", payload: "main_menu" }
        ]);
        return;
    }

    // Handle direct payloads from buttons
    switch (input) {
        case 'products': return handleProductQuery();
        case 'offers': return handleOfferQuery();
        case 'shipping': return handleTrackingQuery();
        case 'returns': return handleReturnQuery();
        case 'track_order': return handleTrackingQuery(true);
        case 'suggestions': return handleSuggestionQuery();
        case 'website_issue': return handleWebsiteIssue();
        case 'gift_finder': return startGiftFinder();
        case 'returnPolicyPage':
            showPage('returnPolicyPage');
            toggleChatbot(false);
            return;
        case 'category_earrings':
        case 'category_necklaces':
        case 'category_bracelets':
        case 'category_combo':
        case 'category_all':
            const category = input.split('_')[1];
            showPage('collectionsPage', category);
            toggleChatbot(false);
            addMessage(`Great choice! I'm taking you to our ${category} collection now.`, 'bot');
            return;
        default:
            return handleFallback();
    }
};

const handleUserInput = () => {
    const userInput = chatbotInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, 'user');
    chatbotInput.value = '';
    chatbotOptions.innerHTML = '';

    setTimeout(() => {
        showTypingIndicator();

        setTimeout(async () => {
            removeTypingIndicator();
            await processUserInput(userInput.toLowerCase());
        }, 1200);
    }, 400);
};

// --- Chatbot Conversation Flows ---
const showMainMenu = () => {
    addMessage("Hello! I'm Tia, your personal shopping assistant. How can I help you sparkle today?", 'bot', [
        { text: "🛍️ View Products", payload: "products" },
        { text: "🎁 Find a Gift ✨", payload: "gift_finder" },
        { text: "🎉 Current Offers", payload: "offers" },
        { text: "🚚 Track My Order", payload: "track_order" },
        { text: "↩️ Return Policy", payload: "returns" },
        { text: "💡 Get a Suggestion", payload: "suggestions" },
    ]);
};

const handleProductQuery = (input = "") => {
    const searchTerms = ['earring', 'necklace', 'bracelet', 'ring', 'anklet', 'gold', 'silver', 'pearl'];
    const foundTerm = searchTerms.find(term => input.includes(term));

    if (foundTerm) {
        const results = products.filter(p =>
            p.name.toLowerCase().includes(foundTerm) ||
            p.category.toLowerCase().includes(foundTerm) ||
            (p.tags && p.tags.some(tag => tag.includes(foundTerm)))
        );
        if (results.length > 0) {
            addMessage(`I found ${results.length} item(s) matching "${foundTerm}":`, 'bot');
            results.slice(0, 3).forEach(p => addMessage(renderProductInChat(p), 'bot'));
            addMessage(`You can see all our items in the collections page!`, 'bot', [
                { text: "Go to Collections", payload: "category_all" },
                { text: "Back to Menu", payload: "main_menu" }
            ]);
        } else {
            addMessage(`I couldn't find any items matching "${foundTerm}". How about I show you some of our bestsellers?`, 'bot', [
                { text: "Yes, please!", payload: "suggestions" },
                { text: "Back to Menu", payload: "main_menu" }
            ]);
        }
        return;
    }

    addMessage("We have a beautiful selection! What are you interested in?", 'bot', [
        { text: "Earrings", payload: "category_earrings" },
        { text: "Necklaces", payload: "category_necklaces" },
        { text: "Bracelets", payload: "category_bracelets" },
        { text: "Combos", payload: "category_combo" },
        { text: "See All", payload: "category_all" },
        { text: "Back to Menu", payload: "main_menu" }
    ]);
};

const handleOfferQuery = () => {
    showPage('homePage');
    setTimeout(() => {
        const offersSection = qs('#offers');
        if (offersSection) {
            offersSection.scrollIntoView({ behavior: 'smooth' });
            toggleChatbot(false);
        }
    }, 100);
    addMessage("You've got a great eye for a deal! I'm taking you to our offers section now. ✨", 'bot');
};

const handleTrackingQuery = (startTracking = false) => {
    if (startTracking) {
        addMessage("Sure, I can help with that. Please provide your Order ID.", 'bot');
        chatState = 'TRACKING_ORDER';
    } else {
        addMessage("We offer fast & free shipping on all orders over ₹999! Most orders arrive within 3-5 business days.", 'bot', [
            { text: "Track My Order", payload: "track_order" },
            { text: "Back to Menu", payload: "main_menu" }
        ]);
    }
};

const handleReturnQuery = () => {
    addMessage("We have a 7-day no-questions-asked return policy. If you don't love it, simply contact us to start a return.", 'bot', [
        { text: "Read Full Policy", payload: "returnPolicyPage" },
        { text: "Back to Menu", payload: "main_menu" }
    ]);
};

const handleSuggestionQuery = () => {
    const suggestions = products.filter(p => p.newArrival).slice(0, 2);
    addMessage("Of course! Here are a couple of our newest arrivals that are very popular:", 'bot');
    suggestions.forEach(p => addMessage(renderProductInChat(p), 'bot'));
    addMessage("What do you think?", 'bot', [
        { text: "Show me more", payload: "category_all" },
        { text: "Back to Menu", payload: "main_menu" }
    ]);
};

const handleWebsiteIssue = () => {
    addMessage("I'm sorry to hear you're having trouble! Here are a few things you can try:", 'bot');
    addMessage("1. Try refreshing the page.<br>2. Make sure your internet connection is stable.<br>3. If the problem continues, you can contact our support team directly.", 'bot', [
        { text: "Email Support", payload: "contact_support" },
        { text: "Back to Menu", payload: "main_menu" }
    ]);
};

const handleFallback = () => {
    addMessage("I'm sorry, I'm still learning and didn't quite understand that. I can help you with things like finding products, checking offers, and tracking your order.", 'bot', [
        { text: "Main Menu", payload: "main_menu" }
    ]);
};

const startGiftFinder = () => {
    chatState = 'AWAITING_GIFT_OCCASION';
    giftFinderState = {};
    addMessage("I can help with that! What's the occasion for this gift?", 'bot', [
        { text: "Birthday", payload: "birthday" },
        { text: "Anniversary", payload: "anniversary" },
        { text: "Just Because", payload: "just because" },
        { text: "Back to Menu", payload: "main_menu" }
    ]);
};

const findGift = async () => {
    addMessage(`Okay, finding the perfect gift for a ${giftFinderState.occasion} with a ${giftFinderState.style} style. One moment...`, 'bot');
    showTypingIndicator();
    try {
        const recommendedIds = await findGiftWithGemini(giftFinderState.occasion, giftFinderState.style);
        removeTypingIndicator();
        addMessage("Here are a couple of ideas I think they'll love:", 'bot');
        recommendedIds.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
                addMessage(renderProductInChat(product), 'bot');
            }
        });
        addMessage("What do you think of these?", 'bot', [
            { text: "Start Over", payload: "gift_finder" },
            { text: "Main Menu", payload: "main_menu" }
        ]);
    } catch (error) {
        removeTypingIndicator();
        console.error("Chatbot gift finder error:", error);
        addMessage("I'm having a little trouble coming up with ideas right now. Let me suggest some of our best-sellers instead!", 'bot');
        handleSuggestionQuery();
    }
};

// --- Initialization ---
export const initChatbot = () => {
    chatbotToggleBtn?.addEventListener('click', () => toggleChatbot());
    closeChatbotBtn?.addEventListener('click', () => toggleChatbot(false));

    chatbotSendBtn?.addEventListener('click', handleUserInput);
    chatbotInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    chatbotOptions?.addEventListener('click', e => {
        const target = e.target.closest('.chat-options-btn');
        if (target) {
            const userInput = target.textContent;
            const payload = target.dataset.payload;
            addMessage(userInput, 'user');
            chatbotInput.value = '';
            chatbotOptions.innerHTML = '';
            setTimeout(() => processUserInput(payload), 200);
        }
    });

    chatbotMessages?.addEventListener('click', e => {
        const target = e.target.closest('.chat-product-card');
        if (target && target.dataset.id) {
            showPage('productDetailPage', parseInt(target.dataset.id));
            toggleChatbot(false);
        }
    });

    showMainMenu();
};