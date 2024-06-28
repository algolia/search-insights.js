import AlgoliaAnalytics from "../insights";
import { getRequesterForBrowser } from "../utils/getRequesterForBrowser";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

function setupInstance({
  requestFn = getRequesterForBrowser(),
  init = true
} = {}): AlgoliaAnalytics {
  const instance = new AlgoliaAnalytics({ requestFn });
  if (init) instance.init(credentials);
  instance.setUserToken("mock-user-id");
  return instance;
}

describe("integration tests", () => {
  let XMLHttpRequest: { open: any; send: any };

  beforeEach(() => {
    localStorage.clear();
    XMLHttpRequest = {
      open: jest.spyOn((window as any).XMLHttpRequest.prototype, "open"),
      send: jest.spyOn((window as any).XMLHttpRequest.prototype, "send")
    };
  });

  afterEach(() => {
    XMLHttpRequest.open.mockClear();
    XMLHttpRequest.send.mockClear();
  });

  describe("queryID inference", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("does a click, addToCart and purchase with queryID inference", () => {
      analyticsInstance.clickedObjectIDsAfterSearch({
        index: "index1",
        eventName: "hit clicked",
        positions: [1],
        objectIDs: ["12345"],
        queryID: "testing"
      });
      analyticsInstance.addedToCartObjectIDs(
        {
          index: "index1",
          eventName: "hit added to cart",
          objectIDs: ["12345"],
          objectData: [
            {
              price: "1.24",
              quantity: 17
            }
          ],
          currency: "GBP",
          value: 21.08
        },
        { inferQueryID: true }
      );
      analyticsInstance.purchasedObjectIDs(
        {
          index: "index1",
          eventName: "hit purchased",
          objectIDs: ["12345"],
          objectData: [
            {
              price: "1.24",
              quantity: 17
            }
          ],
          currency: "GBP",
          value: 21.08
        },
        { inferQueryID: true }
      );

      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(3);

      const addToCartPayload = JSON.parse(XMLHttpRequest.send.mock.calls[1][0]);
      expect(addToCartPayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit added to cart",
            eventType: "conversion",
            eventSubtype: "addToCart",
            objectIDs: ["12345"],
            objectIDsWithInferredQueryID: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17,
                queryID: "testing"
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });

      const purchasePayload = JSON.parse(XMLHttpRequest.send.mock.calls[2][0]);
      expect(purchasePayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit purchased",
            eventType: "conversion",
            eventSubtype: "purchase",
            objectIDs: ["12345"],
            objectIDsWithInferredQueryID: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17,
                queryID: "testing"
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });
    });

    it("does a click, addToCart and purchase without queryID inference", () => {
      analyticsInstance.clickedObjectIDsAfterSearch({
        index: "index1",
        eventName: "hit clicked",
        positions: [1],
        objectIDs: ["12345"],
        queryID: "testing"
      });
      analyticsInstance.addedToCartObjectIDs({
        index: "index1",
        eventName: "hit added to cart",
        objectIDs: ["12345"],
        objectData: [
          {
            price: "1.24",
            quantity: 17
          }
        ],
        currency: "GBP",
        value: 21.08
      });
      analyticsInstance.purchasedObjectIDs({
        index: "index1",
        eventName: "hit purchased",
        objectIDs: ["12345"],
        objectData: [
          {
            price: "1.24",
            quantity: 17
          }
        ],
        currency: "GBP",
        value: 21.08
      });

      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(3);

      const addToCartPayload = JSON.parse(XMLHttpRequest.send.mock.calls[1][0]);
      expect(addToCartPayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit added to cart",
            eventType: "conversion",
            eventSubtype: "addToCart",
            objectIDs: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });

      const purchasePayload = JSON.parse(XMLHttpRequest.send.mock.calls[2][0]);
      expect(purchasePayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit purchased",
            eventType: "conversion",
            eventSubtype: "purchase",
            objectIDs: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });
    });

    it("does a addToCart and purchase with queryID inference", () => {
      analyticsInstance.addedToCartObjectIDs({
        index: "index1",
        eventName: "hit added to cart",
        objectIDs: ["12345"],
        objectData: [
          {
            price: "1.24",
            quantity: 17,
            queryID: "testing"
          }
        ],
        currency: "GBP",
        value: 21.08
      });
      analyticsInstance.purchasedObjectIDs(
        {
          index: "index1",
          eventName: "hit purchased",
          objectIDs: ["12345"],
          objectData: [
            {
              price: "1.24",
              quantity: 17
            }
          ],
          currency: "GBP",
          value: 21.08
        },
        { inferQueryID: true }
      );

      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(2);

      const addToCartPayload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(addToCartPayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit added to cart",
            eventType: "conversion",
            eventSubtype: "addToCart",
            objectIDs: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17,
                queryID: "testing"
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });

      const purchasePayload = JSON.parse(XMLHttpRequest.send.mock.calls[1][0]);
      expect(purchasePayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit purchased",
            eventType: "conversion",
            eventSubtype: "purchase",
            objectIDs: ["12345"],
            objectIDsWithInferredQueryID: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17,
                queryID: "testing"
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });
    });

    it("does a addToCart and purchase without queryID inference", () => {
      analyticsInstance.addedToCartObjectIDs({
        index: "index1",
        eventName: "hit added to cart",
        objectIDs: ["12345"],
        objectData: [
          {
            price: "1.24",
            quantity: 17,
            queryID: "testing"
          }
        ],
        currency: "GBP",
        value: 21.08
      });
      analyticsInstance.purchasedObjectIDs({
        index: "index1",
        eventName: "hit purchased",
        objectIDs: ["12345"],
        objectData: [
          {
            price: "1.24",
            quantity: 17
          }
        ],
        currency: "GBP",
        value: 21.08
      });

      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(2);

      const addToCartPayload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(addToCartPayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit added to cart",
            eventType: "conversion",
            eventSubtype: "addToCart",
            objectIDs: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17,
                queryID: "testing"
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });

      const purchasePayload = JSON.parse(XMLHttpRequest.send.mock.calls[1][0]);
      expect(purchasePayload).toEqual({
        events: [
          {
            index: "index1",
            eventName: "hit purchased",
            eventType: "conversion",
            eventSubtype: "purchase",
            objectIDs: ["12345"],
            objectData: [
              {
                price: "1.24",
                quantity: 17
              }
            ],
            currency: "GBP",
            userToken: "mock-user-id",
            value: 21.08
          }
        ]
      });
    });
  });
});
