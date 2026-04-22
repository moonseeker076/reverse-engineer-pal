import { useState } from 'react';
import { Key, Eye, EyeOff, Sparkles } from 'lucide-react';
import { ApiKeys } from '@/types/speech';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSave: (keys: ApiKeys) => void;
}

export function ApiKeySetup({ onSave }: Props) {
  const [openai, setOpenai] = useState('');
  const [anthropic, setAnthropic] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);

  const handleSave = () => {
    if (!openai.trim() || !anthropic.trim()) return;
    localStorage.setItem('cs_openai_key', openai.trim());
    localStorage.setItem('cs_anthropic_key', anthropic.trim());
    onSave({ openai: openai.trim(), anthropic: anthropic.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-rose-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ClearSpeak</h1>
          <p className="text-gray-500 mt-2">Your personal American English speech coach</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-800">Connect Your API Keys</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your keys are stored only in your browser and never sent to any third party.
            They're used to transcribe your voice (OpenAI) and generate coaching (Claude).
          </p>

          <div className="space-y-5">
            <div>
              <Label htmlFor="openai" className="text-sm font-medium text-gray-700 mb-1.5 block">
                OpenAI API Key <span className="text-gray-400 font-normal">(for Whisper transcription)</span>
              </Label>
              <div className="relative">
                <Input
                  id="openai"
                  type={showOpenai ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={openai}
                  onChange={(e) => setOpenai(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenai((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="anthropic" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Anthropic API Key <span className="text-gray-400 font-normal">(for AI coaching feedback)</span>
              </Label>
              <div className="relative">
                <Input
                  id="anthropic"
                  type={showAnthropic ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={anthropic}
                  onChange={(e) => setAnthropic(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropic((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!openai.trim() || !anthropic.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-xl shadow-sm transition-all"
            >
              Start Practicing
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Get your keys at platform.openai.com and console.anthropic.com
        </p>
      </div>
    </div>
  );
}
