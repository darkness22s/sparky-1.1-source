import { describe, expect, it } from "vite-plus/test";

import { nextAutomationOccurrence } from "./AutomationService.ts";

describe("scheduled automation timing", () => {
  const start = "2026-01-01T12:00:00.000Z";

  it("calculates the next persisted occurrence for each cadence", () => {
    expect(nextAutomationOccurrence("hourly", start, 2)).toBe("2026-01-01T14:00:00.000Z");
    expect(nextAutomationOccurrence("daily", start)).toBe("2026-01-02T12:00:00.000Z");
    expect(nextAutomationOccurrence("weekly", start)).toBe("2026-01-08T12:00:00.000Z");
    expect(nextAutomationOccurrence("once", start)).toBeNull();
  });

  it("keeps hourly schedules at a minimum one-hour interval", () => {
    expect(nextAutomationOccurrence("hourly", start, 0)).toBe("2026-01-01T13:00:00.000Z");
  });
});
