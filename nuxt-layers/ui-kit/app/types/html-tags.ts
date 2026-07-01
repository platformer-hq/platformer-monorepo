import type { IntrinsicElementAttributes } from 'vue';

/**
 * Known HTML tags.
 */
export type KnownHtmlTag = keyof IntrinsicElementAttributes;

/**
 * Returns known HTML tag attributes.
 */
export type KnownHtmlTagAttributes<E extends KnownHtmlTag> = IntrinsicElementAttributes[E];
