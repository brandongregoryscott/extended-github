import { AttributeName, AttributeValue, ElementType } from "@/enums";

class GithubUtils {
    static getAuthenticatedUsername(): string | undefined {
        const selector =
            `${ElementType.Meta}[${AttributeName.Name}="${AttributeValue.UserLogin}"]` as const;
        const authenticatedUserMeta = document.querySelector(selector);
        if (authenticatedUserMeta == null) {
            return undefined;
        }

        return (authenticatedUserMeta as any).content;
    }
}

export { GithubUtils };
