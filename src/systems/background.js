import { Config } from '../config.js';

export class BackgroundSystem {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = 128;
        this.patternCanvas = document.createElement('canvas');
        this.patternCanvas.width = this.tileSize;
        this.patternCanvas.height = this.tileSize;
        this.pattern = null;
        this.generatePattern();
    }

    generatePattern() {
        const ctx = this.patternCanvas.getContext('2d');
        const w = this.tileSize;
        const h = this.tileSize;

        // Base
        ctx.fillStyle = Config.COLORS.BACKGROUND;
        ctx.fillRect(0, 0, w, h);

        // Grid (Darker lines)
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, w, h);

        // Cyberpunk Details
        // Random glowing lines
        ctx.lineWidth = 1;

        // Cyan accents
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)'; // Faint neon cyan
        ctx.beginPath();
        ctx.moveTo(w * 0.25, 0); ctx.lineTo(w * 0.25, h);
        ctx.moveTo(w * 0.75, 0); ctx.lineTo(w * 0.75, h);
        ctx.stroke();

        // Magenta accents
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.2)'; // Faint neon pink
        ctx.beginPath();
        ctx.moveTo(0, h * 0.25); ctx.lineTo(w, h * 0.25);
        ctx.moveTo(0, h * 0.75); ctx.lineTo(w, h * 0.75);
        ctx.stroke();

        // Circuit nodes
        ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
        ctx.fillRect(w * 0.25 - 2, h * 0.25 - 2, 4, 4);
        ctx.fillRect(w * 0.75 - 2, h * 0.75 - 2, 4, 4);
    }

    getPattern(ctx) {
        if (!this.pattern) {
            this.pattern = ctx.createPattern(this.patternCanvas, 'repeat');
        }
        return this.pattern;
    }

    draw(ctx) {
        const pattern = this.getPattern(ctx);
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
