import { isString } from "lodash-es";
import { AttributeName, AttributeValue, ClassName, ElementType } from "@/enums";
import { DOMUtils } from "@/utilities/dom-utils";

/**
 * Class for returning data (not elements) based on the Github DOM.
 */
class GithubUtils {
    static getAuthenticatedUsername(): string | undefined {
        const selector =
            `${ElementType.Meta}[${AttributeName.Name}="${AttributeValue.UserLogin}"]` as const;
        const meta = DOMUtils.querySelector(selector);
        if (meta == null) {
            return undefined;
        }

        if (!("content" in meta) || !isString(meta.content)) {
            return undefined;
        }

        return meta.content;
    }

    static getPullRequestBranchName(): string | undefined {
        const selector = `.${ClassName.BranchName}`;
        return DOMUtils.querySelector(selector)?.innerText;
    }

    static getPullRequestTitle(): string | undefined {
        const selector = `.${ClassName.PullRequestTitle}`;
        return DOMUtils.querySelector(selector)?.innerText?.trim();
    }

    static getPullRequestAuthorUsername(): string | undefined {
        const selector = `${ElementType.Anchor}.${ClassName.Author}` as const;
        const authorLink = DOMUtils.querySelector<HTMLElement>(selector);
        if (authorLink == null) {
            return undefined;
        }

        return authorLink.innerText;
    }

    /**
     * Returns whether the specified user is assigned to the issue/pull request
     */
    static isUserAssigned(username: string): boolean {
        const selector = `${ElementType.Anchor}.${ClassName.Assignee}` as const;
        const assignees = DOMUtils.querySelectorAll<HTMLElement>(selector);

        return (
            DOMUtils.findElementByInnerText({
                elements: assignees,
                innerText: username,
            }) != null
        );
    }
}

export { GithubUtils };
