import React from "react";
import { cn } from "@/utilities/class-names";

type CheckboxProps = {
    disabled?: boolean;
    id: string;
    label: string;
    onChange: (value: boolean) => void;
    value: boolean;
};

function Checkbox(props: CheckboxProps) {
    const { disabled, id, label, onChange, value } = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <label className={cn("display-flex", "gap-sm")}>
            <input
                checked={value}
                disabled={disabled}
                id={id}
                onChange={handleChange}
                type="checkbox"
            />
            {label}
        </label>
    );
}

//
export { Checkbox };
