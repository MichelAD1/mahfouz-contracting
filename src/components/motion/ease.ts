/** One easing for the whole site, so everything moves as a single system. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The entrance curve, and the same numbers as `--ease-reveal` in globals.css.
 *
 * Entrances want a flatter curve than hovers do. It is declared twice because
 * the hero animates in CSS and the sections animate in JS — they are the same
 * movement, so they have to be the same cubic, and a mismatch would show as
 * two different sites scrolling past each other.
 */
export const EASE_REVEAL = [0.33, 1, 0.68, 1] as const;
