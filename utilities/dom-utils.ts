import { Logger } from "@/utilities/logger";

type FindElementByInnerTextOptions<T extends HTMLElement = HTMLElement> =
    | { elements: T[]; innerText: string }
    | { innerText: string; type: keyof HTMLElementTagNameMap }
    | { innerText: string };

class DOMUtils {
    static findElementByInnerText<T extends HTMLElement = HTMLElement>(
        options: FindElementByInnerTextOptions<T>
    ): T | undefined {
        const { innerText } = options;
        if ("elements" in options) {
            const match = this.findByInnerText<T>(options.elements, innerText);
            if (match == null) {
                Logger.warn("DOMUtils.findElementByInnerText: no match", {
                    elements: options.elements.length,
                    innerText,
                });
            }
            return match;
        }

        if ("type" in options) {
            const elements = this.querySelectorAll<T>(options.type);
            const match = this.findByInnerText(elements, innerText);
            if (match == null) {
                Logger.warn("DOMUtils.findElementByInnerText: no match", {
                    elements: elements.length,
                    innerText,
                    type: options.type,
                });
            }
            return match;
        }

        const elements = Array.from(document.getElementsByTagName("*")) as T[];
        const match = this.findByInnerText(elements, innerText);
        if (match == null) {
            Logger.warn("DOMUtils.findElementByInnerText: no match", {
                elements: elements.length,
                innerText,
            });
        }
        return match;
    }

    static querySelector<T extends HTMLElement = HTMLElement>(
        selectors: string
    ): T | undefined {
        const element = document.querySelector<T>(selectors) ?? undefined;
        if (element == null) {
            Logger.warn("DOMUtils.querySelector: element not found", {
                selectors,
            });
        }
        return element;
    }

    static querySelectorAll<T extends HTMLElement = HTMLElement>(
        selectors: string
    ): T[] {
        const elements = Array.from(document.querySelectorAll<T>(selectors));
        if (elements.length === 0) {
            Logger.warn("DOMUtils.querySelectorAll: no elements found", {
                selectors,
            });
        }
        return elements;
    }

    private static findByInnerText<T extends HTMLElement = HTMLElement>(
        elements: T[],
        innerText: string
    ): T | undefined {
        return elements.find((element) => element.innerText === innerText);
    }
}

export { DOMUtils };
