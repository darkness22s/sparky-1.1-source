import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircleIcon, MicIcon, SquareIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  dictationWaveformHeight,
  DICTATION_WAVEFORM_SHAPE,
  cleanDictationTranscript,
  formatDictationDuration,
} from "./voiceDictation";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionResultEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  addEventListener: (type: "error", listener: (event: Event) => void) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  webkitAudioContext?: typeof AudioContext;
};

export type VoiceDictationStatus = "idle" | "recording" | "stopping";

interface VoiceDictationControlProps {
  disabled?: boolean;
  onActiveChange?: (active: boolean) => void;
  onError?: (message: string) => void;
  onStart?: () => void;
  onTranscript: (transcript: string) => void;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function recognitionErrorMessage(error: string): string {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was denied. Allow microphone access to use voice dictation.";
    case "audio-capture":
      return "No microphone was found. Connect a microphone and try again.";
    case "network":
      return "Speech recognition lost its network connection. Try dictation again.";
    default:
      return "Voice dictation could not start. Try again.";
  }
}

function VoiceWaveform({ level }: { level: number }) {
  return (
    <div
      className="flex h-5 w-[4.75rem] shrink-0 items-center justify-center gap-[3px] overflow-hidden text-destructive"
      aria-hidden="true"
    >
      {DICTATION_WAVEFORM_SHAPE.map((barShape, index) => (
        <span
          key={barShape}
          className="w-px rounded-full bg-current transition-[height,opacity] duration-100 ease-out"
          style={{
            height: `${dictationWaveformHeight(level, index)}px`,
            opacity: level > 0.02 ? 0.92 : 0.48,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceDictationControl({
  disabled = false,
  onActiveChange,
  onError,
  onStart,
  onTranscript,
}: VoiceDictationControlProps) {
  const [status, setStatus] = useState<VoiceDictationStatus>("idle");
  const [elapsedMilliseconds, setElapsedMilliseconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const statusRef = useRef<VoiceDictationStatus>("idle");
  const sessionIdRef = useRef(0);
  const shouldKeepListeningRef = useRef(false);
  const startedAtRef = useRef(0);
  const finalTranscriptRef = useRef<string[]>([]);
  const interimTranscriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const stopFallbackTimeoutRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const levelRef = useRef(0);
  const onActiveChangeRef = useRef(onActiveChange);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
    onTranscriptRef.current = onTranscript;
  }, [onActiveChange, onError, onStart, onTranscript]);

  const setActiveStatus = useCallback((nextStatus: VoiceDictationStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
    onActiveChangeRef.current?.(nextStatus !== "idle");
  }, []);

  const clearTimeouts = useCallback(() => {
    if (restartTimeoutRef.current !== null) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (stopFallbackTimeoutRef.current !== null) {
      window.clearTimeout(stopFallbackTimeoutRef.current);
      stopFallbackTimeoutRef.current = null;
    }
  }, []);

  const stopAudioMonitor = useCallback((resetLevel = true) => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    audioSourceRef.current?.disconnect();
    audioSourceRef.current = null;
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const audioContext = audioContextRef.current;
    audioContextRef.current = null;
    if (audioContext && audioContext.state !== "closed") {
      void audioContext.close().catch(() => undefined);
    }
    levelRef.current = 0;
    if (resetLevel) setLevel(0);
  }, []);

  const isCurrentSession = useCallback((sessionId: number) => {
    return sessionId === sessionIdRef.current && statusRef.current !== "idle";
  }, []);

  const finishSession = useCallback(
    (sessionId: number, failureMessage?: string) => {
      if (!isCurrentSession(sessionId)) return;
      shouldKeepListeningRef.current = false;
      clearTimeouts();
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // The browser may already have ended this recognition instance.
        }
      }
      const transcript = cleanDictationTranscript(
        [...finalTranscriptRef.current, interimTranscriptRef.current].join(" "),
      );
      stopAudioMonitor();
      setElapsedMilliseconds(0);
      setError(failureMessage ?? null);
      setActiveStatus("idle");
      if (failureMessage) {
        onErrorRef.current?.(failureMessage);
      } else if (transcript) {
        onTranscriptRef.current(transcript);
      }
    },
    [clearTimeouts, isCurrentSession, setActiveStatus, stopAudioMonitor],
  );

  const startAudioMonitor = useCallback(
    async (sessionId: number) => {
      if (!navigator.mediaDevices?.getUserMedia) return;
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        // Speech recognition owns its own microphone permission flow. If the
        // visualizer stream is unavailable, keep dictation running without bars.
        return;
      }
      if (!isCurrentSession(sessionId) || !shouldKeepListeningRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const audioWindow = window as SpeechRecognitionWindow;
      const AudioContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext;
      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      let audioContext: AudioContext;
      let analyser: AnalyserNode;
      let source: MediaStreamAudioSourceNode;
      try {
        audioContext = new AudioContextConstructor();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.78;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      } catch {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      audioContextRef.current = audioContext;
      audioSourceRef.current = source;
      analyserRef.current = analyser;
      await audioContext.resume().catch(() => undefined);

      if (!isCurrentSession(sessionId) || !shouldKeepListeningRef.current) {
        stopAudioMonitor();
        return;
      }

      const samples = new Uint8Array(analyser.fftSize);
      const sampleLevel = () => {
        if (!isCurrentSession(sessionId) || !shouldKeepListeningRef.current) return;
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) {
          const centered = (sample - 128) / 128;
          sum += centered * centered;
        }
        const rms = Math.sqrt(sum / samples.length);
        const targetLevel = Math.min(1, rms * 6.5);
        const smoothedLevel = levelRef.current + (targetLevel - levelRef.current) * 0.2;
        levelRef.current = smoothedLevel;
        setLevel(smoothedLevel);
        animationFrameRef.current = window.requestAnimationFrame(sampleLevel);
      };
      sampleLevel();
    },
    [isCurrentSession, stopAudioMonitor],
  );

  const startRecognition = useCallback(
    (sessionId: number) => {
      const RecognitionConstructor = getSpeechRecognitionConstructor();
      if (!RecognitionConstructor) {
        finishSession(
          sessionId,
          "Voice dictation is not supported in this browser. Try the latest Chrome or Edge.",
        );
        return;
      }

      const recognition = new RecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        if (!isCurrentSession(sessionId)) return;
        let nextInterimTranscript = "";
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (!result) continue;
          const transcript = result?.[0]?.transcript?.trim();
          if (!transcript) continue;
          if (result.isFinal) {
            finalTranscriptRef.current.push(transcript);
          } else {
            nextInterimTranscript += `${transcript} `;
          }
        }
        interimTranscriptRef.current = nextInterimTranscript.trim();
      };
      recognition.addEventListener("error", (event) => {
        const errorEvent = event as SpeechRecognitionErrorEventLike;
        if (!isCurrentSession(sessionId)) return;
        if (errorEvent.error === "no-speech" || errorEvent.error === "aborted") return;
        shouldKeepListeningRef.current = false;
        finishSession(sessionId, recognitionErrorMessage(errorEvent.error));
      });
      recognition.onend = () => {
        if (recognitionRef.current !== recognition || sessionId !== sessionIdRef.current) return;
        recognitionRef.current = null;
        if (!shouldKeepListeningRef.current) {
          if (statusRef.current === "stopping") finishSession(sessionId);
          return;
        }
        restartTimeoutRef.current = window.setTimeout(() => {
          restartTimeoutRef.current = null;
          if (isCurrentSession(sessionId) && shouldKeepListeningRef.current) {
            startRecognition(sessionId);
          }
        }, 120);
      };
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        recognitionRef.current = null;
        finishSession(sessionId, "Voice dictation could not start. Try again.");
      }
    },
    [finishSession, isCurrentSession],
  );

  const startDictation = useCallback(() => {
    if (disabled || statusRef.current !== "idle") return;
    onStartRef.current?.();
    setError(null);
    setElapsedMilliseconds(0);
    finalTranscriptRef.current = [];
    interimTranscriptRef.current = "";
    shouldKeepListeningRef.current = true;
    const sessionId = sessionIdRef.current + 1;
    sessionIdRef.current = sessionId;
    startedAtRef.current = Date.now();
    setActiveStatus("recording");
    void startAudioMonitor(sessionId);
    startRecognition(sessionId);
  }, [disabled, setActiveStatus, startAudioMonitor, startRecognition]);

  const stopDictation = useCallback(() => {
    if (statusRef.current !== "recording") return;
    const sessionId = sessionIdRef.current;
    shouldKeepListeningRef.current = false;
    clearTimeouts();
    setActiveStatus("stopping");
    stopFallbackTimeoutRef.current = window.setTimeout(() => {
      stopFallbackTimeoutRef.current = null;
      finishSession(sessionId);
    }, 1200);
    const recognition = recognitionRef.current;
    if (!recognition) {
      finishSession(sessionId);
      return;
    }
    try {
      recognition.stop();
    } catch {
      finishSession(sessionId);
    }
  }, [clearTimeouts, finishSession, setActiveStatus]);

  useEffect(() => {
    if (status !== "recording") return;
    const updateElapsed = () => {
      setElapsedMilliseconds(Date.now() - startedAtRef.current);
    };
    updateElapsed();
    const timer = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      sessionIdRef.current += 1;
      clearTimeouts();
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      try {
        recognition?.abort();
      } catch {
        // The recognition instance may have already ended during unmount.
      }
      stopAudioMonitor(false);
    };
  }, [clearTimeouts, stopAudioMonitor]);

  const isStopping = status === "stopping";
  const isRecording = status === "recording";
  const buttonLabel = isStopping
    ? "Finishing voice dictation"
    : isRecording
      ? "Stop voice dictation"
      : "Start voice dictation";

  if (status === "idle") {
    return (
      <button
        type="button"
        data-testid="voice-dictation-control"
        data-voice-dictation-state="idle"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-200 hover:scale-105 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-35",
          error ? "text-destructive/80 hover:text-destructive" : null,
        )}
        onPointerDown={(event) => event.preventDefault()}
        onClick={startDictation}
        disabled={disabled}
        aria-label={buttonLabel}
        title={error ?? buttonLabel}
      >
        <MicIcon className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      data-testid="voice-dictation-control"
      data-voice-dictation-state={status}
      className={cn(
        "flex h-8 w-[10.25rem] shrink-0 items-center justify-end gap-1 rounded-full border border-destructive/20 bg-destructive/6 px-1 text-destructive transition-[width,background-color,opacity] duration-300 ease-out",
        isStopping ? "opacity-80" : "",
      )}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <VoiceWaveform level={level} />
      <span
        className="min-w-[2.35rem] text-center font-mono text-[11px] tabular-nums text-destructive/80"
        role="timer"
        aria-live="off"
      >
        {formatDictationDuration(elapsedMilliseconds)}
      </span>
      <button
        type="button"
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/90 text-white shadow-xs shadow-destructive/20 transition-[background-color,transform] duration-150 hover:scale-105 hover:bg-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-65"
        onPointerDown={(event) => event.preventDefault()}
        onClick={stopDictation}
        disabled={isStopping}
        aria-label={isStopping ? "Finishing voice dictation" : "Stop voice dictation"}
        title={isStopping ? "Finishing voice dictation" : "Stop voice dictation"}
      >
        {isStopping ? (
          <LoaderCircleIcon className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <SquareIcon className="size-3 fill-current" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
