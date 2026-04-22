import { CoachingFeedback } from '@/types/speech';

function buildPrompt(
  whisperText: string,
  webSpeechText: string,
  targetPrompt: string,
  captionScore: number
): string {
  return `You are Rachel, a warm and expert American English speech coach specializing in accent reduction for non-native English speaking professionals.

A speaker just recorded themselves saying the following sentence. Here is what we captured:

TARGET SENTENCE: "${targetPrompt}"
ACCURATE TRANSCRIPTION (Whisper — what they actually said): "${whisperText}"
CAPTION TRANSCRIPTION (Web Speech API — what auto-captions showed): "${webSpeechText}"
CAPTION ACCURACY SCORE: ${captionScore}%

Please analyze their speech and provide coaching across these areas:
1. CONTRACTIONS: Did they use natural contractions? (I'll, won't, can't, I'd, they're, we've, etc.) Full forms sound overly formal and stiff.
2. WORD LINKING: Are words flowing together naturally? (going to → gonna, want to → wanna, consonant+vowel linking)
3. ENUNCIATION: Are key sounds clear? (American R, TH sounds, vowel reductions)
4. CAPTION ISSUES: If the caption score is below 95%, explain WHY specific words were misheard and what to work on.

Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):
{
  "overall": "A warm 1-2 sentence summary of how they did overall",
  "points": [
    {
      "area": "contractions",
      "observation": "What you noticed (be specific — quote the words)",
      "action": "Concrete action to improve, with example"
    }
  ],
  "drill": "One specific practice sentence targeting their biggest issue",
  "encouragement": "A warm, specific, personalized closing line"
}

Include 2-4 coaching points. Be specific, warm, and practical. Reference Rachel's English techniques where relevant (jaw position, tongue placement, reduced vowels, connected speech). If they did something well, say so!`;
}

function parseResponse(text: string): CoachingFeedback {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      overall: text,
      points: [],
      drill: '',
      encouragement: 'Keep practicing — every session makes you clearer!',
    };
  }
}

export async function getCoachingFeedback(
  whisperText: string,
  webSpeechText: string,
  targetPrompt: string,
  captionScore: number,
  apiKey: string
): Promise<CoachingFeedback> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildPrompt(whisperText, webSpeechText, targetPrompt, captionScore) }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return parseResponse(data.content?.[0]?.text || '');
}

export function computeCaptionScore(reference: string, hypothesis: string): number {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[.,!?;:'"]/g, '').split(/\s+/).filter(Boolean);

  const ref = clean(reference);
  const hyp = clean(hypothesis);

  if (ref.length === 0) return 100;
  if (hyp.length === 0) return 0;

  // LCS-based F1 (similar to ROUGE-L)
  const dp = Array.from({ length: ref.length + 1 }, () =>
    Array(hyp.length + 1).fill(0)
  );
  for (let i = 1; i <= ref.length; i++) {
    for (let j = 1; j <= hyp.length; j++) {
      dp[i][j] =
        ref[i - 1] === hyp[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[ref.length][hyp.length];
  return Math.round((2 * lcs) / (ref.length + hyp.length) * 100);
}
