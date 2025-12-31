const ElementType = {
    Anchor: "a",
    Button: "button",
    Label: "label",
    Meta: "meta",
} as const;

const ElementId = {
    HeadBranchSelector: "head-ref-selector",
} as const;

const ElementText = {
    AssignYourself: "assign yourself",
    Save: "Save",
} as const;

export { ElementId, ElementText, ElementType };
