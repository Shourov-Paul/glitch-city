import { Config } from '../config.js';

export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = Config.ENEMY.SIZE;
        this.height = Config.ENEMY.SIZE;
        this.color = Config.COLORS.ENEMY;
        this.speed = Config.ENEMY.BASE_SPEED;
    }

    update(deltaTime, player, extraSpeed = 0) {
        // Simple chasing logic
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const currentSpeed = this.speed + extraSpeed;

        if (distance > 0) {
            this.x += (dx / distance) * currentSpeed * deltaTime;
            this.y += (dy / distance) * currentSpeed * deltaTime;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        // Glitchy eyes or details
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x + 4, this.y + 4, 4, 4);
        ctx.fillRect(this.x + 12, this.y + 4, 4, 4);
    }
}
