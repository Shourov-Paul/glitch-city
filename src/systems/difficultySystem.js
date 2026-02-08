export class DifficultySystem {
    constructor() {
        this.difficultyLevel = 1;
        this.timeElapsed = 0;
        this.scoreMultiplier = 1;
        this.glitchRateMultiplier = 1;
    }

    update(deltaTime, spawnSystem) {
        this.timeElapsed += deltaTime;

        // Increase difficulty every 30 seconds
        if (this.timeElapsed > 30) {
            this.timeElapsed = 0;
            this.increaseDifficulty(spawnSystem);
        }
    }

    increaseDifficulty(spawnSystem) {
        this.difficultyLevel++;

        // 1. Spawn Rate (Faster enemies)
        // Cap at 200ms
        spawnSystem.enemySpawnRate = Math.max(200, spawnSystem.enemySpawnRate - 100);

        // 2. Score Multiplier (Higher reward)
        this.scoreMultiplier = 1 + ((this.difficultyLevel - 1) * 0.5);

        // 3. Glitch Rate (More frequent)
        this.glitchRateMultiplier = 1 + ((this.difficultyLevel - 1) * 0.2);

        console.log(`CHAOS INCREASED: Level ${this.difficultyLevel}`);
        console.log(`Spawn: ${spawnSystem.enemySpawnRate}ms, Score: x${this.scoreMultiplier}, Glitch: x${this.glitchRateMultiplier}`);
    }

    getEnemySpeedMultiplier() {
        return (this.difficultyLevel - 1) * 10;
    }

    getScoreMultiplier() {
        return this.scoreMultiplier;
    }

    getGlitchRateMultiplier() {
        return this.glitchRateMultiplier;
    }
}
