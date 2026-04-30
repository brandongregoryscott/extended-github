import React from "react";
import type { TicketNumberPosition } from "@/enums";
import { TicketNumberPositions } from "@/enums";

type TicketNumberPositionSelectProps = {
    disabled?: boolean;
    id: string;
    onChange: (value: TicketNumberPosition) => void;
    value: TicketNumberPosition;
};

function TicketNumberPositionSelect(props: TicketNumberPositionSelectProps) {
    const { disabled, id, onChange, value } = props;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as TicketNumberPosition);
    };

    return (
        <select
            disabled={disabled}
            id={id}
            onChange={handleChange}
            value={value}>
            <option value={TicketNumberPositions.StartsWith}>
                Title starts with ticket number
            </option>
            <option value={TicketNumberPositions.Includes}>
                Title includes ticket number
            </option>
            <option value={TicketNumberPositions.EndsWith}>
                Title ends with ticket number
            </option>
        </select>
    );
}

export { TicketNumberPositionSelect };
