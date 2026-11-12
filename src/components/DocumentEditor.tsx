'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Trash2,
  Download,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DocumentEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  className?: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste your draft content here...',
  minRows = 8,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = (newVal: string) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newVal);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    onChange(newVal);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  // Helper to apply markdown/text formatting around cursor or selection
  const applyFormatting = (before: string, after: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const replacement = selected.length > 0 ? `${before}${selected}${after}` : `${before}${defaultText}${after}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    pushHistory(nextVal);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + before.length + (selected.length || defaultText.length);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Line prefix helper (headings, lists, quotes)
  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lastNewline = value.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const nextVal = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    pushHistory(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  // Templates
  const handleInsertTemplate = (templateType: string) => {
    let tpl = '';
    switch (templateType) {
      case 'product':
        tpl = `### Introducing Our Next-Generation Solution\n\nWe are proud to unveil our clinically validated, patient-centric wellness formula. Engineered with precision and verified through rigorous quality standards, this breakthrough promotes sustained vitality and overall wellness.\n\n- Clinically tested botanical extracts\n- High bioavailability and rapid absorption\n- Certified organic and allergen-free\n\nExperience evidence-based wellness designed for long-term health.`;
        break;
      case 'blog':
        tpl = `## Evidence-Based Strategies for Sustainable Vitality\n\nMaintaining daily energy and cognitive balance requires a multi-faceted approach. Research indicates that circadian alignment, structured hydration, and evidence-based nutritional protocols produce substantial improvements in physical endurance.\n\n> "Wellness is not an occasional intervention, but a consistent, science-backed lifestyle protocol."\n\nExplore our clinician-curated health recommendations to optimize your daily routine.`;
        break;
      case 'social':
        tpl = `Elevate your wellness standards.\n\nDiscover evidence-based wellness solutions engineered to support your daily vitality. Pure ingredients, transparent sourcing, and validated results.\n\nDiscover the full clinical story at luminahealth.com`;
        break;
      default:
        break;
    }

    if (tpl) {
      pushHistory(tpl);
    }
  };

  // Download draft as text/markdown
  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-draft.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const words = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = value.length;
  const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return (
    <div className={`rounded-xl border border-sand-300 bg-white overflow-hidden shadow-2xs ${className}`}>
      {/* 1. EDITING TOOLBAR */}
      <div className="bg-sand-50/90 border-b border-sand-200 p-1.5 flex flex-wrap items-center justify-between gap-1">
        {/* Left Tool Group */}
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Bold */}
          <button
            type="button"
            onClick={() => applyFormatting('**', '**', 'bold text')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => applyFormatting('*', '*', 'italic text')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => applyFormatting('<u>', '</u>', 'underlined text')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => applyFormatting('~~', '~~', 'strikethrough')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Strikethrough (~~text~~)"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-sand-300 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => applyLinePrefix('# ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors text-xs font-bold"
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyLinePrefix('## ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors text-xs font-bold"
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyLinePrefix('### ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors text-xs font-bold"
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-sand-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => applyLinePrefix('- ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyLinePrefix('1. ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyLinePrefix('> ')}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-sand-300 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Tool Group: Template selector & Download */}
        <div className="flex items-center gap-1.5">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleInsertTemplate(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-[11px] font-semibold bg-white border border-sand-300 rounded px-2 py-1 text-sand-800 hover:bg-sand-50 cursor-pointer focus:outline-hidden"
          >
            <option value="" disabled>
              Insert Template...
            </option>
            <option value="product">Product Launch Copy</option>
            <option value="blog">Wellness Article</option>
            <option value="social">Social Media Ad</option>
          </select>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors"
            title="Export / Download Document (.md)"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => pushHistory('')}
            className="p-1.5 rounded hover:bg-rose-100 text-sand-600 hover:text-rose-700 transition-colors"
            title="Clear Text"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => pushHistory(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full text-xs leading-relaxed text-sand-900 bg-white p-3.5 focus:outline-hidden resize-y font-sans"
      />

      {/* 3. METRICS FOOTER */}
      <div className="bg-sand-50/70 border-t border-sand-200 px-3 py-1.5 flex items-center justify-between text-[10px] text-sand-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {words} words
          </span>
          <span>•</span>
          <span>{chars} characters</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          ~{readTimeMinutes} min read
        </div>
      </div>
    </div>
  );
};

