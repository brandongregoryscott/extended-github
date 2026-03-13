import {
    AttributeName,
    AttributeValue,
    ClassName,
    ElementText,
    ElementType,
} from "@/enums";
import { DOMUtils } from "@/utilities/dom-utils";

/**
 * Methods that return useful elements from the Github DOM.
 */
class GithubDOMUtils {
    static findEditPullRequestTitleButton(): HTMLButtonElement | undefined {
        const selector = `[${AttributeName.DataComponent}="${AttributeValue.ExistingPullRequestTitle}"] [${AttributeName.DataComponent}="${AttributeValue.IconButton}"]`;
        return DOMUtils.querySelector(selector);
    }

    static findPullRequestTitleInput(): HTMLInputElement | undefined {
        return (
            this.findNewPullRequestTitleInput() ??
            this.findExistingPullRequestTitleInput()
        );
    }

    static findNewPullRequestTitleInput(): HTMLInputElement | undefined {
        const selector =
            `[${AttributeName.Name}="${AttributeValue.NewPullRequestTitle}"]` as const;
        return DOMUtils.querySelector(selector);
    }

    static findExistingPullRequestTitleInput(): HTMLInputElement | undefined {
        const selector =
            `${ElementType.ReactApp} ${ElementType.Form} ${ElementType.Input}` as const;
        return DOMUtils.querySelector(selector);
    }

    static findSaveButton(): HTMLButtonElement | undefined {
        return DOMUtils.findElementByInnerText({
            innerText: ElementText.Save,
            type: ElementType.Button,
        });
    }

    static findAssigneesPopoverTrigger(): HTMLElement | undefined {
        const selector =
            `[${AttributeName.DataMenuTrigger}="${AttributeValue.AssigneesSelectMenu}"]` as const;
        return DOMUtils.querySelector<HTMLElement>(selector);
    }

    static findAssignYourselfButton(): HTMLButtonElement | undefined {
        return DOMUtils.findElementByInnerText({
            innerText: ElementText.AssignYourself,
            type: ElementType.Button,
        });
    }

    static findAssigneeListItemByUsername(
        username: string
    ): HTMLElement | undefined {
        const selector = `.${ClassName.AssigneeListItemUsername}` as const;
        const listItems = DOMUtils.querySelectorAll(selector);

        return (
            DOMUtils.findElementByInnerText({
                elements: listItems,
                innerText: username,
            })?.closest<HTMLElement>(ElementType.Label) ?? undefined
        );
    }
}

export { GithubDOMUtils };
