import { useState, useCallback } from 'react';
import { Settings, TrendingUp, RotateCcw, Sparkles } from 'lucide-react';
import { ApiKeys, CoachingFeedback, PracticePrompt, SessionRecord } from '@/types/speech';
import { PRACTICE_PROMPTS } from '@/data/prompts';
import { transcribeWithWhisper } from '@/services/whisper';
import { getCoachingFeedback, computeCaptionScore } from '@/services/claude';
import { useRecorder } from '@/hooks/useRecorder';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { PracticePrompts } from '@/components/PracticePrompts';
import { Recorder } from '@/components/Recorder';
import { TranscriptionPanel } from '@/components/TranscriptionPanel';
import { CoachingFeedback as CoachingFeedbackPanel } from '@/components/CoachingFeedback';
import { ScoreRing } from '@/components/ScoreRing';
import { toast } from 'sonner';

type Phase = 'ready' | 'recording' | 'processing' | 'results';

function loadApiKeys(): ApiKeys {
  return {
    openai: localStorage.getItem('cs_openai_key') || '',
    anthropic: localStorage.getItem('cs_anthropic_key') || '',
  };
}

function loadSessions(): SessionRecord[] {
  try {
    return JSON.parse(localStorage.getItem('cs_sessions') || '[]');
  } catch {
    return [];
  }
}

export default function Index() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(loadApiKeys);
  const [phase, setPhase] = useState<Phase>('ready');
  const [selectedPrompt, setSelectedPrompt] = useState<PracticePrompt>(PRACTICE_PROMPTS[0]);
  const [results, setResults] = useState<{
    whisperText: string;
    webSpeechText: string;
    captionScore: number;
    feedback: CoachingFeedback;
  } | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>(loadSessions);
  const [showSettings, setShowSettings] = useState(false);

  const recorder = useRecorder();
  const webSpeech = useWebSpeech();

  const hasKeys = apiKeys.openai && apiKeys.anthropic;

  const handleStart = useCallback(async () => {
    try {
      setPhase('recording');
      setResults(null);
      await recorder.startRecording();
      webSpeech.startListening();
    } catch {
      toast.error('Microphone access denied. Please allow microphone access and try again.');
      setPhase('ready');
    }
  }, [recorder, webSpeech]);

  const handleStop = useCallback(async () => {
    const webSpeechText = webSpeech.stopListening();
    const audioBlob = await recorder.stopRecording();
    setPhase('processing');

    try {
      const whisperText = await transcribeWithWhisper(audioBlob, apiKeys.openai);
      const captionScore = computeCaptionScore(whisperText, webSpeechText);
      const feedback = await getCoachingFeedback(
        whisperText,
        webSpeechText,
        selectedPrompt.text,
        captionScore,
        apiKeys.anthropic
      );

      setResults({ whisperText, webSpeechText, captionScore, feedback });
      setPhase('results');

      const record: SessionRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        prompt: selectedPrompt.text,
        captionScore,
        whisperText,
        webSpeechText,
      };
      setSessions((prev) => {
        const updated = [record, ...prev].slice(0, 10);
        localStorage.setItem('cs_sessions', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong. Check your API keys and try again.'
      );
      setPhase('ready');
    }
  }, [apiKeys, recorder, selectedPrompt, webSpeech]);

  const handleReset = () => {
    setPhase('ready');
    setResults(null);
  };

  const avgScore =
    sessions.length > 0
      ? Math.round(
          sessions.slice(0, 5).reduce((a, s) => a + s.captionScore, 0) / Math.min(sessions.length, 5)
        )
      : null;

  if (!hasKeys) {
    return <ApiKeySetup onSave={setApiKeys} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">ClearSpeak</h1>
              <p className="text-violet-200 text-xs">American English Speech Coach</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {avgScore !== null && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-medium">Avg {avgScore}%</span>
              </div>
            )}
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Settings panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">API Keys</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">OpenAI (Whisper)</label>
                <input
                  type="password"
                  defaultValue={apiKeys.openai}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val) {
                      localStorage.setItem('cs_openai_key', val);
                      setApiKeys((k) => ({ ...k, openai: val }));
                    }
                  }}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Anthropic (Claude)</label>
                <input
                  type="password"
                  defaultValue={apiKeys.anthropic}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val) {
                      localStorage.setItem('cs_anthropic_key', val);
                      setApiKeys((k) => ({ ...k, anthropic: val }));
                    }
                  }}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="sk-ant-..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-6">
            <PracticePrompts
              selected={selectedPrompt}
              onSelect={setSelectedPrompt}
              disabled={phase === 'recording' || phase === 'processing'}
            />

            {/* Selected prompt hero */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
              <p className="text-violet-200 text-xs font-medium mb-2 uppercase tracking-wide">Say this out loud</p>
              <p className="text-white text-lg font-semibold leading-relaxed">"{selectedPrompt.text}"</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-violet-200 text-xs">{selectedPrompt.focus}</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Recorder
              isRecording={phase === 'recording'}
              isProcessing={phase === 'processing'}
              duration={recorder.duration}
              waveformData={recorder.waveformData}
              liveTranscript={webSpeech.liveTranscript}
              onStart={handleStart}
              onStop={handleStop}
            />

            {/* Session history */}
            {sessions.length > 0 && phase === 'ready' && !results && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Sessions</h3>
                <div className="space-y-2">
                  {sessions.slice(0, 4).map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3">
                      <p className="text-xs text-gray-500 truncate flex-1">
                        "{s.prompt.slice(0, 42)}…"
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          s.captionScore >= 90
                            ? 'bg-emerald-100 text-emerald-600'
                            : s.captionScore >= 70
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {s.captionScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results && phase === 'results' && (
          <div className="space-y-6">
            {/* Score card */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6 gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Session Complete!</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Caption accuracy shows how well auto-captions understood your speech.
                  Professional goal: <span className="font-semibold text-violet-600">95%+</span>
                </p>
              </div>
              <ScoreRing score={results.captionScore} />
            </div>

            <TranscriptionPanel
              whisperText={results.whisperText}
              webSpeechText={results.webSpeechText}
            />

            <CoachingFeedbackPanel feedback={results.feedback} />

            <div className="flex justify-center pb-8">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-violet-200 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
