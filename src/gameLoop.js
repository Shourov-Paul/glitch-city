export class GameLoop {
    constructor(updateCallback, drawCallback) {
        this.updateCallback = updateCallback;
        this.drawCallback = drawCallback;
        this.lastTime = 0;
        this.running = false;
        this.rafId = null;
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    clearEntities() {
        this.entities = [];
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            this.loop(this.lastTime);
        }
    }

    stop() {
        this.running = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }

    loop(timestamp) {
        if (!this.running) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Update Entities happens in updateCallback for now to handle dependencies (player, config)
        // or we could refactor entities to be self-contained. 
        // For this task, we delegate update logic to the callback.

        // External System Updates
        if (this.updateCallback) this.updateCallback(deltaTime);

        // Draw
        if (this.drawCallback) this.drawCallback(); // Clear screen etc.

        // Draw Entities
        // (Assuming ctx is available globally or passed via draw methods - 
        // usually entities need ctx. Let's assume entities have draw(ctx) and we pass ctx 
        // OR the drawCallback handles the context.
        // Actually, the request "Object management" implies the loop HANDLES them.
        // But `draw()` in main.js passes `ctx`.
        // Let's attach `ctx` to the loop or pass it?
        // For this refactor, let's keep it simple: main.js draw() handles clearing,
        // but let's expose a renderEntities(ctx) helper or similar?
        // No, standard loop pattern: Update All -> Draw All.
        // Let's add a render(ctx) method to the loop that main.js can call, OR
        // call entity.draw(ctx) if we had the context.
        // Better: `main.js` `draw()` calls `gameLoop.render(ctx)`?
        // Let's stick to the plan: modify main.js to use this.
    }

    render(ctx) {
        for (let entity of this.entities) {
            if (entity.draw) {
                entity.draw(ctx);
            }
        }
    }
}
