export const Config = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    FPS: 60,

    COLORS: {
        BACKGROUND: '#050510',
        PLAYER: '#00f3ff',     // Neon Blue
        ENEMY: '#ff0055',      // Neon Pink/Red
        FRAGMENT: '#ffee00',   // Neon Yellow
        TEXT: '#ffffff'
    },

    PLAYER: {
        SPEED: 200, // Pixels per second
        SIZE: 20,
        FRICTION: 0.9,
        DASH_SPEED: 600,
        DASH_DURATION: 0.2, // seconds
        DASH_COOLDOWN: 1.0  // seconds
    },

    ENEMY: {
        BASE_SPEED: 100,
        SIZE: 40,
        SPAWN_RATE: 2000 // ms
    },

    SYSTEM: {
        STABILITY_DECAY: 2, // Points lost per second
        MAX_STABILITY: 100
    },

    GLITCH_EVENTS: {
        INTERVAL_MIN: 20, // seconds
        INTERVAL_MAX: 30, // seconds
        DURATION: 5,      // seconds (default duration for timed effects)
        TYPES: {
            DISTORT: 'DISTORT',
            TELEPORT: 'TELEPORT',
            INVERT_CONTROLS: 'INVERT_CONTROLS',
            COLORS: 'COLORS',
            SLOW_MOTION: 'SLOW_MOTION'
        }
    }
};
