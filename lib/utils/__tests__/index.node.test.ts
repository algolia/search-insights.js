/**
 * @jest-environment node
 */

import { supportsCookies } from "../index";

describe("supportsCookies in node env", () => {
  it("returns false", () => {
    expect(supportsCookies()).toBe(false);
  });
});
