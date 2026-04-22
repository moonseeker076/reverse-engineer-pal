interface Props {
  score: number;
  size?: number;
}

function scoreColor(score: number): { stroke: string; label: string; bg: string } {
  if (score >= 90) return { stroke: '#10b981', label: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (score >= 75) return { stroke: '#3b82f6', label: 'text-blue-600', bg: 'bg-blue-50' };
  if (score >= 55) return { stroke: '#f59e0b', label: 'text-amber-600', bg: 'bg-amber-50' };
  return { stroke: '#ef4444', label: 'text-red-500', bg: 'bg-red-50' };
}

function scoreMessage(score: number): string {
  if (score >= 90) return 'Caption-Ready!';
  if (score >= 75) return 'Almost There!';
  if (score >= 55) return 'Keep Going!';
  return 'Needs Practice';
}

export function ScoreRing({ score, size = 140 }: Props) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, label, bg } = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`rounded-2xl p-4 ${bg}`}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div
          className="flex flex-col items-center justify-center"
          style={{ marginTop: -(size + 16), height: size }}
        >
          <span className={`text-3xl font-bold ${label}`}>{score}%</span>
          <span className="text-xs text-gray-500 mt-0.5">Caption Score</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${label}`}>{scoreMessage(score)}</span>
    </div>
  );
}
