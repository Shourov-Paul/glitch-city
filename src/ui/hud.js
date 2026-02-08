export class HUD {
    constructor() {
        this.scoreElement = document.getElementById('score-value');
        this.timerElement = document.getElementById('timer-value');
        this.glitchBar = document.getElementById('glitch-bar');

        // Health Display
        this.healthContainer = document.createElement('div');
        this.healthContainer.id = 'health-display';
        this.healthContainer.style.color = '#ff0055';
        this.healthContainer.style.fontSize = '20px';
        this.healthContainer.style.textShadow = '0 0 5px #ff0055';

        const healthPanel = document.getElementById('health-panel');
        if (healthPanel) {
            healthPanel.appendChild(this.healthContainer);
        } else {
            // Fallback
            document.getElementById('hud').appendChild(this.healthContainer);
        }

        this.updateHealth(3);
    }

    updateTimer(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        this.timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateHealth(health) {
        this.healthContainer.innerText = '♥'.repeat(Math.max(0, health));
    }

    updateScore(score) {
        this.scoreElement.innerText = Math.floor(score);
    }

    updateGlitchMeter(percent) {
        this.glitchBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;

        // Change color based on stability
        if (percent < 30) {
            this.glitchBar.style.backgroundColor = 'red';
            this.glitchBar.style.boxShadow = '0 0 10px red';
        } else if (percent < 60) {
            this.glitchBar.style.backgroundColor = 'orange';
            this.glitchBar.style.boxShadow = '0 0 10px orange';
        } else {
            this.glitchBar.style.backgroundColor = '#00f3ff';
            this.glitchBar.style.boxShadow = '0 0 5px #00f3ff';
        }
    }
}
