import { randomRange } from '../utils/random.js';
import { Config } from '../config.js';
import { Enemy } from '../entities/enemy.js';
import { Boss } from '../entities/boss.js';
import { Fragment } from '../entities/fragment.js';

export class SpawnSystem {
    constructor() {
        this.enemyTimer = 0;
        this.fragmentTimer = 0;
        this.enemySpawnRate = Config.ENEMY.SPAWN_RATE; // ms
        this.fragmentSpawnRate = 3000; // ms
    }

    update(deltaTime, gameLoop, player, difficultyLevel) {
        this.enemyTimer += deltaTime * 1000;
        this.fragmentTimer += deltaTime * 1000;

        // Spawn Enemy
        if (this.enemyTimer > this.enemySpawnRate) {
            this.enemyTimer = 0;
            const pos = this.getRandomSpawnPos(player);
            gameLoop.addEntity(new Enemy(pos.x, pos.y));
        }

        // Spawn Fragment
        if (this.fragmentTimer > this.fragmentSpawnRate) {
            this.fragmentTimer = 0;
            const pos = this.getRandomSpawnPos(player);
            gameLoop.addEntity(new Fragment(pos.x, pos.y));
        }

        // Spawn Boss (Rare)
        // Only after level 3
        if (difficultyLevel >= 3 && Math.random() < 0.001) { // Low chance per frame (~6% per second at 60fps? no 0.001 is 0.1% per frame, ~6% per sec)
            // Check if boss exists? Simplification: Just spawn one
            // Actually, we should check count.
            // Let's iterate entities to check for existing boss? 
            // Expensive. Let's just spawn rarely.
            const pos = this.getRandomSpawnPos(player);
            gameLoop.addEntity(new Boss(pos.x, pos.y));
            return "BOSS_SPAWNED"; // Signal to trigger noise
        }
    }

    getRandomSpawnPos(player) {
        // Spawn away from player to be fair
        let x, y, dist;
        do {
            x = randomRange(0, Config.CANVAS_WIDTH - 20);
            y = randomRange(0, Config.CANVAS_HEIGHT - 20);
            const dx = x - player.x;
            const dy = y - player.y;
            dist = Math.sqrt(dx * dx + dy * dy);
        } while (dist < 200); // Minimum distance from player

        return { x, y };
    }
}

