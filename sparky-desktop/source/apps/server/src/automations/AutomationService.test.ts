import { describe, expect, it } from "vite-plus/test";

import { nextAutomationOccurrence } from "./AutomationService.ts";

describe("nextAutomationOccurrence", () => {
  const monday = "2026-01-05T09:00:00.000Z";

  it("does not reschedule one-time tasks", () => {
    expect(nextAutomationOccurrence("once", monday)).toBeNull();
  });

  it("advances daily and weekly tasks by their recurrence period", () => {
    expect(nextAutomationOccurrence("daily", monday)).toBe("2026-01-06T09:00:00.000Z");
    expect(nextAutomationOccurrence("weekly", monday)).toBe("2026-01-12T09:00:00.000Z");
  });

  it("skips weekends for weekday tasks", () => {
    expect(nextAutomationOccurrence("weekdays", "2026-01-09T09:00:00.000Z")).toBe(
      "2026-01-12T09:00:00.000Z",
    );
  });
});
