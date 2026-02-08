import { Config } from '../config.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = Config.PLAYER.SIZE;
        this.height = Config.PLAYER.SIZE;
        this.color = Config.COLORS.PLAYER;

        // Movement
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = Config.PLAYER.SPEED;

        // Dash
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.lastMoveDir = { x: 0, y: 0 }; // Track direction for dashing

        // Health & Status
        this.health = Config.PLAYER.MAX_HEALTH;
        this.invulnerabilityTimer = 0;
    }

    takeDamage() {
        if (this.invulnerabilityTimer <= 0) {
            this.health--;
            this.invulnerabilityTimer = Config.PLAYER.INVULNERABILITY_TIME;
            return true;
        }
        return false;
    }

    update(deltaTime, input, invertControls = false) {
        // Cooldowns
        if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= deltaTime;
        if (this.invulnerabilityTimer > 0) this.invulnerabilityTimer -= deltaTime;

        // Input Handling
        let inputX = 0;
        let inputY = 0;

        let up = input.isDown('KeyW') || input.isDown('ArrowUp');
        let down = input.isDown('KeyS') || input.isDown('ArrowDown');
        let left = input.isDown('KeyA') || input.isDown('ArrowLeft');
        let right = input.isDown('KeyD') || input.isDown('ArrowRight');

        if (invertControls) {
            const tempUp = up; up = down; down = tempUp;
            const tempLeft = left; left = right; right = tempLeft;
        }

        if (up) inputY = -1;
        if (down) inputY = 1;
        if (left) inputX = -1;
        if (right) inputX = 1;

        // Normalise input vector
        if (inputX !== 0 || inputY !== 0) {
            const length = Math.sqrt(inputX * inputX + inputY * inputY);
            inputX /= length;
            inputY /= length;
            this.lastMoveDir = { x: inputX, y: inputY };
        }

        // Dash Activation (Spacebar)
        if (input.isDown('Space') && this.dashCooldownTimer <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashTimer = Config.PLAYER.DASH_DURATION;
            this.dashCooldownTimer = Config.PLAYER.DASH_COOLDOWN;

            // Dash in last moving direction or current input
            if (inputX === 0 && inputY === 0) {
                // If stationary, dash in last known direction, or right default
                if (this.lastMoveDir.x === 0 && this.lastMoveDir.y === 0) this.lastMoveDir.x = 1;
            } else {
                this.lastMoveDir = { x: inputX, y: inputY };
            }

            // Apply burst velocity
            this.velocityX = this.lastMoveDir.x * Config.PLAYER.DASH_SPEED;
            this.velocityY = this.lastMoveDir.y * Config.PLAYER.DASH_SPEED;
        }

        if (this.isDashing) {
            this.dashTimer -= deltaTime;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.velocityX = 0;
                this.velocityY = 0;
            }
        } else {
            // Normal Movement with simple smoothing/acceleration
            // Currently using instantaneous speed for responsiveness as requested "Smooth" usually implies accel/decel
            // But detailed implementation request said "Smooth movement", let's use slight lerp or just direct assignment
            // Direct assignment is "smooth" frame-rate wise. Let's stick to direct for tight controls unless requested otherwise.
            // Actually, "Smooth movement" often implies a bit of slide/friction.
            // Let's implement a simple velocity approach

            const targetVX = inputX * this.speed;
            const targetVY = inputY * this.speed;

            // Simple ease-in
            this.velocityX += (targetVX - this.velocityX) * 10 * deltaTime;
            this.velocityY += (targetVY - this.velocityY) * 10 * deltaTime;
        }

        // Apply Velocity
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Rigid Boundary Collision
        if (this.x < 0) { this.x = 0; this.velocityX = 0; }
        if (this.y < 0) { this.y = 0; this.velocityY = 0; }
        if (this.x + this.width > Config.CANVAS_WIDTH) { this.x = Config.CANVAS_WIDTH - this.width; this.velocityX = 0; }
        if (this.y + this.height > Config.CANVAS_HEIGHT) { this.y = Config.CANVAS_HEIGHT - this.height; this.velocityY = 0; }
    }

    draw(ctx) {
        // Flash if invulnerable
        if (this.invulnerabilityTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;

        ctx.fillStyle = this.isDashing ? '#fff' : this.color; // Flash white when dashing
        ctx.shadowBlur = this.isDashing ? 20 : 15;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        // Draw inner detail
        if (!this.isDashing) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        }

        // Cooldown indicator (optional visual)
        if (this.dashCooldownTimer > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
            const ratio = this.dashCooldownTimer / Config.PLAYER.DASH_COOLDOWN;
            ctx.fillRect(this.x, this.y - 5, this.width * ratio, 2);
        }
    }
}
