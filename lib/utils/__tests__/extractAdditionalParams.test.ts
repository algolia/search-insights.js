import { InsightsAdditionalEventParams } from "../../types";
import {
  extractAdditionalParams,
  WithAdditionalParams
} from "../extractAdditionalParams";

type TestEvent = {
  index: string;
};

describe("extractAdditionalParams", () => {
  const events: TestEvent[] = [
    { index: "index1" },
    { index: "index2" },
    { index: "index3" }
  ];
  it("returns whole list as events when there are no additional params", () => {
    const extracted = extractAdditionalParams<TestEvent>(events);

    expect(extracted.events).toEqual(events);
    expect(extracted.additionalParams).toBeUndefined();
  });

  it("separates events from additional params if detected", () => {
    const additionalParams: InsightsAdditionalEventParams = {
      headers: {
        "X-Custom-Header": "customHeader123"
      }
    };

    const params: WithAdditionalParams<TestEvent>[] = [
      ...events,
      additionalParams
    ];

    const extracted = extractAdditionalParams<TestEvent>(params);
    expect(extracted.events).toEqual(events);
    expect(extracted.additionalParams).toMatchObject(additionalParams);
  });
});
