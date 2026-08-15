import { describe, expect, it } from "vite-plus/test";

import {
  cleanDictationTranscript,
  dictationWaveformHeight,
  formatDictationDuration,
  DICTATION_WAVEFORM_SHAPE,
} from "./voiceDictation";

describe("cleanDictationTranscript", () => {
  it("removes hesitation sounds while preserving surrounding words", () => {
    expect(cleanDictationTranscript("Uh, I want to um build this. Er, keep summer humming.")).toBe(
      "I want to build this. keep summer humming.",
    );
  });

  it("handles repeated fillers and speech punctuation", () => {
    expect(cleanDictationTranscript("um... uh, can you check this?")).toBe("can you check this?");
    expect(cleanDictationTranscript("Please um... continue.")).toBe("Please continue.");
  });

  it("removes hyphenated fillers and filler-only speech", () => {
    expect(cleanDictationTranscript("mm-hmm, uh um er hmm")).toBe("");
  });
});

describe("formatDictationDuration", () => {
  it("formats elapsed time as a small minutes-and-seconds timer", () => {
    expect(formatDictationDuration(0)).toBe("0:00");
    expect(formatDictationDuration(65_250)).toBe("1:05");
  });
});

describe("dictationWaveformHeight", () => {
  it("keeps microphone bars bounded and responsive to speaking volume", () => {
    const quietHeights = DICTATION_WAVEFORM_SHAPE.map((_, index) =>
      dictationWaveformHeight(0, index),
    );
    const loudHeights = DICTATION_WAVEFORM_SHAPE.map((_, index) =>
      dictationWaveformHeight(1, index),
    );

    expect(quietHeights.every((height) => height >= 2 && height <= 20)).toBe(true);
    expect(loudHeights.every((height) => height >= 2 && height <= 20)).toBe(true);
    expect(Math.max(...loudHeights)).toBeGreaterThan(Math.max(...quietHeights));
  });
});
