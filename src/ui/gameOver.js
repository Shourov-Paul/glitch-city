export class GameOverScreen {
    constructor(onRestart) {
        this.element = document.getElementById('game-over-screen');
        this.scoreElement = document.getElementById('final-score');
        this.button = document.getElementById('restart-btn');
        this.button.addEventListener('click', () => {
            this.hide();
            onRestart();
        });
    }

    show(score) {
        this.scoreElement.innerText = Math.floor(score);
        this.element.classList.remove('hidden');
        this.element.classList.add('active');
    }

    hide() {
        this.element.classList.remove('active');
        this.element.classList.add('hidden');
    }
}
