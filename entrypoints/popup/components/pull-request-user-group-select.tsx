import React from "react";
import type { UserGroup } from "@/enums";
import { UserGroups } from "@/enums";

type PullRequestUserGroupSelectProps = {
    id: string;
    onChange: (value: false | UserGroup) => void;
    value: false | UserGroup;
};

function PullRequestUserGroupSelect(props: PullRequestUserGroupSelectProps) {
    const { id, onChange, value } = props;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value =
            event.target.value === false.toString()
                ? false
                : (event.target.value as UserGroup);
        onChange(value);
    };

    return (
        <select id={id} onChange={handleChange} value={value.toString()}>
            <option value={false.toString()}>Never</option>
            <option value={UserGroups.Self}>Only on my pull requests</option>
            <option value={UserGroups.Author}>On any pull requests</option>
        </select>
    );
}

export { PullRequestUserGroupSelect };
