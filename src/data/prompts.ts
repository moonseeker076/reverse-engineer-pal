import { PracticePrompt } from '@/types/speech';

export const PRACTICE_PROMPTS: PracticePrompt[] = [
  // Contractions
  {
    id: 'c1',
    category: 'contractions',
    text: "I will get back to you by the end of the day.",
    focus: "Turn 'I will' → 'I'll' — slide the words together",
    tip: "Drop your jaw slightly and let the 'w' in 'will' disappear.",
  },
  {
    id: 'c2',
    category: 'contractions',
    text: "We do not have enough data to make a decision yet.",
    focus: "Turn 'do not' → 'don't' — let the T be a soft stop",
    tip: "The T in 'don't' is a glottal stop — just briefly close your throat.",
  },
  {
    id: 'c3',
    category: 'contractions',
    text: "I would like to schedule a meeting for next week.",
    focus: "Turn 'I would' → 'I'd' — one quick, light sound",
    tip: "Think of 'I'd' as almost one syllable — 'aide'.",
  },
  {
    id: 'c4',
    category: 'contractions',
    text: "They are ready to move forward with the project.",
    focus: "Turn 'They are' → 'They're' — no pause between",
    tip: "Reduce the 'are' to almost nothing — just 'er'.",
  },
  {
    id: 'c5',
    category: 'contractions',
    text: "We have been working on this for several weeks.",
    focus: "Turn 'We have' → 'We've' — the V is soft and brief",
    tip: "The 've' is barely a sound — 'weev been'.",
  },

  // Word Linking
  {
    id: 'l1',
    category: 'linking',
    text: "Let me know if you want to meet later today.",
    focus: "Link 'want to' → 'wanna', 'let me' → 'lemme'",
    tip: "In natural speech, unstressed words lose their shape.",
  },
  {
    id: 'l2',
    category: 'linking',
    text: "I need to go over the report with you this afternoon.",
    focus: "Link 'need to' → 'needa', 'go over' → vowel link",
    tip: "When a word ends in a consonant and the next starts with a vowel, link them: 'go-wover'.",
  },
  {
    id: 'l3',
    category: 'linking',
    text: "Are you going to be there for the team call?",
    focus: "Link 'going to' → 'gonna' — very common in professional speech",
    tip: "'Gonna' is not informal — it's just natural connected speech.",
  },
  {
    id: 'l4',
    category: 'linking',
    text: "Can you take a look at this document for me?",
    focus: "Link 'take a' → smooth vowel, 'at this' → soft T",
    tip: "The T in 'at' before a vowel becomes a soft D sound: 'a-dis'.",
  },
  {
    id: 'l5',
    category: 'linking',
    text: "I have to finish this before the end of the week.",
    focus: "Link 'have to' → 'hafta', 'end of' → 'end-uv'",
    tip: "'Of' is almost always reduced to 'uv' in natural speech.",
  },

  // Professional Scenarios
  {
    id: 'p1',
    category: 'professional',
    text: "I'd like to get your thoughts on this proposal.",
    focus: "Contraction 'I'd' + professional phrasing",
    tip: "Stress 'thoughts' and 'proposal' — let the other words reduce.",
  },
  {
    id: 'p2',
    category: 'professional',
    text: "Let's schedule a time to discuss the quarterly results.",
    focus: "'Let's' contraction + word stress on key nouns",
    tip: "In American English, 'quarterly' stress is on the first syllable: QUAR-ter-ly.",
  },
  {
    id: 'p3',
    category: 'professional',
    text: "I'll follow up with you right after the meeting.",
    focus: "'I'll' flows smoothly + linking in 'follow up'",
    tip: "'Follow up' — the 'w' and 'u' link together: 'follow-wup'.",
  },
  {
    id: 'p4',
    category: 'professional',
    text: "We're really looking forward to working with your team.",
    focus: "'We're' + reduced 'to' in 'looking forward to'",
    tip: "Stress 'forward' and 'team' — 'to' becomes a quick 'tuh'.",
  },
  {
    id: 'p5',
    category: 'professional',
    text: "Could you please send me the updated version by Friday?",
    focus: "Polite professional request — smooth and natural",
    tip: "'Could you' often sounds like 'cudja' in natural speech.",
  },

  // Specific Sounds
  {
    id: 's1',
    category: 'sounds',
    text: "The quarterly report shows remarkable growth this year.",
    focus: "American R: quarterly, report, remarkable — R is never silent",
    tip: "For American R: curl the tip of your tongue back without touching anything.",
  },
  {
    id: 's2',
    category: 'sounds',
    text: "Thank you for thinking about this so thoroughly.",
    focus: "TH sound: thank, thinking, thoroughly — voiced vs. voiceless",
    tip: "Put your tongue between your teeth and blow air out — 'th'.",
  },
  {
    id: 's3',
    category: 'sounds',
    text: "I appreciate your patience and your understanding.",
    focus: "Stress patterns: ap-pre-CI-ate, pa-TIENCE, un-der-STAND-ing",
    tip: "Punch the stressed syllable and reduce the others to near-schwa.",
  },
  {
    id: 's4',
    category: 'sounds',
    text: "The deadline for the project is this coming Thursday.",
    focus: "TH in 'this' and 'Thursday' — voiced vs. voiceless TH",
    tip: "'This' = voiced TH (vibrate throat); 'Thursday' = voiceless TH (just air).",
  },
];

export const CATEGORY_LABELS: Record<PracticePrompt['category'], string> = {
  contractions: 'Contractions',
  linking: 'Word Linking',
  professional: 'Professional',
  sounds: 'Sounds & Stress',
};

export const CATEGORY_COLORS: Record<PracticePrompt['category'], string> = {
  contractions: 'bg-violet-100 text-violet-700 border-violet-200',
  linking: 'bg-blue-100 text-blue-700 border-blue-200',
  professional: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  sounds: 'bg-amber-100 text-amber-700 border-amber-200',
};
