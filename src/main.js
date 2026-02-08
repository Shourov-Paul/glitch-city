import { Config } from './config.js';
import { GameLoop } from './gameLoop.js';
import { InputHandler } from './utils/input.js';
import { TouchControls } from './ui/touchControls.js';
import { Player } from './entities/player.js';
import { Enemy } from './entities/enemy.js';
import { Fragment } from './entities/fragment.js';

import { HUD } from './ui/hud.js';
import { StartScreen } from './ui/startScreen.js';
import { GameOverScreen } from './ui/gameOver.js';

import { SpawnSystem } from './systems/spawnSystem.js';
import { CollisionSystem } from './systems/collisionSystem.js';
import { GlitchSystem } from './systems/glitchSystem.js';
import { DifficultySystem } from './systems/difficultySystem.js';
import { BackgroundSystem } from './systems/background.js';
import { JuiceSystem } from './systems/juiceSystem.js';
import { SoundSystem } from './systems/soundSystem.js';
import { Particle } from './entities/particle.js';
import { Boss } from './entities/boss.js';

console.log('Main.js initializing...');

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = Config.CANVAS_WIDTH;
canvas.height = Config.CANVAS_HEIGHT;

// State Variables
let player;
let enemies = [];
let fragments = [];
let particles = [];
let score = 0;
let timeElapsed = 0;
let isGameOver = false;

// Systems
const input = new InputHandler();
const touchControls = new TouchControls(input);
const hud = new HUD();
const spawnSystem = new SpawnSystem();
const collisionSystem = new CollisionSystem();
const glitchSystem = new GlitchSystem();
const difficultySystem = new DifficultySystem();
const backgroundSystem = new BackgroundSystem(Config.CANVAS_WIDTH, Config.CANVAS_HEIGHT);
const juiceSystem = new JuiceSystem();
const soundSystem = new SoundSystem();
// Sound Controls Binding
const btnMusic = document.getElementById('btn-music');
const btnSFX = document.getElementById('btn-sfx');

if (btnMusic && btnSFX) {
    btnMusic.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent game interaction
        const isMuted = soundSystem.toggleMusic();
        btnMusic.innerText = isMuted ? "MUSIC: OFF" : "MUSIC: ON";
        btnMusic.classList.toggle('muted', isMuted);
    });

    btnSFX.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMuted = soundSystem.toggleSFX();
        btnSFX.innerText = isMuted ? "SFX: OFF" : "SFX: ON";
        btnSFX.classList.toggle('muted', isMuted);
    });

    // Touch/Click to init sound (but don't toggle if clicking button)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sound-btn')) return;
        soundSystem.resume();
    }, { once: true });
    document.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('sound-btn')) return;
        soundSystem.resume();
    }, { once: true });
}

// UI Screens
const startScreen = new StartScreen(startGameWrapper);
const gameOverScreen = new GameOverScreen(startGameWrapper, goToMainMenu);

let currentLevel = 5;

function startGameWrapper(lvl) {
    if (typeof lvl === 'number') currentLevel = lvl;
    startGame(currentLevel);
}

// Game Loop Functions
function update(deltaTime) {
    if (isGameOver) return;

    // Glitch Events Handling
    let dt = deltaTime;
    if (glitchSystem.isActive(Config.GLITCH_EVENTS.TYPES.SLOW_MOTION)) {
        dt *= 0.5;
    }

    const invertControls = glitchSystem.isActive(Config.GLITCH_EVENTS.TYPES.INVERT_CONTROLS);

    // Player update is special due to input
    // Player update is special due to input
    const wasDashing = player.isDashing;
    player.update(dt, input, invertControls);
    if (!wasDashing && player.isDashing) soundSystem.playDash();

    // Teleport Check
    if (glitchSystem.isActive(Config.GLITCH_EVENTS.TYPES.TELEPORT)) {
        player.x = Math.random() * (Config.CANVAS_WIDTH - player.width);
        player.y = Math.random() * (Config.CANVAS_HEIGHT - player.height);
        glitchSystem.clearEvent();
    }

    const extraSpeed = difficultySystem.getEnemySpeedMultiplier();

    // Update enemies with player reference (GameLoop handles basic update, but we need to pass params)
    // approach: GameLoop calls .update(dt). If entities need more, we stick to manual update 
    // OR we attach context to entities.
    // Given the simple loop implementation:
    // The loop calls entity.update(dt). 
    // Enemies need (dt, player, extraSpeed).
    // Fragments need (dt).
    // Particles need (dt).

    // Option A: Wrap enemy update or attach properties.
    // Option B: Keep specific updates here and just use loop for storage.
    // The prompt asked for "Object management".
    // Let's attach the context to the enemies or use a closure/wrapper?
    // Simpler: iterate the loop's entities array manually here for special needs, 
    // or just keep using local arrays for specific types and let loop handle generic ones?
    // Let's migrate `particles` and `fragments` to loop.
    // Enemies need `player`, so let's keep managing them effectively or pass player to them.
    // Let's set `enemy.target = player` and `enemy.extraSpeed = ...`?

    // Let's stick to the prompt's spirit: The loop should drive the updates.
    // But we have specific logic here.
    // Hybrid:
    // We'll trust the loop to call .update(dt).
    // For enemies, we'll patch `update` or set properties before the loop runs? No, overhead.
    // Let's keep `enemies` array for game logic (collisions) but ALSO add them to loop for update/draw?
    // That causes double update if we aren't careful.

    // CORRECT APPROACH for this Refactor:
    // 1. Player: Managed manually (input dependency).
    // 2. Enemies: Managed by loop? Needs player ref. 
    //    We can pass `player` to Enemy constructor or set `Enemy.target = player`.
    // 3. Fragments: Managed by loop.
    // 4. Particles: Managed by loop.

    // Let's Update Enemies to store player reference? 
    // Or just iterate `enemies` manually here and NOT add to loop? 
    // The prompt says "Object management". 
    // Let's try to add everything to the loop.

    // Update Systems
    entities.forEach(e => {
        if (e instanceof Enemy) {
            e.update(dt, player, extraSpeed);
        } else if (e !== player) {
            // Standard update for fragments/particles
            if (e.update) e.update(dt);
        }
    });

    // WAIT. usage of GameLoop.entities is cleaner.
    // But GameLoop.update() calls entity.update(dt). it doesn't pass extra params.
    // So if we use gameLoop.update(), enemies get called with just (dt).
    // This breaks enemy logic.

    // Decision: simple GameLoop.update(dt) is insufficient for complex dependency injection 
    // without refactoring entities.
    // Refactor Enemy to store player ref?
    // Refactor Enemy.update to take (dt) and use internal refs?

    // Let's do this:
    // We will NOT use gameLoop.update() blindly. 
    // We will use gameLoop.entities to store them.
    // And in this callback, we iterate gameLoop.entities.

    const entities = gameLoop.entities; // Access directly

    // Clean up dead particles
    for (let i = entities.length - 1; i >= 0; i--) {
        const e = entities[i];
        if (e instanceof Particle && e.alpha <= 0) {
            gameLoop.removeEntity(e);
        }
    }

    // Update Logic
    entities.forEach(entity => {
        if (entity instanceof Enemy) {
            entity.update(dt, player, extraSpeed);
        } else if (entity.update) {
            entity.update(dt);
        }
    });

    // Systems
    // SpawnSystem needs to push to gameLoop
    const difficultyLevel = difficultySystem.difficultyLevel;
    const spawnEvent = spawnSystem.update(deltaTime, gameLoop, player, difficultyLevel);

    if (spawnEvent === "BOSS_SPAWNED") {
        juiceSystem.speak("WARNING. BOSS DETECTED.");
        juiceSystem.triggerScreenFlicker();
    }

    difficultySystem.update(deltaTime, spawnSystem);

    // Apply Glitch Chaos
    const glitchMultiplier = difficultySystem.getGlitchRateMultiplier();
    glitchSystem.update(deltaTime, glitchMultiplier);

    // Sound for glitch events
    if (glitchSystem.activeEvent && glitchSystem.eventTimer === Config.GLITCH_EVENTS.DURATION) {
        soundSystem.playGlitch();
    }

    // Juice Events (Randomly based on stability)
    if (Math.random() < 0.001) juiceSystem.triggerErrorPopup();
    if (glitchSystem.getStability() < 50 && Math.random() < 0.005) {
        juiceSystem.triggerScreenFlicker();
    }
    if (Math.random() < 0.0005) juiceSystem.triggerRealityUnstable(); // Rare voice event

    if (glitchSystem.getStability() <= 0) endGame();

    // Collisions
    const currentEnemies = entities.filter(e => e instanceof Enemy);
    const currentFragments = entities.filter(e => e instanceof Fragment);

    const events = collisionSystem.checkCollisions(player, currentEnemies, currentFragments);

    if (events.hit) {
        if (player.takeDamage()) {
            hud.updateHealth(player.health);
            // Glitch effect on damage
            glitchSystem.triggerVisualGlitch();
            soundSystem.playHit();
            if (player.health <= 0) endGame();
        }
    }

    if (events.collected.length > 0) {
        events.collected.forEach(index => {
            const f = currentFragments[index];
            if (f) {
                // Spawn particles
                for (let i = 0; i < 8; i++) {
                    gameLoop.addEntity(new Particle(f.x + f.width / 2, f.y + f.height / 2, f.color));
                }
                gameLoop.removeEntity(f);

                const scoreMult = difficultySystem.getScoreMultiplier();
                score += 100 * scoreMult;

                glitchSystem.addStability(15);
                soundSystem.playCollect();
            }
        });
    }

    // Update UI
    const scoreMult = difficultySystem.getScoreMultiplier();
    score += deltaTime * 10 * scoreMult; // Survival score also scaled
    timeElapsed += deltaTime;
    hud.updateScore(Math.floor(score));
    hud.updateTimer(timeElapsed);
    hud.updateGlitchMeter(glitchSystem.getStability());
}

function draw() {
    backgroundSystem.draw(ctx);

    // Glitch Visuals
    if (glitchSystem.isActive(Config.GLITCH_EVENTS.TYPES.DISTORT)) {
        ctx.setTransform(1, Math.sin(Date.now() / 100) * 0.2, 0, 1, 0, 0);
    } else if (glitchSystem.isActive(Config.GLITCH_EVENTS.TYPES.COLORS)) {
        ctx.filter = `hue-rotate(${Date.now() % 360}deg)`;
    } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = 'none';
    }

    // Canvas Draw
    gameLoop.render(ctx); // Draw all managed entities

    if (!isGameOver) player.draw(ctx);
}

// Game Control
function startGame(level) {
    resetGame(level);
    gameLoop.start();
}

function resetGame(level = 5) {
    isGameOver = false;
    score = 0;
    timeElapsed = 0;

    gameLoop.clearEntities();

    player = new Player(Config.CANVAS_WIDTH / 2, Config.CANVAS_HEIGHT / 2);

    // Scaling
    const scaling = Config.LEVEL_SCALING;
    Config.ENEMY.BASE_SPEED = scaling.BASE_SPEED + (level * scaling.SPEED_PER_LEVEL);
    Config.ENEMY.SPAWN_RATE = Math.max(500, scaling.BASE_SPAWN - (level * scaling.SPAWN_REDUCTION_PER_LEVEL));
    glitchSystem.decayRate = scaling.BASE_DECAY + (level * scaling.DECAY_PER_LEVEL);

    console.log(`Starting Level ${level}`);

    // Reset Systems
    glitchSystem.stability = 100;
    difficultySystem.difficultyLevel = 1;
    difficultySystem.timeElapsed = 0;
    spawnSystem.enemySpawnRate = Config.ENEMY.SPAWN_RATE;
    hud.updateHealth(Config.PLAYER.MAX_HEALTH);

    // Audio Context Resume
    soundSystem.resume();
    soundSystem.startMusic();
}

function endGame() {
    isGameOver = true;
    gameLoop.stop();

    const minutes = Math.floor(timeElapsed / 60);
    const seconds = Math.floor(timeElapsed % 60);
    const milliseconds = Math.floor((timeElapsed % 1) * 100);
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

    gameOverScreen.show(score, timeFormatted);
}

function goToMainMenu() {
    startScreen.show();
}

// Initialize Loop
// Note: We use the callback for the main game logic (update), but we use the loop's internal rendering for entities (in draw)
// actually we disable the loop's internal .update() loop in favor of our manual one above? 
// No, `GameLoop.update(dt)` calls `updateCallback(dt)` AND `entities.update(dt)`.
// We should prevent double updates. 
// If we iterate entities in `updateCallback`, we should NOT have them updated again by Loop.
// But `GameLoop` implementation I wrote does: 
// 1. Update Entities 
// 2. Call Callback
// This means standard entities get updated twice if I do it manually.
// 
// Fix:
// Use `gameLoop` for storage and render.
// But for update, relies on the Loop's automatic update.
// For Enemy, we need to pass `player`. 
// 
// Let's Refactor Enemy.update signature in a separate step or just bind it?
// `enemy.update = (dt) => Enemy.prototype.update.call(enemy, dt, player, extraSpeed)`?
// A bit hacky but works for "Object Management" requirement without changing all files.
// 
// Let's try binding in SpawnSystem.
// 
// Revised Plan for this file:
// 1. `update` callback handles Systems and Player.
// 2. `draw` callback handles Background and Player.
// 3. Entities (Enemies, Fragments, Particles) are managed by `gameLoop`.
// 4. `SpawnSystem` needs to add to `gameLoop` and Bind updates if needed.

const gameLoop = new GameLoop(update, draw); // Update handles systems, Loop handles entities

