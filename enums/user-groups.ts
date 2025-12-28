import type { ObjectValues } from "@/types";

const UserGroups = {
    Everyone: "everyone",
    Self: "self",
} as const;

type UserGroup = ObjectValues<typeof UserGroups>;

export type { UserGroup };
export { UserGroups };
