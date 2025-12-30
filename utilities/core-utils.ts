import type { Brand } from "@/types";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitCsv(value: string): string[] {
    const values = value.split(",").map((value) => value.trim());
    return values;
}

function joinCsv(values: string[]): string {
    return values.map((value) => value.trim()).join(",");
}

/**
 * Brands a string literal so it can only be referenced by its intended origin (a constant enum object)
 */
function brand<T extends string>(value: T): Brand<T> {
    return value;
}

export { brand, joinCsv, sleep, splitCsv };
