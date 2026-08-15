import { describe, expect, it } from "vite-plus/test";

import { makeSparkyPairingUrl } from "./machinesPairing";

describe("makeSparkyPairingUrl", () => {
  it("creates a direct Sparky invite with a hash credential", () => {
    const url = new URL(makeSparkyPairingUrl("192.168.1.20:5733", "one-time-token"));

    expect(url.origin).toBe("http://192.168.1.20:5733");
    expect(url.pathname).toBe("/");
    expect(url.hash).toBe("#token=one-time-token");
  });

  it("rejects non-http addresses", () => {
    expect(() => makeSparkyPairingUrl("ssh://sparky.example", "token")).toThrow(
      "http:// or https://",
    );
  });
});
