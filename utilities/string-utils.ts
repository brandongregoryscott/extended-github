import { isEmpty } from "lodash-es";

class StringUtils {
    static parseTicketNumber(
        value: string,
        prefixes?: string[]
    ): string | undefined {
        const cleanedPrefixes = prefixes
            ?.map((prefix) => prefix.replace(/-+$/, "").trim())
            .filter((prefix) => !isEmpty(prefix));

        const pattern =
            cleanedPrefixes != null && !isEmpty(cleanedPrefixes)
                ? new RegExp(`(?:${cleanedPrefixes.join("|")})-[0-9]+`, "i")
                : /[a-zA-Z]+-[0-9]+/;

        return value.match(pattern)?.[0]?.toUpperCase();
    }
}

export { StringUtils };
