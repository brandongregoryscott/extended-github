import type { ObjectValues } from "@/types";

const Users = {
    Everyone: "everyone",
    Self: "self",
} as const;

type User = ObjectValues<typeof Users>;

export type { User };
export { Users };
