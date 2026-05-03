import { Component, DestroyRef, ElementRef, inject, viewChild, afterNextRender } from '@angular/core';

/**
 * Background music: Kevin MacLeod — "Happy Alley" (incompetech.com, CC BY 4.0).
 * Bundled copy in `public/audio/birthday-bg.mp3`. Replace file if you prefer another track.
 */
@Component({
    selector: 'app-birthday',
    standalone: true,
    templateUrl: './birthday.component.html',
    styleUrl: './birthday.component.scss'
})
export class BirthdayComponent {
    /** Local SVG from `public/images/` — falls back to CSS cake if asset missing */
    cakeImageOk = true;

    readonly bgAudio = viewChild<ElementRef<HTMLAudioElement>>('bgAudio');

    musicPlaying = false;
    /** Browser blocked autoplay — user should tap Play */
    autoplayBlocked = false;

    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        afterNextRender(() => {
            const el = this.bgAudio()?.nativeElement;
            if (!el) {
                return;
            }
            el.volume = 0.35;
            void el.play().then(() => {
                this.musicPlaying = true;
                this.autoplayBlocked = false;
            }).catch(() => {
                this.autoplayBlocked = true;
                this.musicPlaying = false;
            });
        });

        this.destroyRef.onDestroy(() => {
            const el = this.bgAudio()?.nativeElement;
            el?.pause();
        });
    }

    onCakeImageError(): void {
        this.cakeImageOk = false;
    }

    toggleMusic(): void {
        const el = this.bgAudio()?.nativeElement;
        if (!el) {
            return;
        }
        if (this.musicPlaying) {
            el.pause();
            this.musicPlaying = false;
            return;
        }
        void el.play().then(() => {
            this.musicPlaying = true;
            this.autoplayBlocked = false;
        });
    }
}
