const AttributeName = {
    DataMenuButton: "data-menu-button",
    DataMenuTrigger: "data-menu-trigger",
    Href: "href",
    Name: "name",
} as const;

const AttributeValue = {
    AssigneesSelectMenu: "assignees-select-menu",
    NewPullRequestTitle: "pull_request[title]",
    UserLogin: "user-login",
} as const;

export { AttributeName, AttributeValue };
