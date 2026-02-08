import { randomRange } from '../utils/random.js';
import { Config } from '../config.js';

export class JuiceSystem {
    constructor() {
        this.container = document.getElementById('ui-layer');
        this.synth = window.speechSynthesis;
    }

    triggerErrorPopup() {
        const popup = document.createElement('div');
        popup.className = 'error-popup';
        popup.style.position = 'absolute';

        // Random position
        const x = randomRange(10, 80);
        const y = randomRange(10, 80);
        popup.style.left = `${x}%`;
        popup.style.top = `${y}%`;

        // Styling
        popup.style.background = '#000';
        popup.style.border = '2px solid #ff0055';
        popup.style.padding = '10px';
        popup.style.color = '#ff0055';
        popup.style.fontFamily = 'monospace';
        popup.style.zIndex = '1000';
        popup.style.boxShadow = '5px 5px 0px rgba(255, 0, 85, 0.5)';
        popup.style.pointerEvents = 'none'; // Don't block clicks

        // Content
        const titles = ['SYSTEM ERROR', 'CRITICAL FAILURE', 'REALITY BREACH', 'MEMORY LEAK'];
        const msgs = ['0x49214 FATAL', 'SEGMENTATION FAULT', 'NULL POINTER', 'STACK OVERFLOW'];

        popup.innerHTML = `
            <div style="background: #ff0055; color: #000; padding: 2px; font-weight: bold; margin-bottom: 5px;">
                ${titles[Math.floor(Math.random() * titles.length)]}
            </div>
            <div>${msgs[Math.floor(Math.random() * msgs.length)]}</div>
        `;

        this.container.appendChild(popup);

        // Remove after short time
        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, randomRange(500, 2000));
    }

    triggerScreenFlicker() {
        const canvas = document.getElementById('gameCanvas');
        canvas.style.opacity = '0.5';
        setTimeout(() => canvas.style.opacity = '1', 50);
        setTimeout(() => canvas.style.opacity = '0.8', 100);
        setTimeout(() => canvas.style.opacity = '1', 150);
    }

    speak(text) {
        if (!this.synth) return;
        if (this.synth.speaking) this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.1; // Low, glitchy pitch
        utterance.rate = 1.2;

        // Try to find a robotic voice
        const voices = this.synth.getVoices();
        const robotVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('David'));
        if (robotVoice) utterance.voice = robotVoice;

        this.synth.speak(utterance);
    }

    triggerRealityUnstable() {
        this.speak("Reality Unstable");

        // Visual Text
        const text = document.createElement('div');
        text.innerText = "REALITY UNSTABLE";
        text.style.position = 'absolute';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        text.style.fontSize = '40px';
        text.style.color = '#ff0055';
        text.style.textShadow = '4px 4px 0 #00f3ff';
        text.style.fontFamily = '"Press Start 2P", monospace';
        text.style.zIndex = '2000';
        text.style.pointerEvents = 'none';

        this.container.appendChild(text);

        // Glitch the text
        const interval = setInterval(() => {
            text.style.left = `calc(50% + ${randomRange(-5, 5)}px)`;
            text.style.top = `calc(50% + ${randomRange(-5, 5)}px)`;
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            if (text.parentNode) text.parentNode.removeChild(text);
        }, 2000);
    }
}
