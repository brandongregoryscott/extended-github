import React from "react";
import { cn } from "@/utilities/class-names";

type FormFieldProps = {
    disabled?: boolean;
    inputId: string;
    label: string;
    description?: string;
    children: React.ReactNode;
};

function FormField(props: FormFieldProps) {
    const { inputId, disabled, label, description, children } = props;

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
