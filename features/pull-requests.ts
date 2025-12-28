import {
    AttributeName,
    AttributeValue,
    ClassName,
    ElementText,
    ElementType,
} from "@/enums";
import { sleep } from "@/utilities/core-utils";
import { DomUtils } from "@/utilities/dom-utils";
import { isEnabled } from "@/utilities/settings";

class PullRequests {
    static async autoAssignAuthor(): Promise<void> {
        if (!(await isEnabled())) {
            return;
        }

        const authenticatedUser = getAuthenticatedUsername();
        const pullRequestAuthor = getPullRequestAuthorUsername();
        if (
            authenticatedUser == null ||
            pullRequestAuthor == null ||
            authenticatedUser !== pullRequestAuthor
        ) {
            return;
        }

        const isAssigned = isAuthenticatedUserAssigned();
        if (isAssigned) {
            return;
        }

        const assignYourselfButton = findAssignYourselfButton();
        if (assignYourselfButton != null) {
            assignYourselfButton.click();
            return;
        }

        toggleAssigneesPopover();
        await sleep(250);
        toggleAssigneesPopover();
        await sleep(250);
        toggleAssigneesPopover();
        await sleep(1000);
        assignSelfViaPopover();
        await sleep(500);
        toggleAssigneesPopover();
    }
}

function findAssigneesPopoverTrigger(): HTMLElement | undefined {
    const selector =
        `[${AttributeName.DataMenuTrigger}="${AttributeValue.AssigneesSelectMenu}"]` as const;
    return document.querySelector<HTMLElement>(selector) ?? undefined;
}

function getAuthenticatedUsername(): string | undefined {
    const selector =
        `${ElementType.Meta}[${AttributeName.Name}="${AttributeValue.UserLogin}"]` as const;
    const authenticatedUserMeta = document.querySelector(selector);

    if (authenticatedUserMeta == null) {
        return undefined;
    }

    return (authenticatedUserMeta as any).content;
}

function getPullRequestAuthorUsername(): string | undefined {
    const authorLink = document.querySelector<HTMLElement>(
        `${ElementType.Anchor}.${ClassName.Author}`
    );
    if (authorLink == null) {
        return undefined;
    }

    return authorLink.innerText;
}

function isUserAssigned(username: string): boolean {
    const selector = `${ElementType.Anchor}.${ClassName.Assignee}` as const;
    const assignees = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
    );

    return (
        assignees.find((assignee) => assignee.innerText === username) != null
    );
}

function isAuthenticatedUserAssigned(): boolean {
    const authenticatedUserName = getAuthenticatedUsername();
    if (authenticatedUserName == null) {
        return false;
    }

    return isUserAssigned(authenticatedUserName);
}

function findAssignYourselfButton(): HTMLButtonElement | undefined {
    return DomUtils.findElementByInnerText({
        type: ElementType.Button,
        innerText: ElementText.AssignYourself,
    });
}

function findAssigneeListItemByUsername(
    username: string
): HTMLElement | undefined {
    const selector = `.${ClassName.AssigneeListItemUsername}` as const;
    const listItems = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
    );
    return (
        listItems
            .find((element) => element.innerText === username)
            ?.closest<HTMLElement>(ElementType.Label) ?? undefined
    );
}

function findAuthenticatedAssigneeListItem(): HTMLElement | undefined {
    const username = getAuthenticatedUsername();
    if (username == null) {
        return undefined;
    }

    return findAssigneeListItemByUsername(username);
}

function toggleAssigneesPopover(): void {
    const assigneesPopover = findAssigneesPopoverTrigger();
    assigneesPopover?.click();
}

function assignSelfViaPopover(): void {
    const authenticatedUserListItem = findAuthenticatedAssigneeListItem();
    if (authenticatedUserListItem?.ariaChecked === true.toString()) {
        return;
    }

    authenticatedUserListItem?.click();
}

function assignUserViaPopover(username: string): void {
    const userListItem = findAssigneeListItemByUsername(username);
    if (userListItem?.ariaChecked === true.toString()) {
        return;
    }
}

export { PullRequests };
