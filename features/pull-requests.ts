import { UserGroups } from "@/enums";
import { sleep } from "@/utilities/core-utils";
import { GithubDOMUtils } from "@/utilities/github-dom-utils";
import { GithubUtils } from "@/utilities/github-utils";
import { Logger } from "@/utilities/logger";
import { SettingsUtils } from "@/utilities/settings-utils";
import { StringUtils } from "@/utilities/string-utils";

class PullRequests {
    static async runScripts(): Promise<void> {
        await this.autoAssignAuthor();
        await this.autoAddTicketToTitle();
    }

    static async autoAssignAuthor(): Promise<void> {
        const enabled = await SettingsUtils.isAutoAssignAuthorEnabled();
        if (enabled === false) {
            return;
        }

        const authenticatedUser = GithubUtils.getAuthenticatedUsername();
        const pullRequestAuthor = GithubUtils.getPullRequestAuthorUsername();
        if (authenticatedUser == null || pullRequestAuthor == null) {
            Logger.warn("autoAssignAuthor: missing usernames", {
                authenticatedUser,
                pullRequestAuthor,
            });
            return;
        }

        if (enabled === UserGroups.Author) {
            return autoAssignUser(pullRequestAuthor);
        }

        return autoAssignSelf();
    }

    static async autoAddTicketToTitle(): Promise<void> {
        const enabled = await SettingsUtils.isAutoAddTicketToTitleEnabled();
        if (enabled === false) {
            return;
        }

        const authenticatedUser = GithubUtils.getAuthenticatedUsername();
        const pullRequestAuthor = GithubUtils.getPullRequestAuthorUsername();
        if (authenticatedUser == null || pullRequestAuthor == null) {
            Logger.warn("autoAddTicketToTitle: missing usernames", {
                authenticatedUser,
                pullRequestAuthor,
            });
            return;
        }

        if (
            enabled === UserGroups.Self &&
            pullRequestAuthor !== authenticatedUser
        ) {
            return;
        }

        const branchName = GithubUtils.getPullRequestBranchName();
        if (branchName == null) {
            Logger.warn("autoAddTicketToTitle: missing branch name");
            return;
        }

        const ticketNumber = StringUtils.parseTicketNumber(branchName);
        if (ticketNumber == null) {
            Logger.warn("autoAddTicketToTitle: missing ticket number", {
                branchName,
            });
            return;
        }

        const pullRequestTitle = GithubUtils.getPullRequestTitle();
        if (
            pullRequestTitle == null ||
            pullRequestTitle.endsWith(ticketNumber)
        ) {
            if (pullRequestTitle == null) {
                Logger.warn("autoAddTicketToTitle: missing pull request title");
            }
            return;
        }

        const editTitleButton = GithubDOMUtils.findEditPullRequestTitleButton();
        if (editTitleButton == null) {
            Logger.warn("autoAddTicketToTitle: missing edit title button");
        }
        editTitleButton?.click();
        await sleep(250);
        const titleInput = GithubDOMUtils.findPullRequestTitleInput();
        if (titleInput == null) {
            Logger.warn("autoAddTicketToTitle: missing title input");
            return;
        }

        Logger.debug("autoAddTicketToTitle: updating title", {
            pullRequestTitle,
            ticketNumber,
        });
        const updatedTitle = `${pullRequestTitle} ${ticketNumber}`;
        titleInput.value = updatedTitle;
        titleInput.dispatchEvent(new Event("input", { bubbles: true }));
        titleInput.dispatchEvent(new Event("change", { bubbles: true }));
        const saveButton = GithubDOMUtils.findSaveButton();
        if (saveButton == null) {
            Logger.warn("autoAddTicketToTitle: missing save button");
            return;
        }
        saveButton?.click();
    }
}

async function autoAssignUser(username: string): Promise<void> {
    const authenticatedUser = GithubUtils.getAuthenticatedUsername();
    const isAssigned = GithubUtils.isUserAssigned(username);
    if (isAssigned) {
        return;
    }

    const assignYourselfButton = GithubDOMUtils.findAssignYourselfButton();
    if (username === authenticatedUser && assignYourselfButton != null) {
        assignYourselfButton.click();
        return;
    }
    if (username === authenticatedUser && assignYourselfButton == null) {
        Logger.warn("autoAssignUser: missing assign-yourself button");
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
    const pullRequestAuthor = GithubUtils.getPullRequestAuthorUsername();

    if (
        authenticatedUsername == null ||
        pullRequestAuthor == null ||
        pullRequestAuthor !== authenticatedUsername
    ) {
        return;
    }

    return autoAssignUser(authenticatedUsername);
}

function toggleAssigneesPopover(): void {
    const assigneesPopover = GithubDOMUtils.findAssigneesPopoverTrigger();
    if (assigneesPopover == null) {
        Logger.warn("autoAssignUser: missing assignees popover trigger");
        return;
    }
    assigneesPopover?.click();
}

function assignUserViaPopover(username: string): void {
    const userListItem =
        GithubDOMUtils.findAssigneeListItemByUsername(username);
    if (userListItem == null) {
        Logger.warn("autoAssignUser: missing user list item", { username });
        return;
    }
    if (userListItem?.ariaChecked === true.toString()) {
        return;
    }

    userListItem?.click();
}

export { PullRequests };
