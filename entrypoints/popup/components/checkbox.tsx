import { cn } from "@/utilities/class-names";
import React from "react";

type CheckboxProps = {
    id: string;
    onChange: (value: boolean) => void;
    value: boolean;
    label: string;
};

function Checkbox(props: CheckboxProps) {
    const { label, id, onChange, value } = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <label className={cn("display-flex", "gap-sm")}>
            <input
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
