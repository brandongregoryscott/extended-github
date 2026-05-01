import type { ObjectValues } from "@/types";
import { brand } from "@/utilities/core-utils";

const TicketNumberPositions = {
    EndsWith: brand("ends-with"),
    Includes: brand("includes"),
    StartsWith: brand("starts-with"),
} as const;

type TicketNumberPosition = ObjectValues<typeof TicketNumberPositions>;

const TicketNumberInsertPositions = {
    End: brand("end"),
    Start: brand("start"),
} as const;

type TicketNumberInsertPosition = ObjectValues<
    typeof TicketNumberInsertPositions
>;

export type { TicketNumberInsertPosition, TicketNumberPosition };
export { TicketNumberInsertPositions, TicketNumberPositions };
