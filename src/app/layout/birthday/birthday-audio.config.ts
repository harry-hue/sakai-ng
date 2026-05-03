/**
 * **Apna background music yahan set karein**
 *
 * 1. MP3 file `public/audio/` folder me rakhein (e.g. `public/audio/mera-gaana.mp3`).
 * 2. Neeche path likhein — hamesha `/audio/...` se shuru ho (public root).
 *
 * Example:
 *   `export const BIRTHDAY_BACKGROUND_MP3_SRC = '/audio/mera-gaana.mp3';`
 *
 * Khali string `''` = built-in synthesized “Happy Birthday” loop hi chalega.
 *
 * **Music kahan se lein (legal / royalty-free examples):**
 * - https://pixabay.com/music/ — download MP3, project me copy karein
 * - https://incompetech.com/music/royalty-free/ — MP3 download, attribution dein agar license me ho
 * - https://freemusicarchive.org/ — license check karke download
 *
 * Sirf aisi files use karein jinka aap use karne ke liye haq hon / license allow kare.
 */
/** Current file in `public/audio/` (audio track — `.mp3`; agar `.mp4` video ho to batayein, alag player lagana hoga) */
export const BIRTHDAY_BACKGROUND_MP3_SRC = '/audio/nastelbom-happy-birthday-469282.mp3';
