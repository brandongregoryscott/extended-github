import type { UserGroup } from "@/enums";
import {
    AttributeName,
    AttributeValue,
    ClassName,
    ElementText,
    ElementType,
    UserGroups,
} from "@/enums";
import { sleep } from "@/utilities/core-utils";
import { DOMUtils } from "@/utilities/dom-utils";
import { GithubUtils } from "@/utilities/github-utils";
import { SettingsUtils } from "@/utilities/settings-utils";

class PullRequests {
    static async autoAssignAuthor(): Promise<void> {
        const enabled = await this.isAutoAssignAuthorEnabled();
        if (enabled === false) {
            return;
        }

        const authenticatedUser = GithubUtils.getAuthenticatedUsername();
        const pullRequestAuthor = getPullRequestAuthorUsername();
        if (authenticatedUser == null || pullRequestAuthor == null) {
            return;
        }

        if (enabled === UserGroups.Everyone) {
            return autoAssignUser(pullRequestAuthor);
        }

        return autoAssignSelf();
    }

    static async isAutoAssignAuthorEnabled(): Promise<false | UserGroup> {
        const globallyEnabled = await SettingsUtils.isEnabled();
        if (!globallyEnabled) {
            return false;
        }

        const settings = await SettingsUtils.getSettings();

        if (settings.features.pullRequest.autoAssignAuthorEnabled) {
            return UserGroups.Everyone;
        }

        if (settings.features.pullRequest.autoAssignSelfEnabled) {
            return UserGroups.Self;
        }

        return false;
    }
}

async function autoAssignUser(username: string): Promise<void> {
    const authenticatedUser = GithubUtils.getAuthenticatedUsername();
    const isAssigned = isUserAssigned(username);
    if (isAssigned) {
        return;
    }

    const assignYourselfButton = findAssignYourselfButton();
    if (username === authenticatedUser && assignYourselfButton != null) {
        assignYourselfButton.click();
        return;
    }

    // We need to toggle open & close the popover for the users to actually load. If we just open it
    // programmatically, it seems to load indefinitely.
    toggleAssigneesPopover();
    await sleep(250);
    toggleAssigneesPopover();
    await sleep(250);
    toggleAssigneesPopover();
    await sleep(1000);
    assignUserViaPopover(username);
    await sleep(500);
    toggleAssigneesPopover();
}

async function autoAssignSelf(): Promise<void> {
    const authenticatedUsername = GithubUtils.getAuthenticatedUsername();
    const pullRequestAuthor = getPullRequestAuthorUsername();

    if (
        authenticatedUsername == null ||
        pullRequestAuthor == null ||
        pullRequestAuthor !== authenticatedUsername
    ) {
        return;
    }

    return autoAssignUser(authenticatedUsername);
}

function findAssigneesPopoverTrigger(): HTMLElement | undefined {
    const selector =
        `[${AttributeName.DataMenuTrigger}="${AttributeValue.AssigneesSelectMenu}"]` as const;
    return DOMUtils.querySelector<HTMLElement>(selector);
}

function getPullRequestAuthorUsername(): string | undefined {
    const selector = `${ElementType.Anchor}.${ClassName.Author}` as const;
    const authorLink = DOMUtils.querySelector<HTMLElement>(selector);
    if (authorLink == null) {
        return undefined;
    }

    return authorLink.innerText;
}

function isUserAssigned(username: string): boolean {
    const selector = `${ElementType.Anchor}.${ClassName.Assignee}` as const;
    const assignees = DOMUtils.querySelectorAll<HTMLElement>(selector);

    return (
        assignees.find((assignee) => assignee.innerText === username) != null
    );
}

function findAssignYourselfButton(): HTMLButtonElement | undefined {
    return DOMUtils.findElementByInnerText({
        type: ElementType.Button,
        innerText: ElementText.AssignYourself,
    });
}

function findAssigneeListItemByUsername(
    username: string
): HTMLElement | undefined {
    const selector = `.${ClassName.AssigneeListItemUsername}` as const;
    const listItems = DOMUtils.querySelectorAll(selector);
    return (
        listItems
            .find((element) => element.innerText === username)
            ?.closest<HTMLElement>(ElementType.Label) ?? undefined
    );
}

function toggleAssigneesPopover(): void {
    const assigneesPopover = findAssigneesPopoverTrigger();
    assigneesPopover?.click();
}

function assignUserViaPopover(username: string): void {
    const userListItem = findAssigneeListItemByUsername(username);
    if (userListItem?.ariaChecked === true.toString()) {
        return;
    }

    userListItem?.click();
}

export { PullRequests };
