import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechRecognitionAlternativeLike {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechRecognitionAlternativeLike;
}

export interface SpeechRecognitionResultListLike {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResultLike;
}

export interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

export interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}

export interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
};

const DICTATION_MARKERS = {
  apostrophe: "\u0000v01\u0000",
  ampersand: "\u0000v02\u0000",
  atSign: "\u0000v03\u0000",
  backslash: "\u0000v04\u0000",
  blockquote: "\u0000v05\u0000",
  bullet: "\u0000v06\u0000",
  checkbox: "\u0000v07\u0000",
  codeEnd: "\u0000v08\u0000",
  codeStart: "\u0000v09\u0000",
  comma: "\u0000v10\u0000",
  colon: "\u0000v11\u0000",
  dash: "\u0000v12\u0000",
  doubleQuote: "\u0000v13\u0000",
  ellipsis: "\u0000v14\u0000",
  enDash: "\u0000v15\u0000",
  equals: "\u0000v16\u0000",
  exclamation: "\u0000v17\u0000",
  hash: "\u0000v18\u0000",
  headingOne: "\u0000v19\u0000",
  headingTwo: "\u0000v20\u0000",
  hyphen: "\u0000v21\u0000",
  line: "\u0000v22\u0000",
  nextItem: "\u0000v23\u0000",
  openBracket: "\u0000v24\u0000",
  closeBracket: "\u0000v25\u0000",
  openBrace: "\u0000v26\u0000",
  closeBrace: "\u0000v27\u0000",
  openParenthesis: "\u0000v28\u0000",
  closeParenthesis: "\u0000v29\u0000",
  openQuote: "\u0000v30\u0000",
  closeQuote: "\u0000v31\u0000",
  ordered: "\u0000v32\u0000",
  paragraph: "\u0000v33\u0000",
  percent: "\u0000v34\u0000",
  period: "\u0000v35\u0000",
  plus: "\u0000v36\u0000",
  question: "\u0000v37\u0000",
  semicolon: "\u0000v38\u0000",
  slash: "\u0000v39\u0000",
  space: "\u0000v40\u0000",
  underscore: "\u0000v41\u0000",
} as const;

const SPEECH_FILLER_PATTERN = /\b(?:um+|uh+|erm+|hmm+)\b[ \t,]*/gi;
const REPEATED_FUNCTION_WORD_PATTERN =
  /\b(a|an|and|are|be|but|can|could|for|from|have|i|if|in|is|it|of|on|or|that|the|to|was|we|with|you)([ \t]+\1\b)+/gi;

/** Returns the browser's native speech recognizer, when this runtime exposes one. */
export function getSpeechRecognitionConstructor(): SpeechRecognitionConstructorLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function cleanSpeechTranscript(transcript: string): string {
  return transcript
    .replace(SPEECH_FILLER_PATTERN, "")
    .replace(REPEATED_FUNCTION_WORD_PATTERN, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function joinTranscriptParts(parts: ReadonlyArray<string>): string {
  return cleanSpeechTranscript(
    parts
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" "),
  ).replace(/\s+([,.;:!?…])/g, "$1");
}

function replaceSpokenCommands(transcript: string): string {
  let value = cleanSpeechTranscript(transcript).replace(/\r\n?/g, "\n");
  if (!value) {
    return "";
  }

  // Match longer structural phrases first so they cannot be partially consumed
  // by a shorter punctuation command.
  value = value
    .replace(/\b(?:start|begin)\s+(?:a\s+)?code\s+block\b/gi, DICTATION_MARKERS.codeStart)
    .replace(/\b(?:end|close|finish)\s+(?:the\s+)?code\s+block\b/gi, DICTATION_MARKERS.codeEnd)
    .replace(/\b(?:checklist|task\s+list|to-do\s+list)\b/gi, DICTATION_MARKERS.checkbox)
    .replace(
      /\b(?:blockquote|quote\s+block|start\s+(?:a\s+)?quote)\b/gi,
      DICTATION_MARKERS.blockquote,
    )
    .replace(/\b(?:heading\s+(?:one|1))\b/gi, DICTATION_MARKERS.headingOne)
    .replace(/\b(?:heading\s+(?:two|2))\b/gi, DICTATION_MARKERS.headingTwo)
    .replace(/\b(?:heading)\b/gi, DICTATION_MARKERS.headingTwo)
    .replace(
      /\b(?:new\s+paragraph|paragraph\s+break|blank\s+line|new\s+section)\b/gi,
      DICTATION_MARKERS.paragraph,
    )
    .replace(/\b(?:new\s+line|line\s+break|next\s+line)\b/gi, DICTATION_MARKERS.line)
    .replace(/\b(?:numbered\s+list|number\s+list|ordered\s+list)\b/gi, DICTATION_MARKERS.ordered)
    .replace(
      /\b(?:bullet\s+points?|bullets?|make\s+(?:a\s+)?list|start\s+(?:a\s+)?list)\b/gi,
      DICTATION_MARKERS.bullet,
    )
    .replace(/\b(?:next\s+item|new\s+item|list\s+item)\b/gi, DICTATION_MARKERS.nextItem)
    .replace(/\b(?:em\s+dash|long\s+dash)\b/gi, DICTATION_MARKERS.dash)
    .replace(/\b(?:en\s+dash)\b/gi, DICTATION_MARKERS.enDash)
    .replace(/\b(?:dash)\b/gi, DICTATION_MARKERS.dash)
    .replace(/\b(?:hyphen)\b/gi, DICTATION_MARKERS.hyphen)
    .replace(/\b(?:ellipsis|dot\s+dot\s+dot)\b/gi, DICTATION_MARKERS.ellipsis)
    .replace(/\b(?:question\s+mark)\b/gi, DICTATION_MARKERS.question)
    .replace(/\b(?:exclamation\s+mark|exclamation\s+point)\b/gi, DICTATION_MARKERS.exclamation)
    .replace(/\b(?:full\s+stop|period)\b/gi, DICTATION_MARKERS.period)
    .replace(/\b(?:comma)\b/gi, DICTATION_MARKERS.comma)
    .replace(/\b(?:colon)\b/gi, DICTATION_MARKERS.colon)
    .replace(/\b(?:semicolon)\b/gi, DICTATION_MARKERS.semicolon)
    .replace(/\b(?:slash|forward\s+slash)\b/gi, DICTATION_MARKERS.slash)
    .replace(/\b(?:backslash)\b/gi, DICTATION_MARKERS.backslash)
    .replace(/\b(?:open\s+parenthesis|open\s+paren)\b/gi, DICTATION_MARKERS.openParenthesis)
    .replace(/\b(?:close\s+parenthesis|close\s+paren)\b/gi, DICTATION_MARKERS.closeParenthesis)
    .replace(/\b(?:open\s+bracket)\b/gi, DICTATION_MARKERS.openBracket)
    .replace(/\b(?:close\s+bracket)\b/gi, DICTATION_MARKERS.closeBracket)
    .replace(/\b(?:open\s+brace)\b/gi, DICTATION_MARKERS.openBrace)
    .replace(/\b(?:close\s+brace)\b/gi, DICTATION_MARKERS.closeBrace)
    .replace(/\b(?:open\s+quote)\b/gi, DICTATION_MARKERS.openQuote)
    .replace(/\b(?:close|end)\s+quote\b/gi, DICTATION_MARKERS.closeQuote)
    .replace(/\b(?:double\s+quote)\b/gi, DICTATION_MARKERS.doubleQuote)
    .replace(/\b(?:apostrophe)\b/gi, DICTATION_MARKERS.apostrophe)
    .replace(/\b(?:ampersand|and\s+sign)\b/gi, DICTATION_MARKERS.ampersand)
    .replace(/\b(?:at\s+sign)\b/gi, DICTATION_MARKERS.atSign)
    .replace(/\b(?:hash|hashtag|number\s+sign)\b/gi, DICTATION_MARKERS.hash)
    .replace(/\b(?:percent|percentage)\b/gi, DICTATION_MARKERS.percent)
    .replace(/\b(?:plus\s+sign)\b/gi, DICTATION_MARKERS.plus)
    .replace(/\b(?:equals\s+sign|equal\s+sign|equals|equal)\b/gi, DICTATION_MARKERS.equals)
    .replace(/\b(?:underscore)\b/gi, DICTATION_MARKERS.underscore)
    .replace(/\b(?:space)\b/gi, DICTATION_MARKERS.space);

  return value.replace(/\n/g, DICTATION_MARKERS.line);
}

function markerPattern(markers: ReadonlyArray<string>): RegExp {
  return new RegExp(`[ \t]*(?:${markers.join("|")})[ \t]*`, "g");
}

function capitalizeSentenceStarts(value: string): string {
  return value.replace(
    /(^|[.!?…:][ \t]+|\n(?:## |# |- |\d+\. |> |- \[ \] )|\n{2,}|^(?:## |# |- |\d+\. |> |- \[ \] )|["“‘])([a-z])/g,
    (_match, prefix: string, firstLetter: string) => `${prefix}${firstLetter.toUpperCase()}`,
  );
}

function applyInlineMarkers(value: string): string {
  return value
    .replace(markerPattern([DICTATION_MARKERS.comma]), ",")
    .replace(markerPattern([DICTATION_MARKERS.colon]), ":")
    .replace(markerPattern([DICTATION_MARKERS.exclamation]), "!")
    .replace(markerPattern([DICTATION_MARKERS.period]), ".")
    .replace(markerPattern([DICTATION_MARKERS.question]), "?")
    .replace(markerPattern([DICTATION_MARKERS.semicolon]), ";")
    .replace(markerPattern([DICTATION_MARKERS.ellipsis]), "…")
    .replace(markerPattern([DICTATION_MARKERS.dash]), " — ")
    .replace(markerPattern([DICTATION_MARKERS.enDash]), " – ")
    .replace(markerPattern([DICTATION_MARKERS.hyphen]), "-")
    .replace(markerPattern([DICTATION_MARKERS.slash]), "/")
    .replace(markerPattern([DICTATION_MARKERS.backslash]), "\\")
    .replace(markerPattern([DICTATION_MARKERS.openParenthesis]), " (")
    .replace(markerPattern([DICTATION_MARKERS.closeParenthesis]), ")")
    .replace(markerPattern([DICTATION_MARKERS.openBracket]), " [")
    .replace(markerPattern([DICTATION_MARKERS.closeBracket]), "]")
    .replace(markerPattern([DICTATION_MARKERS.openBrace]), " {")
    .replace(markerPattern([DICTATION_MARKERS.closeBrace]), "}")
    .replace(markerPattern([DICTATION_MARKERS.openQuote]), " “")
    .replace(markerPattern([DICTATION_MARKERS.closeQuote]), "”")
    .replace(markerPattern([DICTATION_MARKERS.doubleQuote]), ' "')
    .replace(markerPattern([DICTATION_MARKERS.apostrophe]), "'")
    .replace(markerPattern([DICTATION_MARKERS.ampersand]), " & ")
    .replace(markerPattern([DICTATION_MARKERS.atSign]), "@")
    .replace(markerPattern([DICTATION_MARKERS.hash]), "#")
    .replace(markerPattern([DICTATION_MARKERS.percent]), "%")
    .replace(markerPattern([DICTATION_MARKERS.plus]), " + ")
    .replace(markerPattern([DICTATION_MARKERS.equals]), " = ")
    .replace(markerPattern([DICTATION_MARKERS.underscore]), "_")
    .replace(markerPattern([DICTATION_MARKERS.space]), " ");
}

/**
 * Formats native speech output using explicit, local rules only. It never calls an AI model.
 * Interim and final recognition results can both be passed through this function safely.
 */
export function formatDictationTranscript(transcript: string): string {
  const commandText = replaceSpokenCommands(transcript);
  if (!commandText) {
    return "";
  }

  let value = commandText.replace(/[ \t]+/g, " ");
  value = value
    .replace(markerPattern([DICTATION_MARKERS.codeStart]), "\n```\n")
    .replace(markerPattern([DICTATION_MARKERS.codeEnd]), "\n```\n")
    .replace(markerPattern([DICTATION_MARKERS.headingOne]), "\n# ")
    .replace(markerPattern([DICTATION_MARKERS.headingTwo]), "\n## ")
    .replace(markerPattern([DICTATION_MARKERS.blockquote]), "\n> ")
    .replace(markerPattern([DICTATION_MARKERS.paragraph]), "\n\n")
    .replace(markerPattern([DICTATION_MARKERS.line]), "\n");

  let orderedItem = 0;
  let listMode: "bullet" | "checkbox" | "ordered" | null = null;
  value = value.replace(
    markerPattern([
      DICTATION_MARKERS.bullet,
      DICTATION_MARKERS.checkbox,
      DICTATION_MARKERS.nextItem,
      DICTATION_MARKERS.ordered,
    ]),
    (marker, offset: number, input: string) => {
      const linePrefix = input.slice(0, offset).endsWith("\n") ? "" : "\n";
      if (marker.includes(DICTATION_MARKERS.ordered)) {
        listMode = "ordered";
        orderedItem = 1;
        return `${linePrefix}1. `;
      }
      if (marker.includes(DICTATION_MARKERS.checkbox)) {
        listMode = "checkbox";
        return `${linePrefix}- [ ] `;
      }
      if (marker.includes(DICTATION_MARKERS.nextItem)) {
        if (listMode === "ordered") {
          orderedItem += 1;
          return `${linePrefix}${orderedItem}. `;
        }
        if (listMode === "checkbox") {
          return `${linePrefix}- [ ] `;
        }
      }
      listMode = "bullet";
      return `${linePrefix}- `;
    },
  );

  value = applyInlineMarkers(value)
    .replace(/[ \t]+([,.;:!?…])/g, "$1")
    .replace(/([,.;:!?…])(?=[^ \t\n])/g, "$1 ")
    .replace(/[ \t]+([—–])/g, " $1")
    .replace(/([^\s—–])([—–])/g, "$1 $2")
    .replace(/([—–])[ \t]*/g, "$1 ")
    .replace(/\\([ \t]+)/g, "\\")
    .replace(/[ \t]+\)/g, ")")
    .replace(/[ \t]+\}/g, "}")
    .replace(/[ \t]+`/g, "`")
    .replace(/[ \t]+”/g, "”")
    .replace(/(["“‘({])[ \t]+/g, "$1")
    .replace(/\[\s+([^\]\s][^\]]*?)\s+\]/g, "[$1]")
    .replace(/'[ \t]+/g, "'")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\bi\b/g, "I")
    .trim();

  return capitalizeSentenceStarts(value);
}

export interface UseVoiceDictationOptions {
  readonly language?: string;
  /** Called synchronously from the mic click. Return false to reject a new session. */
  readonly onStart?: () => boolean;
  readonly onStop?: () => void;
  readonly onTranscript: (transcript: string) => void;
  readonly onError?: (message: string) => void;
}

export interface UseVoiceDictationResult {
  readonly isSupported: boolean;
  readonly isListening: boolean;
  readonly start: () => void;
  readonly stop: () => void;
  readonly toggle: () => void;
}

function defaultDictationError(error: string): string {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Allow microphone access and try again.";
    case "audio-capture":
      return "No microphone was available. Connect a microphone and try again.";
    case "network":
      return "The browser speech service is unavailable. Check your connection and try again.";
    default:
      return "Voice dictation stopped unexpectedly. Try again.";
  }
}

export function useVoiceDictation(options: UseVoiceDictationOptions): UseVoiceDictationResult {
  const [isSupported, setIsSupported] = useState(() => getSpeechRecognitionConstructor() !== null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isListeningRef = useRef(false);
  const shouldContinueRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const transcriptRef = useRef({ committed: "", final: "", interim: "" });
  const onStartRef = useRef(options.onStart);
  const onStopRef = useRef(options.onStop);
  const onTranscriptRef = useRef(options.onTranscript);
  const onErrorRef = useRef(options.onError);

  useEffect(() => {
    onStartRef.current = options.onStart;
    onStopRef.current = options.onStop;
    onTranscriptRef.current = options.onTranscript;
    onErrorRef.current = options.onError;
  }, [options.onError, options.onStart, options.onStop, options.onTranscript]);

  useEffect(() => {
    setIsSupported(getSpeechRecognitionConstructor() !== null);
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const completeStop = useCallback(() => {
    clearRestartTimer();
    recognitionRef.current = null;
    isListeningRef.current = false;
    setIsListening(false);
    transcriptRef.current = { committed: "", final: "", interim: "" };
    onStopRef.current?.();
  }, [clearRestartTimer]);

  const startRecognitionSession = useCallback(() => {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition || !shouldContinueRef.current) {
      return;
    }

    const recognition = new Recognition();
    const currentLanguage =
      options.language ??
      (typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US");
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = currentLanguage;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const alternative = result?.[0];
        if (!alternative) continue;
        if (result.isFinal) {
          final += ` ${alternative.transcript}`;
        } else {
          interim += ` ${alternative.transcript}`;
        }
      }
      transcriptRef.current.final = final;
      transcriptRef.current.interim = interim;
      const rawTranscript = joinTranscriptParts([transcriptRef.current.committed, final, interim]);
      onTranscriptRef.current(formatDictationTranscript(rawTranscript));
    };

    // SpeechRecognition exposes this cross-browser handler property directly.
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    recognition.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      shouldContinueRef.current = false;
      const activeRecognition = recognitionRef.current;
      recognitionRef.current = null;
      try {
        activeRecognition?.abort();
      } catch {
        // The browser may already have torn down the recognition session.
      }
      completeStop();
      onErrorRef.current?.(defaultDictationError(event.error));
    };

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) {
        return;
      }

      transcriptRef.current.committed = joinTranscriptParts([
        transcriptRef.current.committed,
        transcriptRef.current.final || transcriptRef.current.interim,
      ]);
      transcriptRef.current.final = "";
      transcriptRef.current.interim = "";

      if (!shouldContinueRef.current) {
        completeStop();
        return;
      }

      // Some Chromium versions end continuous recognition after a pause. Restarting
      // immediately keeps the transcript flowing without losing already-final text.
      clearRestartTimer();
      restartTimerRef.current = window.setTimeout(() => {
        restartTimerRef.current = null;
        startRecognitionSession();
      }, 0);
    };

    try {
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      shouldContinueRef.current = false;
      completeStop();
      onErrorRef.current?.("The microphone could not be started. Try again.");
    }
  }, [clearRestartTimer, completeStop, options.language]);

  const start = useCallback(() => {
    if (isListeningRef.current) {
      return;
    }
    if (!getSpeechRecognitionConstructor()) {
      onErrorRef.current?.("Voice dictation is not supported in this browser.");
      return;
    }
    if (onStartRef.current && !onStartRef.current()) {
      return;
    }

    clearRestartTimer();
    transcriptRef.current = { committed: "", final: "", interim: "" };
    shouldContinueRef.current = true;
    startRecognitionSession();
  }, [clearRestartTimer, startRecognitionSession]);

  const stop = useCallback(() => {
    shouldContinueRef.current = false;
    clearRestartTimer();
    const recognition = recognitionRef.current;
    if (!recognition) {
      completeStop();
      return;
    }

    try {
      // stop() lets the browser deliver a final result before onend, unlike abort().
      recognition.stop();
    } catch {
      completeStop();
    }
  }, [clearRestartTimer, completeStop]);

  useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      clearRestartTimer();
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      try {
        recognition?.abort();
      } catch {
        // The component is being removed; there is nothing left to recover.
      }
    };
  }, [clearRestartTimer]);

  return {
    isSupported,
    isListening,
    start,
    stop,
    toggle: isListening ? stop : start,
  };
}
