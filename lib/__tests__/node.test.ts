import insightsClient from "../node";

describe("node", () => {
  it("correctly return userToken", done => {
    insightsClient("init", { appId: "xxx", apiKey: "***" });
    insightsClient("setUserToken", "abc");
    expect(insightsClient("getUserToken")).toEqual("abc");

    insightsClient("setUserToken", "def");
    insightsClient("getUserToken", null, (err, token) => {
      expect(token).toEqual("def");
      done();
    });
  });
});
