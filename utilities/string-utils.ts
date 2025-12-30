class StringUtils {
    static parseTicketNumber(value: string): string | undefined {
        return value.match(/[a-zA-Z]+-[0-9]+/)?.[0]?.toUpperCase();
    }
}

export { StringUtils };
