import { products } from '../data/products.js';
import { qs } from '../utils/helpers.js';
import { showToast } from './Toasts.js';

const tryOnModal = qs('#tryOnModal');
const closeTryOnBtn = qs('#closeTryOnBtn');
const tryNowNavBtn = qs('#tryNowNavBtn');
let faceMesh, camera, currentTryOnProduct = null;
const jewelryImages = {}; // Cache for loaded images

const setTryOnProduct = (productId) => {
    currentTryOnProduct = products.find(p => p.id === productId);
};

const drawOnLandmark = (ctx, image, scale, cx, cy) => {
    const imgWidth = image.naturalWidth * scale;
    const imgHeight = image.naturalHeight * scale;
    ctx.drawImage(image, cx - imgWidth / 2, cy, imgWidth, imgHeight);
};

const drawJewelry = (ctx, landmarks, jewelry, image) => {
    if (jewelry.tryOnType === 'earrings') {
        const img = jewelryImages[jewelry.id];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const rightEar = landmarks[132];
        const leftEar = landmarks[361];
        if (rightEar && leftEar) {
            const faceWidth = Math.hypot(landmarks[454].x - landmarks[234].x, landmarks[454].y - landmarks[234].y);
            const dynamicScale = faceWidth * jewelry.tryOnScale * 0.5;
            drawOnLandmark(ctx, img, dynamicScale, rightEar.x * image.width, rightEar.y * image.height);
            drawOnLandmark(ctx, img, dynamicScale, leftEar.x * image.width, leftEar.y * image.height);
        }
    } else if (jewelry.tryOnType === 'necklace') {
        const img = jewelryImages[jewelry.id];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const chin = landmarks[152];
        if (chin) {
            const neckCenterX = landmarks[168].x * image.width;
            const neckY = (chin.y * image.height) + (image.height * 0.08);
            const faceWidth = Math.hypot(landmarks[454].x - landmarks[234].x, landmarks[454].y - landmarks[234].y);
            const adjustedScale = faceWidth * jewelry.tryOnScale;
            drawOnLandmark(ctx, img, adjustedScale, neckCenterX, neckY);
        }
    } else if (jewelry.tryOnType === 'combo') {
        const earringImg = jewelryImages[jewelry.id].earring;
        if (earringImg && earringImg.complete && earringImg.naturalWidth > 0) {
            const rightEar = landmarks[132];
            const leftEar = landmarks[361];
            if(rightEar && leftEar){
                const faceWidth = Math.hypot(landmarks[454].x - landmarks[234].x, landmarks[454].y - landmarks[234].y);
                const dynamicScale = faceWidth * jewelry.tryOnScale.earring * 0.5;
                drawOnLandmark(ctx, earringImg, dynamicScale, rightEar.x * image.width, rightEar.y * image.height);
                drawOnLandmark(ctx, earringImg, dynamicScale, leftEar.x * image.width, leftEar.y * image.height);
            }
        }
        const necklaceImg = jewelryImages[jewelry.id].necklace;
        if (necklaceImg && necklaceImg.complete && necklaceImg.naturalWidth > 0) {
             const chin = landmarks[152];
            if (chin) {
                const neckCenterX = landmarks[168].x * image.width;
                const neckY = (chin.y * image.height) + (image.height * 0.08);
                const faceWidth = Math.hypot(landmarks[454].x - landmarks[234].x, landmarks[454].y - landmarks[234].y);
                const adjustedScale = faceWidth * jewelry.tryOnScale.necklace;
                drawOnLandmark(ctx, necklaceImg, adjustedScale, neckCenterX, neckY);
            }
        }
    }
};

const onResults = (results) => {
    const canvasElement = qs('#tryOnCanvas');
    if (!canvasElement || !results.image) return;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        if (currentTryOnProduct) drawJewelry(canvasCtx, landmarks, currentTryOnProduct, results.image);
    }
    canvasCtx.restore();
};

const stopTryOn = () => {
    if (camera && typeof camera.stop === 'function') {
        camera.stop();
        const videoElement = qs('#webcam');
        if (videoElement && videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
    }
    camera = null;
    if (faceMesh) { faceMesh.close(); faceMesh = null; }
    const canvasElement = qs('#tryOnCanvas');
    if (canvasElement) {
        const canvasCtx = canvasElement.getContext('2d');
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
};

const startTryOn = async () => {
    const videoElement = qs('#webcam');
    const canvasElement = qs('#tryOnCanvas');
    const tryOnLoader = qs('#tryOnLoader');
    const cameraFallback = qs('#cameraFallback');
    const tryOnContainer = qs('#tryOnContainer');

    if (!window.FaceMesh || !window.Camera) {
        console.error("Required libraries not loaded");
        cameraFallback.classList.remove('hidden');
        tryOnLoader.style.display = 'none';
        return;
    }

    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceMesh.onResults(onResults);

    try {
        camera = new Camera(videoElement, {
            onFrame: async () => {
                if (videoElement.videoWidth > 0) {
                    await faceMesh.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });

        videoElement.addEventListener('loadedmetadata', () => {
            const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
            tryOnContainer.style.aspectRatio = aspectRatio;
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
        });

        await camera.start();
        tryOnLoader.style.display = 'none';

    } catch (error) {
        console.error("Camera access failed:", error);
        tryOnLoader.style.display = 'none';
        cameraFallback.classList.remove('hidden');
        stopTryOn();
    }
};

const populateCarousel = (activeId) => {
    const carousel = qs('#productCarousel');
    const tryableProducts = products.filter(p => p.tryOnImage);

    // Preload images
    tryableProducts.forEach(item => {
        if (item.tryOnType === 'combo') {
            if (!jewelryImages[item.id]) jewelryImages[item.id] = {};
            if (!jewelryImages[item.id].earring) {
                const img = new Image();
                img.src = item.tryOnImage.earring;
                jewelryImages[item.id].earring = img;
            }
            if (!jewelryImages[item.id].necklace) {
                const img = new Image();
                img.src = item.tryOnImage.necklace;
                jewelryImages[item.id].necklace = img;
            }
        } else {
            if (!jewelryImages[item.id]) {
                const img = new Image();
                img.src = item.tryOnImage;
                jewelryImages[item.id] = img;
            }
        }
    });

    carousel.innerHTML = tryableProducts.map(p => `
        <button data-id="${p.id}" class="carousel-item w-16 h-16 rounded-full border-2 ${p.id === activeId ? 'border-[var(--brand-color)]' : 'border-transparent'} hover:border-[var(--accent-color)] focus:border-[var(--brand-color)] transition-all duration-200 p-1">
            <img src="${p.media[0]}" alt="${p.name}" class="w-full h-full object-cover rounded-full bg-gray-100 pointer-events-none" onerror="this.src='https://placehold.co/64x64/f8c8dc/7c3f44?text=Img';">
        </button>
    `).join('');

    carousel.querySelectorAll('.carousel-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const newId = parseInt(btn.dataset.id);
            setTryOnProduct(newId);
            carousel.querySelectorAll('.carousel-item').forEach(b => b.classList.remove('border-[var(--brand-color)]'));
            btn.classList.add('border-[var(--brand-color)]');
        });
    });
};

export const openTryOnModal = (productId) => {
    let product = productId ? products.find(p => p.id === productId && p.tryOnImage) : products.find(p => p.tryOnImage);
    if (!product) {
        showToast("Virtual try-on isn't available for this item.", "😞");
        return;
    }
    tryOnModal.classList.remove('hidden');
    qs('#tryOnLoader').style.display = 'flex';
    qs('#cameraFallback').classList.add('hidden');
    populateCarousel(product.id);
    setTryOnProduct(product.id);
    startTryOn();
};

export const initVirtualTryOn = () => {
    closeTryOnBtn?.addEventListener('click', () => {
        tryOnModal?.classList.add('hidden');
        stopTryOn();
    });
    tryNowNavBtn?.addEventListener('click', () => openTryOnModal());
};