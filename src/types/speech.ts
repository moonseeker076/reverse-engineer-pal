export interface PracticePrompt {
  id: string;
  category: 'contractions' | 'linking' | 'professional' | 'sounds';
  text: string;
  focus: string;
  tip?: string;
}

export interface CoachingPoint {
  area: 'contractions' | 'linking' | 'enunciation' | 'captions' | 'general';
  observation: string;
  action: string;
}

export interface CoachingFeedback {
  overall: string;
  points: CoachingPoint[];
  drill: string;
  encouragement: string;
}

export interface SessionRecord {
  id: string;
  timestamp: string;
  prompt: string;
  captionScore: number;
  whisperText: string;
  webSpeechText: string;
}

export interface ApiKeys {
  openai: string;
  anthropic: string;
}
