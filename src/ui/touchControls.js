export class TouchControls {
    constructor(inputHandler) {
        this.input = inputHandler;
        this.container = document.getElementById('touch-controls');

        // Detect Touch
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.container.style.display = 'block';
            this.setupListeners();
        }
    }

    setupListeners() {
        const bindBtn = (id, code) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.input.setKey(code, true); });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); this.input.setKey(code, false); });
            btn.addEventListener('touchcancel', (e) => { e.preventDefault(); this.input.setKey(code, false); });
        };

        bindBtn('btn-up', 'KeyW');
        bindBtn('btn-down', 'KeyS');
        bindBtn('btn-left', 'KeyA');
        bindBtn('btn-right', 'KeyD');
        bindBtn('btn-dash', 'Space');
    }
}
