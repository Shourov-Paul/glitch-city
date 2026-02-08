export class StartScreen {
    constructor(onStart) {
        this.element = document.getElementById('start-screen');
        this.button = document.getElementById('start-btn');
        this.button.addEventListener('click', () => {
            this.hide();
            onStart();
        });
    }

    show() {
        this.element.classList.remove('hidden');
        this.element.classList.add('active');
    }

    hide() {
        this.element.classList.remove('active');
        this.element.classList.add('hidden');
    }
}
