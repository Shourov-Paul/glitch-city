import { Config } from '../config.js';
import { randomRange } from '../utils/random.js';

export class GlitchSystem {
    constructor() {
        this.stability = 100;
        this.decayRate = 2; // per second
        this.canvas = document.getElementById('gameCanvas');

        // Event System
        this.activeEvent = null;
        this.eventTimer = 0;
        this.timeUntilNextEvent = randomRange(Config.GLITCH_EVENTS.INTERVAL_MIN, Config.GLITCH_EVENTS.INTERVAL_MAX);
    }

    update(deltaTime, rateMultiplier = 1) {
        // Decay stability
        this.stability -= this.decayRate * deltaTime;
        if (this.stability < 0) this.stability = 0;

        // Manage Events
        if (this.activeEvent) {
            this.eventTimer -= deltaTime;
            if (this.eventTimer <= 0) {
                this.clearEvent();
            }
        } else {
            // Accelerate time until next event based on multiplier
            this.timeUntilNextEvent -= deltaTime * rateMultiplier;
            if (this.timeUntilNextEvent <= 0) {
                this.triggerRandomEvent();
            }
        }

        // Trigger visual glitches based on low stability (separate from major events)
        if (this.stability < 30) {
            if (Math.random() < 0.05) this.triggerVisualGlitch();
        }
        if (Math.random() < 0.01) this.triggerVisualGlitch();
    }

    triggerRandomEvent() {
        const types = Object.values(Config.GLITCH_EVENTS.TYPES);
        const type = types[Math.floor(Math.random() * types.length)];

        this.activeEvent = type;
        this.eventTimer = Config.GLITCH_EVENTS.DURATION;
        console.log(`GLITCH EVENT STARTED: ${type}`);

        // Immediate effects
        if (type === Config.GLITCH_EVENTS.TYPES.TELEPORT) {
            this.eventTimer = 0; // Instant
            // Teleport handled in main to access player? Or dispatch event?
            // Let's store it and let main handle it or pass player here.
            // Better: Main checks glitchSystem.activeEvent
        }

        // Schedule next event
        this.timeUntilNextEvent = randomRange(Config.GLITCH_EVENTS.INTERVAL_MIN, Config.GLITCH_EVENTS.INTERVAL_MAX);
    }

    clearEvent() {
        console.log(`GLITCH EVENT ENDED: ${this.activeEvent}`);
        this.activeEvent = null;
        // Reset visuals
        this.canvas.style.transform = 'none';
        this.canvas.style.filter = 'none';
    }

    addStability(amount) {
        this.stability += amount;
        if (this.stability > 100) this.stability = 100;
    }

    triggerVisualGlitch() {
        const shiftX = randomRange(-10, 10);
        const shiftY = randomRange(-10, 10);
        this.canvas.style.transform = `translate(${shiftX}px, ${shiftY}px)`;

        // Reset after short time
        setTimeout(() => {
            this.canvas.style.transform = 'translate(0, 0)';
        }, 100);

        // Color inversion effect?
        if (Math.random() < 0.5) {
            this.canvas.style.filter = 'invert(1)';
            setTimeout(() => {
                this.canvas.style.filter = 'none';
            }, 50);
        }
    }

    getStability() {
        return this.stability;
    }
}
