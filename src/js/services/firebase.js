// --- FIREBASE CONFIGURATION (IMPORTANT!) ---
// Replace this with your own Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyCXRLQYZasQb-fKFmazeAGWvxhlHsf2ZxU",
  authDomain: "tanushka-web.firebaseapp.com",
  projectId: "tanushka-web",
  storageBucket: "tanushka-web.firebasestorage.app",
  messagingSenderId: "64010331998",
  appId: "1:64010331998:web:d5062b104a19317b8dd1cf",
  measurementId: "G-0CJRH3Q42E"
};

// --- INITIALIZE FIREBASE & SERVICES ---
let app, auth, db;
try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
} catch (e) {
    console.error("Firebase initialization failed. Please provide your Firebase config.", e);
    const body = document.querySelector('body');
    const warningDiv = document.createElement('div');
    warningDiv.innerHTML = '<strong>Configuration Error:</strong> Firebase is not configured. Login and other features will not work. Please add your Firebase config to the script.';
    warningDiv.style.cssText = 'background: red; color: white; text-align: center; padding: 10px; position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;';
    body.prepend(warningDiv);
}

export { app, auth, db };

export const setupRecaptcha = () => {
    if (!auth) return;
    try {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {}
        });
    } catch (e) {
        console.error("ReCAPTCHA setup failed. This can happen on repeated reloads in dev.", e);
    }
};