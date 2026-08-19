import { describe, expect, it } from "vite-plus/test";

import { formatDictationTranscript } from "./voiceDictation";

describe("formatDictationTranscript", () => {
  it("turns spoken line and bullet commands into Markdown without an AI call", () => {
    expect(
      formatDictationTranscript(
        "build the feature new line bullet point add the microphone button next item add tests",
      ),
    ).toBe("Build the feature\n- Add the microphone button\n- Add tests");
  });

  it("formats numbered lists and spoken punctuation", () => {
    expect(
      formatDictationTranscript(
        "numbered list first item next item second item period new paragraph verify it question mark",
      ),
    ).toBe("1. First item\n2. Second item.\n\nVerify it?");
  });

  it("formats dashes, brackets, quotes, and richer punctuation", () => {
    expect(
      formatDictationTranscript(
        "write open parenthesis fast close parenthesis em dash reliable comma and clear ellipsis",
      ),
    ).toBe("Write (fast) — reliable, and clear…");
    expect(
      formatDictationTranscript(
        "open quote ship it exclamation mark close quote colon version two slash stable",
      ),
    ).toBe("“Ship it!”: Version two/stable");
  });

  it("creates checklists, headings, quotes, and fenced code blocks", () => {
    expect(
      formatDictationTranscript(
        "heading one release checklist first task next item second task new paragraph start quote ship it exclamation mark start code block const x equals one end code block",
      ),
    ).toBe("# Release\n- [ ] First task\n- [ ] Second task\n\n> Ship it!\n```\nconst x = one\n```");
  });

  it("removes speech fillers and accidental repeated function words", () => {
    expect(formatDictationTranscript("um the the plan comma uh is ready period")).toBe(
      "The plan, is ready.",
    );
  });
});
