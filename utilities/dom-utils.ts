const ElementType = {
    Anchor: "a",
    Button: "button",
    Meta: "meta",
    Label: "label",
} as const;

const AttributeName = {
    Name: "name",
    DataMenuTrigger: "data-menu-trigger",
} as const;

const AttributeValue = {
    AssigneesSelectMenu: "assignees-select-menu",
    UserLogin: "user-login",
} as const;

const ElementText = {
    AssignYourself: "assign yourself",
} as const;

const ClassName = {
    Author: "author",
    Assignee: "assignee",
    AssigneeListItemUsername: "js-username",
} as const;

function findElementByInnerText<T extends HTMLElement = HTMLElement>(
    type: keyof HTMLElementTagNameMap,
    innerText: string
): T | undefined {
    const elements = Array.from(document.querySelectorAll<T>(type));
    return elements.find((element) => element.innerText === innerText);
}

function findAssigneesPopoverTrigger(): HTMLElement | undefined {
    const selector =
        `[${AttributeName.DataMenuTrigger}="${AttributeValue.AssigneesSelectMenu}"]` as const;
    return document.querySelector<HTMLElement>(selector) ?? undefined;
}

function getAuthenticatedUserName(): string | undefined {
    const selector =
        `${ElementType.Meta}[${AttributeName.Name}="${AttributeValue.UserLogin}"]` as const;
    const authenticatedUserMeta = document.querySelector(selector);

    if (authenticatedUserMeta == null) {
        return undefined;
    }

    return (authenticatedUserMeta as any).content;
}

function getPullRequestAuthorUserName(): string | undefined {
    const authorLink = document.querySelector<HTMLElement>(
        `${ElementType.Anchor}.${ClassName.Author}`
    );
    if (authorLink == null) {
        return undefined;
    }

    return authorLink.innerText;
}

function isAuthenticatedUserAssigned(): boolean {
    const authenticatedUserName = getAuthenticatedUserName();
    const selector = `${ElementType.Anchor}.${ClassName.Assignee}` as const;
    const assignees = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
    );

    return (
        assignees.find(
            (assignee) => assignee.innerText === authenticatedUserName
        ) != null
    );
}

function findAssignYourselfButton(): HTMLButtonElement | undefined {
    return findElementByInnerText(
        ElementType.Button,
        ElementText.AssignYourself
    );
}

function findAuthenticatedAssigneeListItem(): HTMLElement | undefined {
    const username = getAuthenticatedUserName();
    if (username == null) {
        return undefined;
    }

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

export {
    assignSelfViaPopover,
    findAssignYourselfButton,
    findElementByInnerText,
    getAuthenticatedUserName,
    getPullRequestAuthorUserName,
    isAuthenticatedUserAssigned,
    toggleAssigneesPopover,
};
