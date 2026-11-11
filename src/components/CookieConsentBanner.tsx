'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacy,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('vibecheck_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibecheck_cookie_consent', 'all');
    }
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibecheck_cookie_consent', 'essential_only');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:max-w-md z-50 animate-slideUp">
      <div className="bg-[#3C311F] text-white p-5 rounded-2xl border border-sand-600 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Cookie className="h-4 w-4" />
            </span>
            <span className="font-serif font-bold text-sm text-sand-50">
              Cookie & Data Consent
            </span>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-sand-400 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-sand-200 leading-relaxed">
          We use essential cookies to maintain your authenticated workspace session and ensure real-time AI brand governance audits execute securely.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <button
            onClick={onOpenPrivacy}
            className="text-[11px] text-amber-300 underline font-semibold hover:text-amber-200"
          >
            Privacy Policy
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRejectNonEssential}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-sand-200 font-medium transition-all"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-sand-950 font-bold text-xs shadow-xs transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

