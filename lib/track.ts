import type AlgoliaAnalytics from "./insights";
import type { WithAdditionalParams } from "./utils";
import { extractAdditionalParams } from "./utils";
import type {InsightsEvent} from "./types"

export function track(this: AlgoliaAnalytics, event: WithAdditionalParams<InsightsEvent>) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsEvent>([event]);

  this.sendEvents(events, additionalParams);
}