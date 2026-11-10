'use client';

import React, { useState, useRef } from 'react';
import {
  BrandGuidelineConfig,
  AudioAnalysisResult,
  VideoAnalysisResult,
  ComplianceIssue,
  UserAccount,
} from '@/lib/types';
import { SAMPLE_AUDIO_AUDIT, SAMPLE_VIDEO_AUDIT } from '@/lib/default-data';
import {
  Headphones,
  Film,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Music,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  Scale,
  Clock,
  Layers,
  Check,
  FileCheck,
} from 'lucide-react';

interface MediaAuditProps {
  guidelines: BrandGuidelineConfig;
  currentUser: UserAccount;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const MediaAudit: React.FC<MediaAuditProps> = ({
  guidelines,
  currentUser,
  onLogAudit,
}) => {
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video');
  const [isAuditing, setIsAuditing] = useState(false);

  // Audio State
  const [audioAudit, setAudioAudit] = useState<AudioAnalysisResult>(SAMPLE_AUDIO_AUDIT);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Video State
  const [videoAudit, setVideoAudit] = useState<VideoAnalysisResult>(SAMPLE_VIDEO_AUDIT);
  const [selectedKeyframeIdx, setSelectedKeyframeIdx] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Trigger simulated deep media audit
  const handleRunAudioAudit = (file?: File) => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      onLogAudit(
        'Audio Governance Audit',
        `Scanned audio speech cadence (${audioAudit.speechCadenceWordsPerMin} WPM) & LUFS compliance.`,
        'media'
      );
    }, 1200);
  };

  const handleRunVideoAudit = (file?: File) => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      onLogAudit(
        'Video Governance Audit',
        `Audited video keyframes, OCR text overlays, and palette adherence (${videoAudit.visualConsistencyScore}%).`,
        'media'
      );
    }, 1500);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    handleRunAudioAudit(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    handleRunVideoAudit(file);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & MEDIA SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sand-300 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
              {mediaType === 'audio' ? <Headphones className="h-5 w-5" /> : <Film className="h-5 w-5" />}
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-sand-950 flex items-center gap-2">
                Audio & Video Compliance Engine
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                  Multimedia Multimodal
                </span>
              </h2>
              <p className="text-xs text-sand-600">
                Audit voice cadence, speech loudness (LUFS), background music rights, video on-screen text, and keyframe color grading.
              </p>
            </div>
          </div>
        </div>

        {/* Media Type Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-sand-100 border border-sand-200">
          <button
            onClick={() => setMediaType('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaType === 'video'
                ? 'bg-white text-sand-950 shadow-2xs'
                : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            Video Audit
          </button>

          <button
            onClick={() => setMediaType('audio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaType === 'audio'
                ? 'bg-white text-sand-950 shadow-2xs'
                : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            <Headphones className="h-3.5 w-3.5" />
            Audio & Speech Audit
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* 2. VIDEO AUDIT SECTION */}
      {mediaType === 'video' && (
        <div className="space-y-6">
          {/* Top Video Stage & Scorecard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2 Cols: Video Player & Frame Scrubbing */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-[#3C311F]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sand-900">
                    Video Stream & Keyframe Inspector
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-sand-500">
                    {videoAudit.resolution} • {videoAudit.aspectRatio}
                  </span>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 border border-sand-300 flex items-center gap-1 shadow-2xs"
                  >
                    <Upload className="h-3 w-3" />
                    Upload MP4 / MOV
                  </button>
                </div>
              </div>

              {/* Video Player Display */}
              <div className="relative rounded-xl overflow-hidden bg-stone-900 aspect-video flex items-center justify-center border border-stone-800 shadow-inner group">
                <img
                  src={videoAudit.keyframes[selectedKeyframeIdx]?.frameImageUrl}
                  alt="Video Keyframe"
                  className="w-full h-full object-cover transition-all"
                />
                <div className="absolute inset-0 bg-stone-950/20 pointer-events-none" />

                {/* On-screen text overlay badge */}
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-sand-100 border border-stone-700/80 flex items-center gap-2 max-w-md shadow-lg">
                  <FileText className="h-3.5 w-3.5 text-sand-300 shrink-0" />
                  <span className="truncate font-medium">
                    OCR: &ldquo;{videoAudit.keyframes[selectedKeyframeIdx]?.detectedText}&rdquo;
                  </span>
                </div>

                {/* Video Brand Safe-Zone overlay */}
                <div className="absolute inset-6 border border-dashed border-white/20 rounded-lg pointer-events-none flex items-end justify-end p-2 text-[9px] text-white/50 font-mono">
                  Title-Safe Margin (90%)
                </div>

                {/* Timestamp badge */}
                <div className="absolute bottom-3 right-3 bg-stone-950/80 px-2 py-0.5 rounded font-mono text-[11px] text-sand-200 border border-stone-700">
                  Keyframe @ 00:{videoAudit.keyframes[selectedKeyframeIdx]?.timestampSeconds < 10 ? '0' : ''}
                  {videoAudit.keyframes[selectedKeyframeIdx]?.timestampSeconds}s
                </div>
              </div>

              {/* Keyframe Timeline Strip */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-sand-700">
                  <span>Timeline Keyframes ({videoAudit.keyframes.length} Sampled)</span>
                  <span className="text-[11px] text-sand-500 font-normal">
                    Click frame to inspect visual compliance & text contrast
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {videoAudit.keyframes.map((kf, i) => {
                    const isSelected = i === selectedKeyframeIdx;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedKeyframeIdx(i)}
                        className={`cursor-pointer p-2 rounded-xl border transition-all text-left space-y-1.5 ${
                          isSelected
                            ? 'bg-sand-50 border-[#3C311F] ring-2 ring-[#3C311F]/20 shadow-xs'
                            : 'bg-white border-sand-200 hover:border-sand-300 shadow-2xs'
                        }`}
                      >
                        <div className="relative rounded-lg overflow-hidden aspect-video bg-stone-800">
                          <img
                            src={kf.frameImageUrl}
                            alt="Frame thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-stone-950/80 text-white font-mono text-[9px] px-1 rounded">
                            {kf.timestampSeconds}s
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-sand-800">
                            Palette: {kf.paletteAdherenceScore}%
                          </span>
                          <span className="flex items-center gap-0.5">
                            {kf.dominantHexes.slice(0, 3).map((hex, hIdx) => (
                              <span
                                key={hIdx}
                                className="h-2.5 w-2.5 rounded-full border border-sand-300 inline-block"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 1 Col: Video Compliance Scorecard */}
            <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                    Video Compliance Audit
                  </h3>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Broadcast Ready
                  </span>
                </div>

                {/* Overall Score Badge */}
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 text-center space-y-1">
                  <div className="text-3xl font-serif font-extrabold text-sand-950">
                    {videoAudit.overallVideoScore}%
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Approved For Channel Distribution
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-sand-700 font-semibold mb-1">
                      <span>Brand Visual Consistency</span>
                      <span className="font-bold font-mono">{videoAudit.visualConsistencyScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3C311F] rounded-full"
                        style={{ width: `${videoAudit.visualConsistencyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-semibold mb-1">
                      <span>Subtitles Contrast (WCAG AAA)</span>
                      <span className="font-bold font-mono">{videoAudit.subtitlesContrastRatio}:1 Pass</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-semibold mb-1">
                      <span>Stock Watermark Safeguard</span>
                      <span className="font-bold font-mono">100% Clean</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-semibold mb-1">
                      <span>Audio Cadence & LUFS Norm</span>
                      <span className="font-bold font-mono">
                        {videoAudit.audioSyncAudit.speechCadenceWordsPerMin} WPM (-14 LUFS)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2 text-xs">
                <span className="font-bold text-sand-800 uppercase text-[10px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  AI Video Verification Findings
                </span>
                <ul className="space-y-1.5 text-[11px] text-sand-700">
                  {videoAudit.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-[#3C311F] font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AUDIO AUDIT SECTION */}
      {mediaType === 'audio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2 Cols: Audio Waveform & Speech Transcript */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-[#3C311F]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sand-900">
                    Audio Player & Waveform Analysis
                  </span>
                </div>
                <button
                  onClick={() => audioInputRef.current?.click()}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 border border-sand-300 flex items-center gap-1 shadow-2xs"
                >
                  <Upload className="h-3 w-3" />
                  Upload MP3 / WAV
                </button>
              </div>

              {/* Interactive Audio Player & Waveform Visualizer */}
              <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-300 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="h-12 w-12 rounded-full bg-[#3C311F] text-white flex items-center justify-center hover:bg-[#2B2316] transition-all shadow-md shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-sand-950">
                        {audioFile ? audioFile.name : 'Lumina_Health_Metabolic_Overview_Master.mp3'}
                      </div>
                      <div className="text-[11px] text-sand-500 font-mono">
                        Duration: {audioAudit.durationSeconds}s • Stereo 48kHz • -14.2 LUFS EBU R128
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Loudness Compliant
                  </div>
                </div>

                {/* Simulated Waveform Bar Graphic */}
                <div className="h-16 w-full flex items-end gap-1 px-2 py-1 bg-white rounded-xl border border-sand-200 overflow-hidden">
                  {[24, 38, 55, 78, 62, 45, 80, 92, 40, 65, 88, 70, 52, 60, 85, 95, 72, 48, 66, 82, 90, 75, 60, 42, 68, 84, 50, 62, 79, 88, 44, 70, 85, 60, 40, 55, 75, 92, 68, 50].map(
                    (val, barIdx) => (
                      <div
                        key={barIdx}
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${
                          isPlayingAudio && barIdx < 22
                            ? 'bg-[#3C311F]'
                            : isPlayingAudio
                            ? 'bg-amber-600/80 animate-pulse'
                            : 'bg-sand-300 hover:bg-[#3C311F]'
                        }`}
                        style={{ height: `${val}%` }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Automatic Speech-to-Text (STT) Transcript Inspection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-sand-600" />
                    Speech-to-Text Transcript (AI Audited)
                  </h4>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Claims Verified Clean
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-sand-300 bg-sand-50/50 text-xs leading-relaxed text-sand-900 font-mono">
                  &ldquo;{audioAudit.transcription}&rdquo;
                </div>
              </div>
            </div>

            {/* 1 Col: Audio Voice Cadence & Music Copyright */}
            <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                    Audio Voice & Music Metrics
                  </h3>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Passed (94%)
                  </span>
                </div>

                {/* Scorecard Box */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sand-500 uppercase block">Speech Cadence</span>
                      <strong className="text-base text-sand-950 font-mono">
                        {audioAudit.speechCadenceWordsPerMin} WPM
                      </strong>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Optimal (140-160 WPM)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sand-500 uppercase block">Filler Word Frequency</span>
                      <strong className="text-base text-sand-950 font-mono">
                        {audioAudit.fillerWordRatioPercent}%
                      </strong>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Clean (&lt; 2%)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sand-500 uppercase block">Loudness Target</span>
                      <strong className="text-base text-sand-950 font-mono">
                        {audioAudit.loudnessLUFS} LUFS
                      </strong>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      EBU R128 Pass
                    </span>
                  </div>

                  {/* Background Music & Copyright */}
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Music className="h-3.5 w-3.5 text-purple-700" />
                        Music Copyright Scan
                      </span>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                        {audioAudit.musicCopyrightScore}% Clear
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed font-medium">
                      {audioAudit.musicTrackMatch}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2 text-xs">
                <span className="font-bold text-sand-800 uppercase text-[10px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Audio Regulatory Verification
                </span>
                <ul className="space-y-1.5 text-[11px] text-sand-700">
                  {audioAudit.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-[#3C311F] font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
