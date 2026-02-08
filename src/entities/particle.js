import { randomRange } from '../utils/random.js';

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = randomRange(2, 5);
        this.speedX = randomRange(-2, 2); // Increased speed
        this.speedY = randomRange(-2, 2);
        this.alpha = 1;
        this.decay = randomRange(0.02, 0.05);
    }

    update(deltaTime) {
        // Use 60 FPS baseline for decay since deltaTime varies
        // Adjust for consistent speed
        this.x += this.speedX * (deltaTime * 60);
        this.y += this.speedY * (deltaTime * 60);
        this.alpha -= this.decay * (deltaTime * 60);
    }

    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}
