import { Mic, Square, Loader2 } from 'lucide-react';

interface Props {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  waveformData: number[];
  liveTranscript: string;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Recorder({
  isRecording,
  isProcessing,
  duration,
  waveformData,
  liveTranscript,
  onStart,
  onStop,
  disabled,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Waveform */}
      <div className="flex items-center justify-center gap-0.5 h-16 mb-6">
        {waveformData.map((val, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-75 ${
              isRecording ? 'bg-gradient-to-t from-violet-600 to-rose-400' : 'bg-gray-200'
            }`}
            style={{
              height: isRecording ? `${Math.max(4, val * 56 + 4)}px` : '4px',
            }}
          />
        ))}
      </div>

      {/* Record button */}
      <div className="flex flex-col items-center gap-4">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">Analyzing your speech…</p>
          </div>
        ) : isRecording ? (
          <>
            <button
              onClick={onStop}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center group"
            >
              <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
              <Square className="w-7 h-7 text-white fill-white" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-sm font-mono font-medium text-gray-700">{formatDuration(duration)}</span>
            </div>
          </>
        ) : (
          <button
            onClick={onStart}
            disabled={disabled}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
        )}

        {!isRecording && !isProcessing && (
          <p className="text-sm text-gray-400">
            {disabled ? 'Select a sentence above first' : 'Tap to record'}
          </p>
        )}
      </div>

      {/* Live Web Speech transcript */}
      {isRecording && (
        <div className="mt-5 min-h-[3rem] bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Live captions:</p>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {liveTranscript || <span className="text-gray-300">Listening…</span>}
          </p>
        </div>
      )}
    </div>
  );
}
