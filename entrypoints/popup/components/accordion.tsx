import React from "react";

type AccordionProps = {
    defaultIsOpen?: boolean;
    label: string;
    children: React.ReactNode;
};

function Accordion(props: AccordionProps) {
    const { label, children, defaultIsOpen } = props;
    return (
        <details open={defaultIsOpen}>
            <summary>{label}</summary>
            {children}
        </details>
    );
}

export { Accordion };
