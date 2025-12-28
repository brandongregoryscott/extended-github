import {
    AttributeName,
    AttributeValue,
    ClassName,
    ElementText,
    ElementType,
} from "@/enums";
import { DomUtils } from "@/utilities/dom-utils";

class PullRequests {}

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
