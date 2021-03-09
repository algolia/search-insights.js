import * as testServer from "../../server/server.js";
import AlgoliaAnalytics from "../insights";
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
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("Should throw if there is no apiKey and appId", () => {
    expect(() => {
      // @ts-ignore
      analyticsInstance.init();
    }).toThrowError(
      "Init function should be called with an object argument containing your apiKey and appId"
    );
  });

  it("Should throw if there is only apiKey param", () => {
    expect(() => {
      // @ts-ignore
      analyticsInstance.init({ apiKey: "1234" });
    }).toThrow(
      "appId is missing, please provide it, so we can properly attribute data to your application"
    );
  });

  it("Should throw if there is only applicatioID param", () => {
    expect(() => {
      // @ts-ignore
      analyticsInstance.init({ appId: "1234" });
    }).toThrow(
      "apiKey is missing, please provide it so we can authenticate the application"
    );
  });

  it("Should not throw if all params are set", () => {
    expect(() => {
      analyticsInstance.init({
        apiKey: "1234",
        appId: "ABCD"
      });
    }).not.toThrow();

    // @ts-ignore private prop
    expect(analyticsInstance._hasCredentials).toBe(true);
  });

  it("Should create UUID", () => {
    analyticsInstance.init({
      apiKey: "1234",
      appId: "ABCD"
    });
    expect(analyticsInstance._userToken).not.toBeUndefined();
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

      it("should generate an anonymous userToken on init and store it in a cookie", async () => {
        const userToken = await page.evaluate(
          () =>
            new Promise((resolve, reject) =>
              window.aa("getUserToken", null, (err, res) => {
                if (err) return reject(err);
                resolve(res);
              })
            )
        );

        const cookies = await page.cookies();
        const algoliaCookie = cookies.find(
          cookie => cookie.name === "_ALGOLIA"
        );

        expect(userToken).toMatch(/^anonymous-[-\w]+$/);
        expect(algoliaCookie.value).toMatch(userToken);
      });

      it("should replace the userToken when setUserToken is called", async () => {
        const userToken = await page.evaluate(
          () =>
            new Promise((resolve, reject) => {
              window.aa("setUserToken", "user-id-1");
              window.aa("getUserToken", null, (err, res) => {
                if (err) return reject(err);
                resolve(res);
              });
            })
        );
        expect(userToken).toEqual("user-id-1");
      });

      it("should get _hasCredentials from the instance", async () => {
        const hasCredentials = await page.evaluate(
          () =>
            new Promise((resolve, reject) => {
              window.aa("_get", "_hasCredentials", hasCredentials => {
                resolve(hasCredentials);
              });
            })
        );
        expect(hasCredentials).toBe(true);
      });
    });

    describe("click", () => {
      let request;
      let payload;
      let objectIDs;
      beforeAll(async () => {
        await page.evaluate(() => {
          window.AlgoliaAnalytics.default._endpointOrigin =
            "http://localhost:8080";
        });
        const event = await captureNetworkWhile(async () => {
          const button = await page.$(
            ".ais-hits--item:nth-child(2) .button-click"
          );
          await button.click();
          objectIDs = await page.evaluate(
            elem => elem.getAttribute("data-object-id"),
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
      it("should include the correct objectIDs and positions", () => {
        const {
          events: [event]
        } = payload;
        expect(event.objectIDs).toEqual([objectIDs]);
        expect(event.positions).toEqual([2]);
      });
      it("should not include an timestamp as it was not passed", () => {
        const {
          events: [event]
        } = payload;
        expect(event).not.toHaveProperty("timestamp");
      });
    });
  });

  function getPageResponse() {
    return new Promise(async (resolve, reject) => {
      page.on("response", async interceptedRequest => {
        const request = interceptedRequest.request();

        const url = request.url();
        if (url.includes(".algolia.net") || url.includes(".algolianet.com")) {
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
