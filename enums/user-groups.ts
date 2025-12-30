import type { ObjectValues } from "@/types";
import { brand } from "@/utilities/core-utils";

const UserGroups = {
    Author: brand("author"),
    Self: brand("self"),
} as const;

type UserGroup = ObjectValues<typeof UserGroups>;

export type { UserGroup };
export { UserGroups };
