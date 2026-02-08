import { Config } from '../config.js';

export class Fragment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.color = Config.COLORS.FRAGMENT;
        this.time = 0;

        this.sprite = new Image();
        // Check if global sprite source is defined (from bundled HTML context)
        if (typeof FRAGMENT_SPRITE_SRC !== 'undefined' && FRAGMENT_SPRITE_SRC) {
            this.sprite.src = FRAGMENT_SPRITE_SRC;
        }
    }

    update(deltaTime) {
        this.time += deltaTime;
        // Bobbing effect
        this.y += Math.sin(this.time * 5) * 0.5;
    }

    draw(ctx) {
        if (this.sprite && this.sprite.complete && this.sprite.naturalWidth > 0) {
            ctx.save();
            // Glow effect
            ctx.shadowBlur = 30; // Strong neon glow
            ctx.shadowColor = this.color;

            // Remove black background using screen blend mode
            ctx.globalCompositeOperation = 'screen';

            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.time);

            // Draw 1.5x larger
            const drawWidth = this.width * 1.5;
            const drawHeight = this.height * 1.5;
            ctx.drawImage(this.sprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

            ctx.restore();
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            // Rotate visuals for effect (simulated by drawing a diamond)
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.time);
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}
