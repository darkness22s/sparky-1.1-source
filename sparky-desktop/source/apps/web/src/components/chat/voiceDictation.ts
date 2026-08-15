const DICTATION_FILLER_PATTERN =
  /(^|[\s([{])(?:uh+|um+|er+|erm+|hmm+|mm+(?:[-\s]?hmm+)?|ah+)(?=$|[\s,;:!?)}\].-])\s*[,.;:!?…-]*\s*/giu;

export const DICTATION_WAVEFORM_SHAPE = [
  0.42, 0.68, 0.86, 0.58, 0.96, 0.72, 0.5, 0.82, 0.62, 0.92, 0.54, 0.78, 0.48, 0.74, 0.9, 0.58,
] as const;

/** Remove common hesitation sounds without removing words such as "like". */
export function cleanDictationTranscript(input: string): string {
  let cleaned = input;
  let previous: string;
  do {
    previous = cleaned;
    cleaned = cleaned.replace(DICTATION_FILLER_PATTERN, "$1");
  } while (cleaned !== previous);

  return cleaned
    .replace(/^\s*[,.;!?…-]+\s*/u, "")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function formatDictationDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function dictationWaveformHeight(level: number, barIndex: number): number {
  const boundedLevel = Math.max(0, Math.min(1, Number.isFinite(level) ? level : 0));
  const shape = DICTATION_WAVEFORM_SHAPE[barIndex % DICTATION_WAVEFORM_SHAPE.length] ?? 0.5;
  return Math.max(2, Math.round(2 + boundedLevel * shape * 18));
}
