export const qs = (selector, parent = document) => parent.querySelector(selector);
export const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

export const createAndObserve = (initFn) => {
    lucide.createIcons();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (initFn) initFn(entry.target);
            }
        });
    }, { threshold: 0.1 });
    qsa('.reveal').forEach(el => observer.observe(el));
};

export const startCountdown = (endDate, elementId) => {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(endDate).getTime() - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = `<div class="text-2xl font-bold">The event has started!</div>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="countdown-box p-3 rounded-md"><div class="text-3xl font-bold">${days}</div><div class="text-xs">Days</div></div>
            <div class="countdown-box p-3 rounded-md"><div class="text-3xl font-bold">${hours}</div><div class="text-xs">Hours</div></div>
            <div class="countdown-box p-3 rounded-md"><div class="text-3xl font-bold">${minutes}</div><div class="text-xs">Mins</div></div>
            <div class="countdown-box p-3 rounded-md"><div class="text-3xl font-bold">${seconds}</div><div class="text-xs">Secs</div></div>
        `;
    }, 1000);
};

export const initOurStoryAnimation = () => {
    const canvas = qs('#story-canvas');
    if (!canvas || canvas.hasAttribute('data-initialized')) return;

    const container = qs('#story-animation-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x7c3f44,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    let mouseX = 0;
    let mouseY = 0;
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -(((event.clientY - rect.top) / container.clientHeight) * 2 - 1);
    });


    const animate = () => {
        requestAnimationFrame(animate);
        particleMesh.rotation.y += 0.0005;
        particleMesh.rotation.x += 0.0005;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
    canvas.setAttribute('data-initialized', 'true');
};