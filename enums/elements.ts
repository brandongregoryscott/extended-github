const ElementType = {
    Anchor: "a",
    Button: "button",
    Form: "form",
    Input: "input",
    Label: "label",
    Meta: "meta",
    /** This seems to be a custom web element for rendering a React tree/island in their larger web application  */
    ReactApp: "react-app",
    Span: "span",
} as const;

const ElementId = {
    HeadBranchSelector: "head-ref-selector",
} as const;

const ElementText = {
    AssignYourself: "assign yourself",
    Save: "Save",
} as const;

export { ElementId, ElementText, ElementType };
