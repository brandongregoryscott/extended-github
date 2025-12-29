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
            return this.findByInnerText<T>(options.elements, innerText);
        }

        if ("type" in options) {
            const elements = this.querySelectorAll<T>(options.type);
            return this.findByInnerText(elements, innerText);
        }

        const elements = Array.from(document.getElementsByTagName("*")) as T[];
        return this.findByInnerText(elements, innerText);
    }

    static querySelector<T extends HTMLElement = HTMLElement>(
        selectors: string
    ): T | undefined {
        return document.querySelector<T>(selectors) ?? undefined;
    }

    static querySelectorAll<T extends HTMLElement = HTMLElement>(
        selectors: string
    ): T[] {
        return Array.from(document.querySelectorAll<T>(selectors));
    }

    private static findByInnerText<T extends HTMLElement = HTMLElement>(
        elements: T[],
        innerText: string
    ): T | undefined {
        return elements.find((element) => element.innerText === innerText);
    }
}

export { DOMUtils };
