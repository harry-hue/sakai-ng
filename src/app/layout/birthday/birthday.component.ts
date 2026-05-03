import { Component, DestroyRef, ElementRef, inject, signal, viewChild, afterNextRender } from '@angular/core';
import { BIRTHDAY_BACKGROUND_MP3_SRC } from './birthday-audio.config';
import { HappyBirthdayBgmLoop } from './birthday-melody';

/**
 * Background: single MP3 from `birthday-audio.config.ts` (`public/audio/...`).
 * If config is empty, synthesized Happy Birthday loop is used instead — never layered with vocals.
 */
@Component({
    selector: 'app-birthday',
    standalone: true,
    templateUrl: './birthday.component.html',
    styleUrl: './birthday.component.scss'
})
export class BirthdayComponent {
    /** Heading + cake first; then photo slider */
    readonly showIntro = signal(true);
    readonly introDurationMs = 5000;

    /** `public/images/1.jpeg` … `8.jpeg` */
    readonly galleryImages = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/images/${n}.jpeg`);

    /** Doubled for seamless infinite marquee (-50% translate) */
    readonly galleryLoopTrack = [...this.galleryImages, ...this.galleryImages];

    cakeImageOk = true;

    readonly bgmMp3Src = BIRTHDAY_BACKGROUND_MP3_SRC.trim();
    readonly bgmMp3Ref = viewChild<ElementRef<HTMLAudioElement>>('bgmMp3');

    /** Wish typing — interval ms per character (faster reveal) */
    readonly typedWish = signal('');
    readonly wishTypingSource =
        `Dear Noor — on your special day, may every moment feel light, warm, and full of joy. May this year bring you laughter that lingers, dreams that grow clearer, and kindness returned to you tenfold. You deserve days that sparkle as brightly as you do.\n\n` +
        `Here's to candlelight and cake, to old memories that still make you smile, and to new ones waiting just around the corner. Happy Birthday — celebrate yourself today; the world is better with you in it.`;

    private readonly destroyRef = inject(DestroyRef);
    private readonly bgmLoop = new HappyBirthdayBgmLoop();
    private readonly mp3BaseVolume = 0.82;
    private readonly wishCharDelayMs = 65;
    private audioReady = false;
    private introTimer: ReturnType<typeof setTimeout> | null = null;
    private wishTypingInterval: ReturnType<typeof setInterval> | null = null;

    constructor() {
        afterNextRender(() => {
            this.attemptStartMusic();
            this.startWishTyping();
            this.introTimer = window.setTimeout(() => {
                this.showIntro.set(false);
                this.introTimer = null;
            }, this.introDurationMs);
        });

        this.destroyRef.onDestroy(() => {
            if (this.introTimer !== null) {
                clearTimeout(this.introTimer);
            }
            if (this.wishTypingInterval !== null) {
                clearInterval(this.wishTypingInterval);
                this.wishTypingInterval = null;
            }
            this.bgmMp3Ref()?.nativeElement?.pause();
            this.bgmLoop.close();
        });
    }

    /**
     * Browsers often block sound until a gesture — tapping anywhere retries play.
     */
    onUserInteract(): void {
        if (this.bgmMp3Src) {
            const mp3 = this.bgmMp3Ref()?.nativeElement;
            if (mp3 && mp3.paused) {
                void mp3.play().then(() => {
                    this.audioReady = true;
                });
            }
            return;
        }
        this.bgmLoop.resumeIfSuspended();
        if (!this.audioReady) {
            void this.attemptStartMusic();
        }
    }

    onCakeImageError(): void {
        this.cakeImageOk = false;
    }

    /** File missing / decode error: no second track; synth only if no MP3 was configured */
    onBgmMp3Error(): void {
        if (this.bgmMp3Src) {
            return;
        }
        void this.startSynthBgm();
    }

    private attemptStartMusic(): void {
        if (this.bgmMp3Src) {
            const mp3 = this.bgmMp3Ref()?.nativeElement;
            if (!mp3) {
                return;
            }
            mp3.volume = this.mp3BaseVolume;
            if (!mp3.paused) {
                this.audioReady = true;
                return;
            }
            void mp3
                .play()
                .then(() => {
                    this.audioReady = true;
                })
                .catch(() => {
                    /* Autoplay blocked until gesture; do not start synth over MP3 */
                });
            return;
        }

        void this.startSynthBgm();
    }

    private startSynthBgm(): Promise<void> {
        if (this.bgmMp3Src) {
            return Promise.resolve();
        }
        if (this.bgmLoop.isRunning()) {
            this.audioReady = true;
            return Promise.resolve();
        }
        return this.bgmLoop.start().then(() => {
            this.audioReady = true;
        });
    }

    private startWishTyping(): void {
        if (this.wishTypingInterval !== null) {
            clearInterval(this.wishTypingInterval);
        }
        const src = this.wishTypingSource;
        if (!src.length) {
            return;
        }
        if (typeof window === 'undefined' || !window.matchMedia) {
            this.typedWish.set(src);
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.typedWish.set(src);
            return;
        }
        let i = 0;
        this.wishTypingInterval = window.setInterval(() => {
            i += 1;
            this.typedWish.set(src.slice(0, i));
            if (i >= src.length && this.wishTypingInterval !== null) {
                clearInterval(this.wishTypingInterval);
                this.wishTypingInterval = null;
            }
        }, this.wishCharDelayMs);
    }
}
