type FindElementByInnerTextOptions<T extends HTMLElement = HTMLElement> =
    | { elements: T[]; innerText: string }
    | { innerText: string }
    | { type: keyof HTMLElementTagNameMap; innerText: string };

class DomUtils {
    static findElementByInnerText<T extends HTMLElement = HTMLElement>(
        options: FindElementByInnerTextOptions<T>
    ): T | undefined {
        const { innerText } = options;
        if ("elements" in options) {
            return this.findByInnerText<T>(options.elements, innerText);
        }

        if ("type" in options) {
            const elements = Array.from(
                document.querySelectorAll<T>(options.type)
            );
            return this.findByInnerText(elements, innerText);
        }

        const elements = Array.from(document.getElementsByTagName("*")) as T[];
        return this.findByInnerText(elements, innerText);
    }

    private static findByInnerText<T extends HTMLElement = HTMLElement>(
        elements: T[],
        innerText: string
    ): T | undefined {
        return elements.find((element) => element.innerText === innerText);
    }
}

export { DomUtils };
