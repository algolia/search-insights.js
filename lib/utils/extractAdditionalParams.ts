import { InsightsAdditionalEventParams } from "../types";

export type WithAdditionalParams<TEventType> =
  | TEventType
  | InsightsAdditionalEventParams;

export function extractAdditionalParams<TEventType extends { index: string }>(
  params: (TEventType | InsightsAdditionalEventParams)[]
) {
  return params.reduce(
    ({ events, additionalParams }, param) => {
      if ("index" in param) {
        return { additionalParams, events: [...events, param] };
      }

      return { events, additionalParams: param };
    },
    {
      events: [] as TEventType[],
      additionalParams: undefined as InsightsAdditionalEventParams | undefined
    }
  );
}
