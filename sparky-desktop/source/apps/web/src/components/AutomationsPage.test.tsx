import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";

vi.mock("../state/entities", () => ({
  useThreadShells: () => [],
  useProjects: () => [],
}));

vi.mock("../hooks/useHandleNewThread", () => ({
  useNewThreadHandler: () => vi.fn(),
}));

import { AutomationsPage } from "./AutomationsPage";

describe("AutomationsPage", () => {
  it("renders the compact scheduled-task layout without sparkle imagery", () => {
    const markup = renderToStaticMarkup(<AutomationsPage />);

    expect(markup).toContain("Scheduled tasks");
    expect(markup).toContain("Search scheduled tasks");
    expect(markup).toContain("Suggestions");
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain("text-sky-600");
    expect(markup).toContain("text-violet-600");
    expect(markup).toContain("text-emerald-600");
    expect(markup).not.toContain(String.fromCodePoint(0x2728));
  });
});
