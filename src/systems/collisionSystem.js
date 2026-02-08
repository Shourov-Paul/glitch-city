import { checkRectCollision } from '../utils/helpers.js';

export class CollisionSystem {
    constructor() { }

    checkCollisions(player, enemies, fragments) {
        let events = {
            hit: false,
            collected: [] // Array of indices of collected fragments
        };

        // Check Player-Enemy Collisions
        for (let enemy of enemies) {
            if (checkRectCollision(player, enemy)) {
                events.hit = true;
                break; // One hit is enough for game over usually
            }
        }

        // Check Player-Fragment Collisions
        for (let i = 0; i < fragments.length; i++) {
            if (checkRectCollision(player, fragments[i])) {
                events.collected.push(i);
            }
        }

        return events;
    }
}
