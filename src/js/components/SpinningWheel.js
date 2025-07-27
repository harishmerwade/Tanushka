import { qs } from '../utils/helpers.js';
import { showToast } from './Toasts.js';

export const openSpinningWheel = (title, subtitle, prizes) => {
    const modal = qs('#spinningWheelModal');
    qs('#spinning-wheel-title').textContent = title;
    qs('#spinning-wheel-subtitle').textContent = subtitle;

    const wheel = qs('#wheel');
    const spinBtn = qs('#spinBtn');
    const resultDiv = qs('#spinResult');

    wheel.innerHTML = '';
    resultDiv.textContent = '';
    spinBtn.disabled = false;
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    const segmentAngle = 360 / prizes.length;
    prizes.forEach((prize, i) => {
        const segment = document.createElement('div');
        segment.className = 'absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-start pl-4';
        segment.style.transform = `rotate(${i * segmentAngle}deg)`;

        const text = document.createElement('span');
        text.textContent = prize;
        text.className = 'transform -rotate-45 text-sm font-bold text-gray-700';

        const segmentBg = document.createElement('div');
        segmentBg.className = 'absolute inset-0';
        segmentBg.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`;
        segmentBg.style.transform = `rotate(${segmentAngle / 2}deg) skewY(${90 - segmentAngle}deg)`;
        segmentBg.style.background = i % 2 === 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)';
        segmentBg.style.transformOrigin = 'top left';

        segment.appendChild(segmentBg);
        segment.appendChild(text);
        wheel.appendChild(segment);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    spinBtn.onclick = () => {
        spinBtn.disabled = true;
        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const winningSegment = Math.floor(Math.random() * prizes.length);
        const totalRotation = (randomSpins * 360) - (winningSegment * segmentAngle) - (segmentAngle / 2);

        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            resultDiv.textContent = `Congratulations! You won: ${prizes[winningSegment]}`;
            showToast(`You won: ${prizes[winningSegment]}!`, '🎉');
        }, 5500);
    };
};

export const initSpinningWheel = () => {
    qs('#closeSpinningWheelBtn').addEventListener('click', () => {
        qs('#spinningWheelModal').classList.add('hidden');
    });
};