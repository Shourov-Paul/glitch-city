export class SoundSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isInitialized = false;
        this.ambientOsc = null;
        this.musicMuted = false;
        this.sfxMuted = false;
    }

    init() {
        if (this.isInitialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0; // Start silent to prevent pop
            this.masterGain.connect(this.ctx.destination);
            this.isInitialized = true;
            console.log('SoundSystem Initialized');
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    resume() {
        if (!this.ctx) this.init();

        const startAudio = () => {
            console.log('AudioContext Active');
            // Fade in master volume to prevent popping
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.5);

            if (!this.musicMuted) this.startAmbient();
        };

        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(startAudio);
        } else if (this.ctx && this.ctx.state === 'running') {
            startAudio();
        }
    }

    toggleMusic() {
        this.musicMuted = !this.musicMuted;
        if (this.musicMuted && this.ambientOsc) {
            this.ambientOsc.stop();
            this.ambientOsc = null;
        } else if (!this.musicMuted && this.isInitialized) {
            this.startAmbient();
        }
        return this.musicMuted;
    }

    toggleSFX() {
        this.sfxMuted = !this.sfxMuted;
        return this.sfxMuted;
    }

    playCollect() {
        if (!this.ctx || this.sfxMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playGlitch() {
        if (!this.ctx || this.sfxMuted) return;

        const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        noise.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
    }

    startAmbient() {
        if (!this.ctx || this.ambientOsc || this.musicMuted) return;

        // Low drone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 50; // Low hum

        // LFO to modulate volume slightly for "breathing" effect
        lfo.type = 'sine';
        lfo.frequency.value = 0.2; // Very slow
        lfoGain.gain.value = 0.1; // Modulation depth

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200; // Muffle the sawtooth to a drone

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2.0); // Slow fade in for ambient

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        lfo.start();
        this.ambientOsc = osc;
    }

    playDash() {
        if (!this.ctx || this.sfxMuted) return;

        // Filter Sweep "Whoosh"
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + 0.2);
        filter.Q.value = 1;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
    }

    startMusic() {
        if (!this.ctx || this.isPlayingMusic) return;
        this.isPlayingMusic = true;

        const kick = () => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.5);
        };

        const hihat = () => {
            const bufferSize = this.ctx.sampleRate * 0.05;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 5000;
            const gain = this.ctx.createGain();
            gain.gain.value = 0.3;
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            noise.start();
        };

        const bass = (freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.2);
        };

        // Simple sequencer loop
        let step = 0;
        const noteLength = 0.115; // 16th note at ~130bpm

        // This is a simplified interval-based sequencer. 
        // For production, lookahead scheduling is better, but this suffices for a game loop context if called frequently,
        // or we just use setInterval.
        this.musicInterval = setInterval(() => {
            if (this.ctx.state === 'suspended' || this.musicMuted) return;

            // 4/4 Beat
            if (step % 4 === 0) kick(); // Kick on beats
            if (step % 4 === 2) hihat(); // Off-beat hat
            if (step % 2 === 0) bass(55); // Bass Freq

            // Driving bassline filler
            if (step % 4 !== 0) bass(Math.random() > 0.5 ? 55 : 110);

            step++;
        }, noteLength * 1000);
    }

    playHit() {
        if (!this.ctx || this.sfxMuted) return;

        // Distorted Crunch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, this.ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);

        // Add some noise for crunch
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start();
    }
}
