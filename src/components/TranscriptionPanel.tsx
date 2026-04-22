import { CheckCircle2, Captions } from 'lucide-react';

interface Props {
  whisperText: string;
  webSpeechText: string;
}

function highlightDiff(reference: string, hypothesis: string): JSX.Element[] {
  const refWords = reference.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
  const hypWords = hypothesis.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);

  return hypWords.map((word, i) => {
    const isMatch = refWords[i] === word;
    return (
      <span
        key={i}
        className={`${
          isMatch ? 'text-gray-800' : 'text-rose-500 bg-rose-50 rounded px-0.5'
        }`}
      >
        {hypothesis.split(/\s+/)[i]}{' '}
      </span>
    );
  });
}

export function TranscriptionPanel({ whisperText, webSpeechText }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Whisper — accurate */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
            What you said
          </span>
          <span className="ml-auto text-xs text-gray-400">Whisper</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">
          {whisperText || <span className="text-gray-300 italic">No transcription</span>}
        </p>
      </div>

      {/* Web Speech — captions */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <Captions className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">
            What captions heard
          </span>
          <span className="ml-auto text-xs text-gray-400">Web Speech</span>
        </div>
        <p className="text-sm leading-relaxed">
          {webSpeechText ? (
            highlightDiff(whisperText, webSpeechText)
          ) : (
            <span className="text-gray-300 italic">No caption data</span>
          )}
        </p>
        {!webSpeechText && (
          <p className="text-xs text-gray-400 mt-2">
            Web Speech API may not be supported in this browser. Try Chrome for caption testing.
          </p>
        )}
      </div>
    </div>
  );
}
