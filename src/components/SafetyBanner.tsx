import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

interface SafetyBannerProps {
  language: 'bn' | 'en';
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ language }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      id="safety-disclaimer-banner"
      className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-3 py-2 text-xs backdrop-blur-md flex items-center justify-between z-30 relative"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <p className="leading-snug">
          <span className="font-bold text-amber-300">
            {language === 'bn' ? 'ডিজিটাল সিমুলেশন নোটিশ:' : 'DIGITAL SIMULATION ONLY:'}
          </span>{' '}
          {language === 'bn'
            ? 'এই অ্যাপের সব experiment শিক্ষামূলক digital simulation। বাস্তবে কোনো chemical experiment করার নির্দেশনা এখানে দেওয়া হয় না।'
            : 'All laboratory experiments are educational digital simulations only. No real-world chemical preparation procedures or instructions are provided.'}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-amber-400 hover:text-amber-200 transition-colors shrink-0 ml-2"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
