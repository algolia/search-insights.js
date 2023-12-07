import type AlgoliaAnalytics from "./insights";
import type { InsightsEvent } from "./types";
import type { WithAdditionalParams } from "./utils";
import { extractAdditionalParams } from "./utils";

export function track(
  this: AlgoliaAnalytics,
  event: WithAdditionalParams<InsightsEvent>
): ReturnType<AlgoliaAnalytics["sendEvents"]> {
  const { events, additionalParams } = extractAdditionalParams<InsightsEvent>([
    event
  ]);

  return this.sendEvents(events, additionalParams);
}
