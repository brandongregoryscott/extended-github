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

export { joinCsv, sleep, splitCsv };
