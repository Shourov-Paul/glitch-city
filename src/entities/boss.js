import { Config } from '../config.js';
import { Enemy } from './enemy.js';

export class Boss extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 80;
        this.color = '#ffffff'; // White glitch monster
        this.speed = Config.ENEMY.BASE_SPEED * 0.8; // Slower but menacing
        this.health = 5; // Takes multiple hits (managed by game logic if we had shooting, but here it's avoidance)
        // Actually, player dies on touch. So mass is the unique factor.

        this.glitchTimer = 0;
    }

    update(deltaTime, player, extraSpeed) {
        // Boss moves relentlessly towards player
        super.update(deltaTime, player, extraSpeed * 0.5); // Affected less by difficulty speed

        // Glitch Logic
        this.glitchTimer += deltaTime;
        if (this.glitchTimer > 0.2) {
            this.glitchTimer = 0;
            // Teleport slightly
            this.x += (Math.random() - 0.5) * 20;
            this.y += (Math.random() - 0.5) * 20;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';

        // Draw glitchy rectangles
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#ff0055';
        const offset = (Math.random() - 0.5) * 10;
        ctx.fillRect(this.x + offset, this.y, this.width, this.height);

        ctx.fillStyle = '#00f3ff';
        const offset2 = (Math.random() - 0.5) * 10;
        ctx.fillRect(this.x, this.y + offset2, this.width, this.height);

        // Face
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 20, this.y + 20, 15, 15); // Eye L
        ctx.fillRect(this.x + 45, this.y + 20, 15, 15); // Eye R
        ctx.fillRect(this.x + 20, this.y + 50, 40, 10); // Mouth

        ctx.restore();
    }
}
