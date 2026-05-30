import React, { useEffect, useState } from 'react';

export default function ATSGauge({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth initial count animation
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out quad
      const easedScore = Math.round(score * (progress * (2 - progress)));
      setAnimatedScore(easedScore);

      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color matching score range
  const getColorClass = (val) => {
    if (val < 50) return 'stroke-red-500';
    if (val < 75) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  const getTextColorClass = (val) => {
    if (val < 50) return 'text-red-400';
    if (val < 75) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getLabel = (val) => {
    if (val < 50) return 'Poor';
    if (val < 75) return 'Average';
    return 'Excellent';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`transition-all duration-300 ease-out ${getColorClass(animatedScore)}`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Value Label in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {animatedScore}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-900/80 border border-slate-800 ${getTextColorClass(score)}`}>
          <span className={`w-2 h-2 rounded-full ${score < 50 ? 'bg-red-500' : score < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
}
