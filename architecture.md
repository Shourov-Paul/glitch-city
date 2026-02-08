# Glitch City Architecture

This document outlines the architecture for "Glitch City", a browser-based 2D survival game built with vanilla HTML5 Canvas and ES6 modules.

## High-Level Overview

The game logic is structured using a simplified Entity-Component-System (ECS) pattern to keep concerns separated and the code modular.

- **Main Loop**: Updates game state and renders the scene 60 times per second.
- **Entities**: Objects in the game world (Player, Enemy, Fragment).
- **Systems**: Managers that handle specific logic (Spawning, Collisions, Glitch effects).
- **UI**: Overlay management (HUD, Menus).

## Core Components

### 1. Game Loop (`gameLoop.js`)
- Uses `requestAnimationFrame` for smooth rendering.
- Calculates `deltaTime` to ensure movement is independent of frame rate.
- Calls `update(deltaTime)` and `draw()` on all active systems and entities.

### 2. Player Controller (`player.js`)
- **State**: Position (x, y), Velocity, Dimensions.
- **Input**: Listens to Keyboard events (`w`, `a`, `s`, `d`, arrows via `InputHandler`).
- **Logic**: Updates velocity based on input; handles screen wrapping (teleporting to opposite side when leaving screen).

### 3. Enemy AI (`enemy.js`)
- **Behavior**: Simple chasing algorithm.
- **Logic**: Calculates vector to Player position, normalizes it, and moves Enemy towards Player at `ENEMY_SPEED`.

### 4. Glitch System (`glitchSystem.js`)
- **State**: `stability` (0-100).
- **Mechanic**: Stability decays over time. Collecting fragments restores stability.
- **Effects**: Triggers visual glitches (canvas transforms, color inversion) when stability is low (< 30%).
- **Game Over**: If stability reaches 0.

### 5. Score System (`main.js` & `hud.js`)
- **Score**: Increases based on:
  - Survival time (passive increase).
  - Collecting Fragments (+100 points).
- **Display**: Updated in the DOM overlay.

### 6. UI Manager
- **HUD**: Shows Score and Glitch Meter (Stability).
- **Screens**:
  - `StartScreen`: Overlay before game begins.
  - `GameOverScreen`: Overlay after death, showing final score and restart button.

## Data Flow

1.  **Input**: User presses keys -> `InputHandler` records state.
2.  **Update Phase**:
    -   `Player` moves based on Input.
    -   `Enemy` moves towards Player.
    -   `SpawnSystem` spawns new Enemies/Fragments if timers expire.
    -   `CollisionSystem` checks overlaps (Player vs Enemy, Player vs Fragment).
    -   `GlitchSystem` reduces stability and applies effects.
3.  **Draw Phase**:
    -   `Canvas` is cleared.
    -   Entities are drawn (rectangles with shadow effects for neon look).
    -   UI DOM elements are updated if values changed.

## Simplicity & Structure
-   **No External Dependencies**: Pure vanilla JS.
-   **Modular**: Each class is in its own file (`src/`), imported via ES6 modules in `main.js`.
-   **Configurable**: All constants (speeds, colors) are in `config.js`.
