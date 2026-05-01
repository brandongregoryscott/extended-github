import React from "react";
import type { TicketNumberInsertPosition } from "@/enums";
import { TicketNumberInsertPositions } from "@/enums";

type TicketNumberInsertPositionSelectProps = {
    disabled?: boolean;
    id: string;
    onChange: (value: TicketNumberInsertPosition) => void;
    value: TicketNumberInsertPosition;
};

function TicketNumberInsertPositionSelect(
    props: TicketNumberInsertPositionSelectProps
) {
    const { disabled, id, onChange, value } = props;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as TicketNumberInsertPosition);
    };

    return (
        <select
            disabled={disabled}
            id={id}
            onChange={handleChange}
            value={value}>
            <option value={TicketNumberInsertPositions.Start}>
                At the start of the title
            </option>
            <option value={TicketNumberInsertPositions.End}>
                At the end of the title
            </option>
        </select>
    );
}

export { TicketNumberInsertPositionSelect };
