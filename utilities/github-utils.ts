import { isString } from "lodash-es";
import {
    AttributeName,
    AttributeValue,
    ClassName,
    ElementId,
    ElementType,
} from "@/enums";
import { DOMUtils } from "@/utilities/dom-utils";
import { RouteUtils } from "@/utilities/route-utils";

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
        if (RouteUtils.matchesNewPullRequestUrl()) {
            const newPullRequestSelector =
                `#${ElementId.HeadBranchSelector} [${AttributeName.DataMenuButton}]` as const;
            return DOMUtils.querySelector(newPullRequestSelector)?.innerText;
        }

        const existingPullRequestSelector = `.${ClassName.BranchName}` as const;
        return DOMUtils.querySelector(existingPullRequestSelector)?.innerText;
    }

    static getPullRequestTitle(): string | undefined {
        if (RouteUtils.matchesNewPullRequestUrl()) {
            const newPullRequestSelector =
                `.${ClassName.PullRequestTitleInput}` as const;
            return DOMUtils.querySelector<HTMLInputElement>(
                newPullRequestSelector
            )?.value.trim();
        }

        const existingPullRequestSelector =
            `.${ClassName.PullRequestTitle}` as const;
        return DOMUtils.querySelector(
            existingPullRequestSelector
        )?.innerText?.trim();
    }

    static getPullRequestAuthorUsername(): string | undefined {
        if (RouteUtils.matchesNewPullRequestUrl()) {
            return this.getAuthenticatedUsername();
        }

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
