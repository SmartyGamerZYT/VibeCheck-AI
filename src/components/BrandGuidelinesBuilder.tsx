'use client';

import React, { useState } from 'react';
import {
  BrandGuidelineConfig,
  IssueSeverity,
  UserAccount,
} from '@/lib/types';
import {
  Sliders,
  BookOpen,
  CheckCircle,
  Plus,
  Trash2,
  Shield,
  Palette,
  AlertOctagon,
  Sparkles,
  Save,
  Pin,
} from 'lucide-react';

interface BrandGuidelinesBuilderProps {
  guidelines: BrandGuidelineConfig;
  currentUser: UserAccount;
  onUpdateGuidelines: (updated: BrandGuidelineConfig) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const BrandGuidelinesBuilder: React.FC<BrandGuidelinesBuilderProps> = ({
  guidelines,
  currentUser,
  onUpdateGuidelines,
  onLogAudit,
}) => {
  const [config, setConfig] = useState<BrandGuidelineConfig>(guidelines);
  const [activeSubTab, setActiveSubTab] = useState<'tone' | 'glossary' | 'claims' | 'palette' | 'competitors'>('tone');
  const [savedToast, setSavedToast] = useState(false);

  // New Glossary Term inputs
  const [newForbidden, setNewForbidden] = useState('');
  const [newPreferred, setNewPreferred] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newSeverity, setNewSeverity] = useState<IssueSeverity>('warning');

  // New Claim inputs
  const [newClaim, setNewClaim] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newCategory, setNewCategory] = useState('Clinical Efficacy');

  // New Competitor
  const [newCompetitor, setNewCompetitor] = useState('');

  // New Color Pin inputs
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#A3704C');
  const [newColorRole, setNewColorRole] = useState<'primary' | 'secondary' | 'accent' | 'background' | 'text'>('accent');

  const isAdminOrManager = currentUser.role === 'admin' || currentUser.role === 'manager';

  const handleSave = () => {
    onUpdateGuidelines(config);
    onLogAudit(
      'Brand Guidelines Policy Updated',
      `Modified ${config.brandName} governance configuration (Tone sliders, glossary, or claims).`,
      'guideline'
    );
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddTerm = () => {
    if (!newForbidden.trim() || !newPreferred.trim()) return;
    const item = {
      id: `term_${Date.now()}`,
      forbidden: newForbidden.trim(),
      preferred: newPreferred.trim(),
      reason: newReason.trim() || 'Mandated by editorial guidelines',
      severity: newSeverity,
    };
    setConfig((prev) => ({
      ...prev,
      approvedGlossary: [...prev.approvedGlossary, item],
    }));
    setNewForbidden('');
    setNewPreferred('');
    setNewReason('');
  };

  const handleDeleteTerm = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      approvedGlossary: prev.approvedGlossary.filter((t) => t.id !== id),
    }));
  };

  const handleAddClaim = () => {
    if (!newClaim.trim() || !newSource.trim()) return;
    const item = {
      id: `claim_${Date.now()}`,
      claim: newClaim.trim(),
      source: newSource.trim(),
      category: newCategory,
      verifiedDate: new Date().toISOString().split('T')[0],
    };
    setConfig((prev) => ({
      ...prev,
      approvedClaims: [...prev.approvedClaims, item],
    }));
    setNewClaim('');
    setNewSource('');
  };

  const handleDeleteClaim = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      approvedClaims: prev.approvedClaims.filter((c) => c.id !== id),
    }));
  };

  const handleAddCompetitor = () => {
    if (!newCompetitor.trim()) return;
    setConfig((prev) => ({
      ...prev,
      competitorLockout: [...prev.competitorLockout, newCompetitor.trim()],
    }));
    setNewCompetitor('');
  };

  const handleDeleteCompetitor = (name: string) => {
    setConfig((prev) => ({
      ...prev,
      competitorLockout: prev.competitorLockout.filter((c) => c !== name),
    }));
  };

  const handleAddColor = () => {
    if (!newColorHex.trim()) return;
    const name = newColorName.trim() || `Brand ${newColorRole.charAt(0).toUpperCase() + newColorRole.slice(1)}`;
    const hex = newColorHex.trim().startsWith('#') ? newColorHex.trim().toUpperCase() : `#${newColorHex.trim().toUpperCase()}`;
    
    if (config.colorPalette.some((c) => c.hex.toLowerCase() === hex.toLowerCase())) return;

    setConfig((prev) => ({
      ...prev,
      colorPalette: [...prev.colorPalette, { name, hex, role: newColorRole }],
    }));
    setNewColorName('');
  };

  const handleDeleteColor = (hexToDelete: string) => {
    setConfig((prev) => ({
      ...prev,
      colorPalette: prev.colorPalette.filter((c) => c.hex.toLowerCase() !== hexToDelete.toLowerCase()),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          Brand guidelines updated and broadcasted to AI Review Engine!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sand-100 to-sand-50 border border-sand-300">
        <div>
          <h2 className="text-xl font-serif font-bold text-sand-900">
            Brand Guidelines Builder
          </h2>
        </div>

        {isAdminOrManager && (
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-sand-900 hover:bg-sand-800 text-sand-50 flex items-center gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5 text-sand-300" />
            Save Guidelines
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-sand-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'tone', label: 'Tone & Voice Sliders', icon: Sliders },
          { id: 'glossary', label: 'Approved Glossary', icon: BookOpen },
          { id: 'claims', label: 'Verified Claims Repository', icon: Shield },
          { id: 'palette', label: 'Color & Visual Harmony', icon: Palette },
          { id: 'competitors', label: 'Competitor Lockout', icon: AlertOctagon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-sand-900 text-sand-900 bg-sand-100/60'
                  : 'border-transparent text-sand-600 hover:text-sand-900 hover:bg-sand-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}

      {/* 1. Tone Sliders */}
      {activeSubTab === 'tone' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
              Brand Voice Calibration
            </h3>
            <p className="text-xs text-sand-600">
              Set the dimensional tone targets used by the AI Review Engine to grade prose.
            </p>
          </div>

          <div className="space-y-6 max-w-xl">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-sand-800">
                <span>Formal & Academic</span>
                <span className="font-mono text-sand-900 bg-sand-100 px-2 py-0.5 rounded">
                  {config.toneSliders.formalVsCasual}% Casual
                </span>
                <span>Casual & Conversational</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={!isAdminOrManager}
                value={config.toneSliders.formalVsCasual}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    toneSliders: {
                      ...config.toneSliders,
                      formalVsCasual: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-sand-900 cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-sand-800">
                <span>Serious & Authoritative</span>
                <span className="font-mono text-sand-900 bg-sand-100 px-2 py-0.5 rounded">
                  {config.toneSliders.seriousVsPlayful}% Playful
                </span>
                <span>Playful & Lighthearted</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={!isAdminOrManager}
                value={config.toneSliders.seriousVsPlayful}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    toneSliders: {
                      ...config.toneSliders,
                      seriousVsPlayful: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-sand-900 cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-sand-800">
                <span>Reserved & Understated</span>
                <span className="font-mono text-sand-900 bg-sand-100 px-2 py-0.5 rounded">
                  {config.toneSliders.reservedVsBold}% Bold
                </span>
                <span>Bold & Provocative</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={!isAdminOrManager}
                value={config.toneSliders.reservedVsBold}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    toneSliders: {
                      ...config.toneSliders,
                      reservedVsBold: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-sand-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Approved Glossary */}
      {activeSubTab === 'glossary' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
                Approved Terminology & Prohibited Phrases
              </h3>
              <p className="text-xs text-sand-600">
                Any appearance of prohibited phrases will be automatically flagged during AI scans.
              </p>
            </div>
            <span className="text-xs font-mono text-sand-500">
              {config.approvedGlossary.length} active rules
            </span>
          </div>

          {/* Add Term Form */}
          {isAdminOrManager && (
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-sand-600 block mb-1">
                  Forbidden Phrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. miracle cure"
                  value={newForbidden}
                  onChange={(e) => setNewForbidden(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-sand-600 block mb-1">
                  Preferred Alternative
                </label>
                <input
                  type="text"
                  placeholder="e.g. clinical protocol"
                  value={newPreferred}
                  onChange={(e) => setNewPreferred(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-sand-600 block mb-1">
                  Severity Level
                </label>
                <select
                  aria-label="Severity Level"
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                >
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddTerm}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-sand-900 text-sand-50 hover:bg-sand-800 flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Phrase
                </button>
              </div>
            </div>
          )}

          {/* Table of Glossary Terms */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-sand-200 text-sand-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Forbidden Term</th>
                  <th className="py-2.5 px-3">Preferred Alternative</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Policy Reason</th>
                  {isAdminOrManager && <th className="py-2.5 px-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {config.approvedGlossary.map((term) => (
                  <tr key={term.id} className="hover:bg-sand-50/50">
                    <td className="py-2.5 px-3 font-semibold text-rose-800 line-through">
                      {term.forbidden}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-800">
                      {term.preferred}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                          term.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : term.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-sky-100 text-sky-800 border-sky-300'
                        }`}
                      >
                        {term.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-sand-600 max-w-xs">{term.reason}</td>
                    {isAdminOrManager && (
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteTerm(term.id)}
                          className="text-sand-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5 ml-auto" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Approved Claims */}
      {activeSubTab === 'claims' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
                Approved Facts & Claims Ledger
              </h3>
              <p className="text-xs text-sand-600">
                AI cross-references all claims against these certified scientific and organizational citations.
              </p>
            </div>
            <span className="text-xs font-mono text-sand-500">
              {config.approvedClaims.length} verified claims
            </span>
          </div>

          {/* Add Claim Form */}
          {isAdminOrManager && (
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-sand-600 block mb-1">
                  Certified Claim
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reduces symptom onset by 34%..."
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-sand-600 block mb-1">
                  Audit Source / Citation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Trial #LH-2024"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddClaim}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-sand-900 text-sand-50 hover:bg-sand-800 flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Claim
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.approvedClaims.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-sand-200 bg-sand-50/40 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-sand-500">
                      Verified: {item.verifiedDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-sand-900">
                    &ldquo;{item.claim}&rdquo;
                  </p>
                  <p className="text-[11px] text-sand-600 font-mono">
                    Citation: {item.source}
                  </p>
                </div>

                {isAdminOrManager && (
                  <button
                    onClick={() => handleDeleteClaim(item.id)}
                    className="text-sand-400 hover:text-rose-600 pt-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Color Palette */}
      {activeSubTab === 'palette' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
                Approved Brand Color Palette
              </h3>
              <p className="text-xs text-sand-600">
                Colors used by Computer Vision to score visual compliance and contrast.
              </p>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 bg-sand-100 text-sand-700 rounded-full w-fit">
              {config.colorPalette.length} Pinned Colors
            </div>
          </div>

          {/* Admin Add / Pin Color Form */}
          {isAdminOrManager && (
            <div className="p-4 rounded-xl border border-sand-300 bg-sand-50/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sand-900">
                <Pin className="h-4 w-4 text-sand-700" />
                Add Color by Pin
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-sand-700 uppercase">Pick Color / Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex.startsWith('#') && newColorHex.length === 7 ? newColorHex : '#A3704C'}
                      onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                      className="h-8 w-10 p-0 rounded border border-sand-300 cursor-pointer bg-white"
                      title="Click to pick a color"
                    />
                    <input
                      type="text"
                      placeholder="#HEX"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="flex-1 text-xs font-mono p-2 rounded-lg border border-sand-300 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-sand-700 uppercase">Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Amber Gold, Forest Green"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-sand-700 uppercase">Palette Role</label>
                  <select
                    value={newColorRole}
                    onChange={(e) => setNewColorRole(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-sand-300 bg-white"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="accent">Accent</option>
                    <option value="background">Background</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddColor}
                    className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-sand-900 text-sand-50 hover:bg-sand-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Pin className="h-3.5 w-3.5" />
                    Pin to Palette
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Color Grid with Remove Option */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {config.colorPalette.map((col) => (
              <div
                key={col.hex}
                className="relative group p-3 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2 text-center transition-all hover:border-sand-400"
              >
                {isAdminOrManager && (
                  <button
                    onClick={() => handleDeleteColor(col.hex)}
                    title="Remove color from brand palette"
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90 border border-sand-300 text-sand-400 hover:text-rose-600 shadow-2xs transition-colors z-10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <div
                  style={{ backgroundColor: col.hex }}
                  className="h-16 w-full rounded-lg border border-sand-300 shadow-xs"
                />
                <div>
                  <div className="text-xs font-bold text-sand-900 truncate" title={col.name}>
                    {col.name}
                  </div>
                  <div className="text-[11px] font-mono text-sand-600">{col.hex}</div>
                  <div className="text-[9px] uppercase font-bold text-sand-500 mt-1">
                    {col.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Competitor Lockout */}
      {activeSubTab === 'competitors' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
              Competitor Mention Lockout
            </h3>
            <p className="text-xs text-sand-600">
              The AI Review Engine will flag any direct or comparative mention of these rival entities.
            </p>
          </div>

          {isAdminOrManager && (
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add competitor name..."
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                className="flex-1 text-xs p-2 rounded-lg border border-sand-300 bg-white"
              />
              <button
                onClick={handleAddCompetitor}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sand-900 text-sand-50 hover:bg-sand-800 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {config.competitorLockout.map((comp) => (
              <span
                key={comp}
                className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2"
              >
                {comp}
                {isAdminOrManager && (
                  <button
                    onClick={() => handleDeleteCompetitor(comp)}
                    className="text-rose-400 hover:text-rose-700 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

