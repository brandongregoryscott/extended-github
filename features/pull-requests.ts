import { UserGroups } from "@/enums";
import { sleep } from "@/utilities/core-utils";
import { GithubDOMUtils } from "@/utilities/github-dom-utils";
import { GithubUtils } from "@/utilities/github-utils";
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
            return;
        }

        const ticketNumber = StringUtils.parseTicketNumber(branchName);
        if (ticketNumber == null) {
            return;
        }

        const pullRequestTitle = GithubUtils.getPullRequestTitle();
        if (
            pullRequestTitle == null ||
            pullRequestTitle.endsWith(ticketNumber)
        ) {
            return;
        }

        const editTitleButton = GithubDOMUtils.findEditPullRequestTitleButton();
        editTitleButton?.click();
        await sleep(250);
        const titleInput = GithubDOMUtils.findPullRequestTitleInput();
        if (titleInput == null) {
            return;
        }

        const updatedTitle = `${pullRequestTitle} ${ticketNumber}`;
        titleInput.value = updatedTitle;
        const saveButton = GithubDOMUtils.findSaveButton();
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
    assigneesPopover?.click();
}

function assignUserViaPopover(username: string): void {
    const userListItem =
        GithubDOMUtils.findAssigneeListItemByUsername(username);
    if (userListItem?.ariaChecked === true.toString()) {
        return;
    }

    userListItem?.click();
}

export { PullRequests };
