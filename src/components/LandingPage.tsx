'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Upload,
  PenTool,
  Search,
  CheckCircle2,
  ChevronUp,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck,
  Check,
} from 'lucide-react';

interface LandingPageProps {
  onExploreWorkspace: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreWorkspace,
  onLoginClick,
}) => {
  // Track open state for the 4 workflow cards
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      title: 'Upload guidelines',
      icon: Upload,
      description: 'Add official brand documents and create a reliable reference for your content.',
      expandedDetails:
        'Upload your brand handbook PDFs so VibeCheck AI can use them as reference material during compliance checks.',
    },
    {
      num: '02',
      title: 'Create content',
      icon: PenTool,
      description: 'Draft your content in the editor and refine your messaging.',
      expandedDetails:
        'Write in our real-time rich editor with instant AI feedback for tone, vocabulary, and brand voice adherence.',
    },
    {
      num: '03',
      title: 'Check compliance',
      icon: Search,
      description: 'Identify supported, contradicted and unverified claims with guideline references.',
      expandedDetails:
        'Evaluate every claim, detect unlicensed stock watermarks, and calculate exact WCAG color contrast using computer vision.',
    },
    {
      num: '04',
      title: 'Review & improve',
      icon: CheckCircle2,
      description: 'Managers review submissions and provide feedback for content creators.',
      expandedDetails:
        'Approve with cryptographic sign-off or request revisions with pinpoint explainable suggestions.',
    },
  ];

  const handleToggleCard = (idx: number) => {
    setOpenCardIndex(openCardIndex === idx ? null : idx);
  };

  const scrollToSteps = () => {
    const el = document.getElementById('workflow-steps');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-sand-900 selection:bg-amber-200">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-sand-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-sand-900 flex items-center justify-center text-sand-50 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-amber-200" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-sand-950">
              VibeCheck<span className="text-[#9C8561] font-sans ml-0.5">AI</span>
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-sand-600">
            <button
              onClick={scrollToSteps}
              className="hover:text-sand-950 transition-colors"
            >
              How It Works
            </button>
            <a
              href="#compliance"
              onClick={(e) => {
                e.preventDefault();
                scrollToSteps();
              }}
              className="hover:text-sand-950 transition-colors"
            >
              Compliance Overview
            </a>
            <span className="text-sand-300">|</span>
            <span className="text-[11px] text-sand-500 font-mono">v2.4 Intelligent Governance</span>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="text-xs font-semibold text-sand-800 hover:text-sand-950 px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onExploreWorkspace}
              className="px-4 py-2 rounded-lg bg-[#9C6342] hover:bg-[#865133] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              Explore workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Hero Content) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C6342] font-mono">
                INTELLIGENT BRAND GOVERNANCE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-sand-950 font-normal leading-[1.12] tracking-tight">
              Your brand voice,{' '}
              <span className="font-serif italic text-[#9C8561] block sm:inline">
                protected at every
              </span>{' '}
              step.
            </h1>

            <p className="text-sand-600 text-sm sm:text-base leading-relaxed max-w-lg">
              Create, check and review content against your official brand guidelines.
              Keep every message consistent, compliant and true to your identity.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreWorkspace}
                className="px-5 py-3 rounded-lg bg-[#9C6342] hover:bg-[#865133] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs group"
              >
                Explore workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToSteps}
                className="text-xs sm:text-sm font-semibold text-sand-700 hover:text-sand-950 px-3 py-2 transition-colors"
              >
                See how it works
              </button>
            </div>

            {/* Tagline */}
            <div className="pt-4">
              <span className="text-[11px] text-sand-500 font-mono">
                — Built for teams that care about their brand.
              </span>
            </div>
          </div>

          {/* Right Column (Hero Preview Card matching Image 2) */}
          <div className="lg:col-span-5">
            <div className="bg-[#EFEBE3] rounded-3xl p-5 sm:p-7 shadow-xs border border-sand-300/70">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sand-500 mb-3.5 font-mono">
                CONTENT COMPLIANCE OVERVIEW
              </div>

              {/* White Card Interior */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-sand-200/90 space-y-4">
                {/* Tab Header */}
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-sand-100">
                  <span className="text-sand-900 border-b-2 border-sand-900 pb-1">
                    CONTENT REVIEW
                  </span>
                  <span className="text-sand-400 font-normal">
                    ANALYSIS
                  </span>
                </div>

                {/* Document Title & Draft snippet */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-sand-950">
                    Brand campaign draft
                  </h3>
                  <p className="text-xs text-sand-600 italic bg-sand-50/70 p-3 rounded-xl border border-sand-100/80 leading-relaxed">
                    "We are committed to creating a better experience through thoughtful, reliable solutions."
                  </p>
                </div>

                {/* Factors List */}
                <div className="space-y-2.5 pt-1">
                  {/* Supported */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-sand-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-sand-900">Supported</span>
                        <p className="text-[10px] text-sand-500">Matches official brand guidelines</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-sand-400 font-semibold">01</span>
                  </div>

                  {/* Contradicted */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-sand-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#9C6342] shrink-0" />
                      <div>
                        <span className="font-semibold text-sand-900">Contradicted</span>
                        <p className="text-[10px] text-sand-500">Conflicts with a guideline</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-sand-400 font-semibold">01</span>
                  </div>

                  {/* Unverified */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-sand-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-sand-900">Unverified</span>
                        <p className="text-[10px] text-sand-500">Needs additional evidence</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-sand-400 font-semibold">01</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-sand-400 pt-3 border-t border-sand-100">
                  <span>VIBECHECK AI</span>
                  <span>BRAND INTELLIGENCE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR STEPS WORKFLOW SECTION (matching Image 1) */}
      <section
        id="workflow-steps"
        className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-sand-200/80"
      >
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10 sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-950 font-normal">
            content.
          </h2>
          <p className="text-xs sm:text-sm text-sand-600">
            Four steps to help your team maintain a consistent brand voice.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isOpen = openCardIndex === idx;

            return (
              <div
                key={step.num}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isOpen
                    ? 'border-[#9C6342]/70 shadow-md ring-1 ring-[#9C6342]/20'
                    : 'border-sand-300/80 shadow-2xs hover:border-sand-400 hover:shadow-xs'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Step Number */}
                  <div className="text-xs font-mono text-sand-400 font-bold">
                    {step.num}
                  </div>

                  {/* Icon in warm rounded container */}
                  <div className="h-10 w-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#9C6342]">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-sand-950">
                      {step.title}
                    </h3>
                    <p className="text-xs text-sand-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Expanded Content Box (Accordion) */}
                  {isOpen && (
                    <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-sand-200 text-xs text-sand-700 leading-relaxed animate-fadeIn">
                      {step.expandedDetails}
                    </div>
                  )}
                </div>

                {/* Footer Action to Expand / Collapse */}
                <div className="px-5 sm:px-6 pb-5 pt-1">
                  <button
                    onClick={() => handleToggleCard(idx)}
                    className="text-xs font-semibold text-[#9C6342] hover:text-[#7F4B2E] flex items-center gap-1 transition-colors"
                  >
                    {isOpen ? (
                      <>
                        Show less
                        <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        Explore step
                        <ChevronRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#EFEBE3] border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-sand-950">
              Ready to protect your brand voice?
            </h4>
            <p className="text-xs text-sand-600">
              Set up your guidelines, invite your team, and start publishing compliant copy today.
            </p>
          </div>
          <button
            onClick={onExploreWorkspace}
            className="px-5 py-2.5 rounded-lg bg-[#9C6342] hover:bg-[#865133] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            Enter Workspace
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-sand-200/80 bg-[#FAF8F5] py-8 text-center text-xs text-sand-500">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#9C8561]" />
            <span className="font-serif font-bold text-sand-900">VibeCheck AI</span>
            <span>— Intelligent Brand Governance</span>
          </div>
          <div className="text-[11px] text-sand-400 font-mono">
            WCAG 2.1 AAA Compliant • Computer Vision • Multi-Factor Brand Safety
          </div>
        </div>
      </footer>
    </div>
  );
};

