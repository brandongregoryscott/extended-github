import React from "react";
import { cn } from "@/utilities/class-names";

type FormFieldProps = {
    children: React.ReactNode;
    description?: string;
    disabled?: boolean;
    inputId: string;
    label: string;
};

function FormField(props: FormFieldProps) {
    const { children, description, disabled, inputId, label } = props;

    return (
        <label
            className={cn("display-flex-column gap-sm", { disabled })}
            htmlFor={inputId}>
            <strong>{label}</strong>
            {description != null && (
                <span className="font-size-sm">{description}</span>
            )}
            {children}
        </label>
    );
}

export { FormField };
