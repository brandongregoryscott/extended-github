/**
 * Used to brand a string for type discrimination
 */
type Brand<T extends string> = {
    __brand__?: T;
} & T;

export type { Brand };
