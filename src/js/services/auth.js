import { auth, db, setupRecaptcha } from './firebase.js';
import { setState, state, syncUserData } from './state.js';
import { showToast } from '../components/Toasts.js';

const loginModal = document.getElementById('loginModal');
const userDetailsModal = document.getElementById('userDetailsModal');
const phoneView = document.getElementById('phone-view');
const otpView = document.getElementById('otp-view');

export const openLoginModal = () => {
    if (loginModal) {
        loginModal.classList.remove('hidden');
        phoneView.classList.remove('hidden');
        otpView.classList.add('hidden');
        // Lazy setup recaptcha only when modal is opened
        if (!window.recaptchaVerifier) {
            setupRecaptcha();
        }
    }
};

export const closeLoginModal = () => loginModal?.classList.add('hidden');
const closeUserDetailsModal = () => userDetailsModal?.classList.add('hidden');

export const sendOtp = () => {
    if (!auth) { showToast("Authentication service not available.", "❌"); return; }
    const phoneNumberInput = document.getElementById('phoneNumber');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const phoneNumber = `+91${phoneNumberInput.value}`;

    if (phoneNumberInput.value.length !== 10) {
        showToast("Please enter a valid 10-digit number.", "📱");
        return;
    }
    
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = 'Sending...';

    auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then(result => {
            setState({ confirmationResult: result });
            phoneView.classList.add('hidden');
            otpView.classList.remove('hidden');
            document.getElementById('otpPhoneNumber').textContent = phoneNumber;
            showToast('OTP sent successfully!', '✅');
        }).catch(error => {
            console.error("OTP Error:", error);
            showToast(`Error: ${error.message}`, '❌');
            if (window.grecaptcha && typeof window.grecaptcha.reset === 'function' && window.recaptchaVerifier.widgetId !== undefined) {
                 grecaptcha.reset(window.recaptchaVerifier.widgetId);
            }
        }).finally(() => {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        });
};

export const verifyOtp = () => {
    const otpInput = document.getElementById('otpInput');
    const verifyBtn = document.getElementById('verifyOtpBtn');
    const code = otpInput.value;

    if (code.length !== 6 || !state.confirmationResult) {
        showToast('Please enter a valid 6-digit OTP.', '🔢');
        return;
    }
    
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';

    state.confirmationResult.confirm(code).then(result => {
        closeLoginModal();
    }).catch(error => {
        console.error("Verify OTP Error:", error);
        showToast('Invalid OTP. Please try again.', '❌');
    }).finally(() => {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify OTP';
    });
};

const saveUserDetails = (e) => {
    e.preventDefault();
    if (!state.currentUser || !db) return;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const dob = document.getElementById('userDob').value;

    const userData = {
        name,
        email,
        dob,
        phoneNumber: state.currentUser.phoneNumber,
        wishlist: []
    };

    db.collection('users').doc(state.currentUser.uid).set(userData)
        .then(() => {
            closeUserDetailsModal();
            showToast(`Welcome, ${name.split(' ')[0]}!`, '🎉');
            updateUserUI(userData);
            syncUserData();
        })
        .catch(error => {
            console.error("Error saving user details: ", error);
            showToast('Could not save details. Please try again.', '❌');
        });
};

const updateUserUI = (userData) => {
    const container = document.getElementById('user-auth-container');
    if (userData) {
        container.innerHTML = `
            <div class="group relative">
                <button class="p-2 flex items-center gap-2">
                    <i data-lucide="user-circle-2" class="w-6 h-6"></i>
                    <span class="hidden sm:inline font-semibold">${userData.name.split(' ')[0]}</span>
                </button>
                <div class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                    <button id="logoutBtn" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
            </div>
        `;
        document.getElementById('logoutBtn')?.addEventListener('click', () => auth.signOut());
    } else {
        container.innerHTML = `<button id="loginBtn" class="p-2"><i data-lucide="user" class="w-6 h-6"></i></button>`;
        document.getElementById('loginBtn')?.addEventListener('click', openLoginModal);
    }
    lucide.createIcons();
};

export const initializeAuth = () => {
    if (!auth) return;

    auth.onAuthStateChanged(async user => {
        if (user) {
            setState({ currentUser: user });
            const userDocRef = db.collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();

            if (!userDoc.exists()) {
                userDetailsModal.classList.remove('hidden');
            } else {
                const userData = userDoc.data();
                showToast(`Welcome back, ${userData.name.split(' ')[0]}!`, '👋');
                updateUserUI(userData);
                await syncUserData();
            }
        } else {
            setState({ currentUser: null, cart: [], wishlist: [] });
            updateUserUI(null);
            syncUserData(); // This will clear the UI counts
        }
    });

    // Event listeners for modals
    document.getElementById('loginBtn')?.addEventListener('click', openLoginModal);
    document.getElementById('closeLoginBtn')?.addEventListener('click', closeLoginModal);
    document.getElementById('sendOtpBtn')?.addEventListener('click', sendOtp);
    document.getElementById('verifyOtpBtn')?.addEventListener('click', verifyOtp);
    document.getElementById('backToPhoneBtn')?.addEventListener('click', () => {
        phoneView.classList.remove('hidden');
        otpView.classList.add('hidden');
    });
    document.getElementById('userDetailsForm')?.addEventListener('submit', saveUserDetails);
};