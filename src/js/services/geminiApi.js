import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';

// IMPORTANT: Replace with your actual Gemini API Key.
// For production, use environment variables and a backend proxy.
const apiKey = "AIzaSyCWtEt2lzkgAEz1DoTuXjz6qAs7wmoEZTE";

const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

const callGeminiApi = async (prompt) => {
    if (!apiKey) {
        console.error("Gemini API key is missing.");
        throw new Error("API key not configured.");
    }

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates[0].content.parts[0].text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("Invalid response structure from Gemini API:", result);
        throw new Error("Invalid response structure from API.");
    }
};

export const findGiftWithGemini = async (occasion, style) => {
    const productList = products.map(p => `- ${p.name} (ID: ${p.id}, Category: ${p.category}, Tags: ${p.tags.join(', ')})`).join('\n');
    const prompt = `You are a helpful jewelry assistant for Tanushka Jewelry. A customer is looking for a gift.
    Occasion: ${occasion}
    Recipient's Style: ${style}

    Here is a list of available products:
    ${productList}

    Based on the occasion and style, recommend the top 2 products. Your response MUST be only a JSON array of the product IDs, like this: [id1, id2]. Do not include any other text, explanation, or markdown formatting.`;

    try {
        const textResponse = await callGeminiApi(prompt);
        const cleanedResponse = textResponse.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Gemini Gift Finder Error:", error);
        // Fallback: return some new arrivals if API fails
        return products.filter(p => p.newArrival).slice(0, 2).map(p => p.id);
    }
};

export const getPersonalizedDescription = async (product, style) => {
    const outputDiv = qs('#gemini-description-output');
    if (!outputDiv) return;

    outputDiv.style.display = 'block';
    outputDiv.innerHTML = '<span class="animate-spin inline-block mr-2">✨</span>Generating...';

    const prompt = `You are a creative copywriter for a jewelry brand called Tanushka. Rewrite the following product description in a more "${style}" style. Make it brief, engaging, and suitable for a product page.

    Product Name: ${product.name}
    Original Description: ${product.description}
    
    Your new description should be 1-2 short paragraphs. Do not include the product name in your response.`;

    try {
        const newDescription = await callGeminiApi(prompt);
        outputDiv.innerHTML = newDescription.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("Gemini Description Error:", error);
        outputDiv.innerHTML = 'Sorry, we couldn\'t generate a new description right now. Please try again.';
    }
};