import { cn } from "@/utilities/class-names";
import React from "react";

type CheckboxProps = {
    id: string;
    disabled?: boolean;
    onChange: (value: boolean) => void;
    value: boolean;
    label: string;
};

function Checkbox(props: CheckboxProps) {
    const { label, id, disabled, onChange, value } = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <label className={cn("display-flex", "gap-sm")}>
            <input
                disabled={disabled}
                id={id}
                type="checkbox"
                onChange={handleChange}
                checked={value}
            />
            {label}
        </label>
    );
}

export { Checkbox };
