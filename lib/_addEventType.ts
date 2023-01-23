import { InsightsEvent, InsightsEventType } from "./types";

export function addEventType(
  eventType: InsightsEventType,
  params: Omit<InsightsEvent, "eventType">[]
): InsightsEvent[] {
  return params.map((event) => ({
    eventType,
    ...event
  }));
}
