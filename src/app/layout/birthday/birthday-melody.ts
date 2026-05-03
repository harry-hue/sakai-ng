/**
 * Synthesized "Happy Birthday to You" melody (public-domain tune) via Web Audio API.
 */

export interface MelodyNote {
    f: number;
    d: number;
    g?: number;
}

export const HAPPY_BIRTHDAY_MELODY: MelodyNote[] = [
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 293.66, d: 0.28, g: 0.04 },
    { f: 261.63, d: 0.28, g: 0.04 },
    { f: 349.23, d: 0.28, g: 0.04 },
    { f: 329.63, d: 0.55, g: 0.08 },
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 293.66, d: 0.28, g: 0.04 },
    { f: 261.63, d: 0.28, g: 0.04 },
    { f: 392.0, d: 0.28, g: 0.04 },
    { f: 349.23, d: 0.55, g: 0.08 },
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 261.63, d: 0.12, g: 0.03 },
    { f: 523.25, d: 0.28, g: 0.04 },
    { f: 440.0, d: 0.28, g: 0.04 },
    { f: 349.23, d: 0.28, g: 0.04 },
    { f: 329.63, d: 0.28, g: 0.04 },
    { f: 293.66, d: 0.45, g: 0.08 },
    { f: 466.16, d: 0.12, g: 0.03 },
    { f: 466.16, d: 0.12, g: 0.03 },
    { f: 440.0, d: 0.28, g: 0.04 },
    { f: 349.23, d: 0.28, g: 0.04 },
    { f: 392.0, d: 0.28, g: 0.04 },
    { f: 349.23, d: 0.65, g: 0.05 }
];

const PHRASE_GAP_SEC = 2.1;

export function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number, peakGain = 0.11): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);
    const g0 = 0.0001;
    gain.gain.setValueAtTime(g0, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(g0, startTime + Math.max(duration, 0.06));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.08);
}

export function scheduleHappyBirthdayMelody(ctx: AudioContext, startOffset = 0.1, peakGain = 0.11): { duration: number } {
    const t0 = ctx.currentTime + startOffset;
    let t = t0;
    for (const n of HAPPY_BIRTHDAY_MELODY) {
        playTone(ctx, n.f, t, n.d, peakGain);
        t += n.d + (n.g ?? 0.04);
    }
    return { duration: t - t0 };
}

/** Loops the birthday phrase in the background with a short pause between repeats. */
export class HappyBirthdayBgmLoop {
    private ctx: AudioContext | null = null;
    private timerId: ReturnType<typeof setTimeout> | null = null;
    private active = false;
    private ducked = false;

    setDucked(ducked: boolean): void {
        this.ducked = ducked;
    }

    async start(): Promise<void> {
        const AC =
            window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) {
            return;
        }
        if (!this.ctx || this.ctx.state === 'closed') {
            this.ctx = new AC();
        }
        await this.ctx.resume();
        this.active = true;
        this.queueNextPhrase();
    }

    private queueNextPhrase(): void {
        if (!this.active || !this.ctx) {
            return;
        }
        this.clearTimer();
        const peak = this.ducked ? 0.038 : 0.1;
        const { duration } = scheduleHappyBirthdayMelody(this.ctx, 0.1, peak);
        this.timerId = window.setTimeout(() => {
            this.timerId = null;
            this.queueNextPhrase();
        }, (duration + PHRASE_GAP_SEC) * 1000);
    }

    private clearTimer(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    isRunning(): boolean {
        return this.active;
    }

    /** Call after a user tap if autoplay left the context suspended */
    resumeIfSuspended(): void {
        if (this.ctx && this.ctx.state === 'suspended') {
            void this.ctx.resume();
        }
    }

    stop(): void {
        this.active = false;
        this.clearTimer();
        if (this.ctx && this.ctx.state === 'running') {
            void this.ctx.suspend();
        }
    }

    close(): void {
        this.stop();
        void this.ctx?.close();
        this.ctx = null;
    }
}
