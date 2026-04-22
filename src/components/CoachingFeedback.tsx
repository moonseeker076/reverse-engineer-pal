import { MessageCircle, ArrowRight, Mic2, Star } from 'lucide-react';
import { CoachingFeedback as Feedback, CoachingPoint } from '@/types/speech';

const AREA_LABELS: Record<CoachingPoint['area'], string> = {
  contractions: 'Contractions',
  linking: 'Word Linking',
  enunciation: 'Enunciation',
  captions: 'Caption Clarity',
  general: 'General',
};

const AREA_COLORS: Record<CoachingPoint['area'], string> = {
  contractions: 'bg-violet-100 text-violet-700',
  linking: 'bg-blue-100 text-blue-700',
  enunciation: 'bg-amber-100 text-amber-700',
  captions: 'bg-rose-100 text-rose-600',
  general: 'bg-gray-100 text-gray-600',
};

interface Props {
  feedback: Feedback;
}

export function CoachingFeedback({ feedback }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-violet-200 font-medium uppercase tracking-wide">Coach Feedback</p>
          <p className="text-white font-semibold text-sm">Rachel's Analysis</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Overall summary */}
        {feedback.overall && (
          <p className="text-sm text-gray-700 leading-relaxed">{feedback.overall}</p>
        )}

        {/* Coaching points */}
        {feedback.points.length > 0 && (
          <div className="space-y-3">
            {feedback.points.map((point, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${AREA_COLORS[point.area]}`}
                  >
                    {AREA_LABELS[point.area]}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{point.observation}</p>
                <div className="flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <ArrowRight className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">{point.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drill sentence */}
        {feedback.drill && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Mic2 className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Practice Drill
              </span>
            </div>
            <p className="text-sm text-indigo-800 font-medium leading-relaxed">"{feedback.drill}"</p>
          </div>
        )}

        {/* Encouragement */}
        {feedback.encouragement && (
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 italic leading-relaxed">{feedback.encouragement}</p>
          </div>
        )}
      </div>
    </div>
  );
}
