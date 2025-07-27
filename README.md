# Tanushka Jewelry Website (Refactored)

This is a fully functional, modular e-commerce website for Tanushka Jewelry. It has been refactored from a single HTML file into a clean, scalable project structure.

## Features

-   Single Page Application (SPA) architecture
-   Product listings, collections, and detail pages
-   Shopping Cart and Wishlist functionality
-   Firebase Phone (OTP) Authentication
-   Virtual Jewelry Try-On using MediaPipe
-   AI-powered Chatbot and Product Descriptions using Gemini API
-   Interactive elements like a spinning wheel for discounts
-   Fully responsive design for desktop, tablet, and mobile

## Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.
-   A Firebase project.
-   A Google AI (Gemini) API Key.

## Setup Instructions

1.  **Clone the repository or download the source code.**

2.  **Install Dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    -   Open `src/js/services/firebase.js`.
    -   Replace the placeholder `firebaseConfig` object with your own Firebase project's configuration keys.

4.  **Configure Gemini API:**
    -   Open `src/js/services/geminiApi.js`.
    -   Replace the two instances of `const apiKey = "";` with your Google AI (Gemini) API key.
    -   **Important**: For production, never hardcode API keys. Use environment variables. This setup is for development simplicity.

5.  **Add Placeholder Assets:**
    -   The virtual try-on feature requires PNG images of the jewelry.
    -   Make sure the `src/assets/try-on/` directory exists and contains placeholder images named `earring-1.png`, `necklace-1.png`, etc., as referenced in `src/js/data/products.js`. If you don't have these, the try-on feature for specific products will not work, but the rest of the site will function correctly.

## Running the Application

After installation and configuration, start the development server by running:

```bash
npm start