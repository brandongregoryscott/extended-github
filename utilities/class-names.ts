import { compact, isString, uniq } from "lodash-es";

function classNames(
    ...inputClassNames: Array<
        Record<string, boolean | null | undefined> | string
    >
): string {
    const truthyClassNames = inputClassNames.flatMap((className) => {
        if (isString(className)) {
            return className;
        }

        const flattenedClassNames = Object.entries(className).map(
            ([key, value]) => {
                if (value !== true) {
                    return undefined;
                }

                return key;
            }
        );

        return compact(flattenedClassNames);
    });

    return uniq(
        compact(truthyClassNames.map((className) => className.trim()))
    ).join(" ");
}

export { classNames, classNames as cn };
