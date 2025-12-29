import React from "react";

type AccordionProps = {
    children: React.ReactNode;
    defaultIsOpen?: boolean;
    label: string;
};

function Accordion(props: AccordionProps) {
    const { children, defaultIsOpen, label } = props;
    return (
        <details open={defaultIsOpen}>
            <summary>{label}</summary>
            {children}
        </details>
    );
}

export { Accordion };
