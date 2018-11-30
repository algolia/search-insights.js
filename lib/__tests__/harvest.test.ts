import * as testServer from "../../server/server.js";
import AlgoliaInsights from "./../insights";
const puppeteer = require("puppeteer");
const url = require("url");

// Path helper
const examplePath = type => `http://localhost:8080/${type}.html`;

// vars
let page;
let browser;
const windowWidth = 1920;
const windowHeight = 1080;

describe("Library initialisation", () => {
  it("Should throw if there is no apiKey and applicationID", () => {
    expect(() => {
      // @ts-ignore
      AlgoliaInsights.init();
    }).toThrowError(
      "Init function should be called with an object argument containing your apiKey and applicationID"
    );
  });

  it("Should throw if there is only apiKey param", () => {
    expect(() => {
      // @ts-ignore
      AlgoliaInsights.init({ apiKey: "1234" });
    }).toThrow(
      "applicationID is missing, please provide it, so we can properly attribute data to your application"
    );
  });

  it("Should throw if there is only applicatioID param", () => {
    expect(() => {
      // @ts-ignore
      AlgoliaInsights.init({ applicationID: "1234" });
    }).toThrow(
      "apiKey is missing, please provide it so we can authenticate the application"
    );
  });

  it("Should not throw if all params are set", () => {
    expect(() => {
      AlgoliaInsights.init({
        apiKey: "1234",
        applicationID: "ABCD"
      });
    }).not.toThrow();

    // @ts-ignore private prop
    expect(AlgoliaInsights._hasCredentials).toBe(true);
  });

  it("Should create UUID", () => {
    expect(AlgoliaInsights._userID).not.toBeUndefined();
  });
});

describe("Integration tests", () => {
  let handle = null;

  const startServer = () =>
    new Promise((resolve, reject) => {
      handle = testServer.listen(8080, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

  const stopServer = () =>
    new Promise((resolve, reject) => {
      handle.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

  beforeAll(async () => {
    await startServer();

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    page = await browser.newPage();

    await page.setViewport({
      width: windowWidth,
      height: windowHeight
    });
  });

  afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  describe("instantsearch example", () => {
    let data;
    beforeAll(async () => {
      await page.goto(examplePath("instantsearch"));
      await page.waitFor(1000);
      data = await getPageResponse();
      await page.waitFor(1000);
    });

    describe("loading", () => {
      it("should retrieve a queryID on page load", async () => {
        expect(data).toHaveProperty("queryID");
      });
    });

    describe("click", () => {
      let request;
      let payload;
      let objectID;
      beforeAll(async () => {
        const event = await captureNetworkWhile(async () => {
          const button = await page.$(
            ".ais-hits--item:nth-child(2) .button-click"
          );
          await button.click();
          objectID = await page.evaluate(
            elem => elem.getAttribute("data-objectid"),
            button
          );
        });
        request = event.request;
        payload = event.payload;
      });
      it("should send a request to /1/event", () => {
        const requestUrl = url.parse(request.url());
        expect(requestUrl.pathname).toBe("/1/events");
      });
      it("should have a payload with 1 event", () => {
        expect(payload).toHaveProperty("events");
        expect(payload.events).toHaveLength(1);
      });
      it("should send the correct queryID", () => {
        const {
          events: [event]
        } = payload;
        expect(event).toHaveProperty("queryID");
        expect(event.queryID).toEqual(data.queryID);
      });
      it("should include the correct objectID and position", () => {
        const {
          events: [event]
        } = payload;
        expect(event.objectID).toEqual([objectID]);
        expect(event.position).toEqual([2]);
      });
      it("should include an timestamp", () => {
        const {
          events: [event]
        } = payload;
        expect(event).toHaveProperty("timestamp");
      });
    });
  });

  function getPageResponse() {
    return new Promise(async (resolve, reject) => {
      page.on("response", async interceptedRequest => {
        const request = interceptedRequest.request();

        if (request.url().includes(".algolia.net")) {
          const postData = JSON.parse(request.postData());

          if (
            postData.requests &&
            postData.requests[0].params.includes("query=K")
          ) {
            const data = await interceptedRequest.json();
            resolve(data.results[0]);
          }
        }
      });

      await page.type("#q", "K");
    });
  }

  async function captureNetworkWhile(callback) {
    const capture = new Promise<{ request: any; payload: any }>(
      (resolve, reject) => {
        page.on("request", interceptedRequest => {
          if (interceptedRequest.url().includes("localhost:8080")) {
            const event = {
              request: interceptedRequest,
              payload: JSON.parse(interceptedRequest.postData())
            };
            resolve(event);
          } else {
            reject(new Error("expected url to be localhost:8080"));
          }
        });
      }
    );
    await callback();
    return capture;
  }
});
