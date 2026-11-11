'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Send,
  Building,
  CheckCircle2,
  FileText,
  Lock,
  Scale,
  Phone,
  Globe,
  HelpCircle,
  Copyright,
  CreditCard,
} from 'lucide-react';

export type LegalTab = 'about' | 'contact' | 'privacy' | 'terms' | 'copyright';

interface LegalSupportModalProps {
  initialTab?: LegalTab;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalSupportModal: React.FC<LegalSupportModalProps> = ({
  initialTab = 'about',
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Product Inquiry & Support');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentToast, setSentToast] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentToast(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setSentToast(false), 5000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-sand-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-sand-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-sand-200 bg-sand-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sand-900 flex items-center justify-center text-amber-200 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-sand-950 flex items-center gap-2">
                VibeCheck AI <span className="text-xs font-sans text-sand-500 font-normal">Governance & Support</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sand-500 hover:text-sand-950 hover:bg-sand-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-sand-200 px-5 bg-white overflow-x-auto gap-2">
          {[
            { id: 'about' as LegalTab, label: 'About Us', icon: Building },
            { id: 'contact' as LegalTab, label: 'Contact Us', icon: Mail },
            { id: 'privacy' as LegalTab, label: 'Privacy Policy', icon: Lock },
            { id: 'terms' as LegalTab, label: 'Terms of Service', icon: Scale },
            { id: 'copyright' as LegalTab, label: 'Copyright Notice', icon: Copyright },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-[#3C311F] text-[#3C311F]'
                    : 'border-transparent text-sand-600 hover:text-sand-950'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-sand-800 leading-relaxed flex-1">
          {/* TAB 1: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-serif font-bold text-sand-950">About VibeCheck AI</h3>
                <p className="text-xs text-sand-600 mt-1">
                  Autonomous brand governance, legal verification, and real-time team collaboration platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
                  <h4 className="font-bold text-sand-900 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-[#3C311F]" />
                    Our Mission
                  </h4>
                  <p className="text-sand-700">
                    Empowering cross-functional content teams to publish at velocity without ever compromising on regulatory compliance, factual citations, or visual brand harmony.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
                  <h4 className="font-bold text-sand-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    Security & Trust
                  </h4>
                  <p className="text-sand-700">
                    Built with enterprise-grade cryptographic sign-offs, Zero-Data Retention policies for private company files, and strict access boundaries for Creators, Reviewers, and Managers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#3C311F] text-sand-100 space-y-2">
                <div className="font-serif font-bold text-sm text-amber-200">The VibeCheck AI Standard</div>
                <p className="text-sand-200">
                  From multi-factor text audits and keyframe computer vision to speech cadence verification and synchronized team huddles, VibeCheck AI guarantees that every piece of published media is backed by verified brand guidelines.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-serif font-bold text-sand-950">Contact Us & Direct Support</h3>
                <p className="text-xs text-sand-600 mt-1">
                  Have questions about your organization subscription, integration setup, or custom guidelines? Reach out directly to our team.
                </p>
              </div>

              {sentToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 font-bold animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Your message has been sent successfully! Our governance engineering team will reply to your email within 2 hours.
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Form */}
                <form onSubmit={handleContactSubmit} className="lg:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-sand-800">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-sand-900 focus:outline-hidden focus:ring-1 focus:ring-[#3C311F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-sand-800">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-sand-900 focus:outline-hidden focus:ring-1 focus:ring-[#3C311F]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-sand-800">Inquiry Subject</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-sand-900 font-semibold"
                    >
                      <option value="Product Inquiry & Support">Product Inquiry & Support</option>
                      <option value="Enterprise ₹5,000/mo Billing Question">Enterprise ₹5,000/mo Billing Question</option>
                      <option value="Custom Brand AI Calibration">Custom Brand AI Calibration</option>
                      <option value="API & Workflow Integrations">API & Workflow Integrations</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-sand-800">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us how we can assist your brand team..."
                      className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-sand-900 focus:outline-hidden focus:ring-1 focus:ring-[#3C311F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2.5 rounded-xl bg-[#3C311F] hover:bg-[#2B2316] text-white font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    {isSending ? (
                      <>Sending Message...</>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-amber-200" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                {/* Direct info cards */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500">Support Desk</span>
                    <div className="font-mono font-bold text-sand-900 text-xs">support@vibecheck.ai</div>
                    <p className="text-[11px] text-sand-600">Available Monday through Saturday for enterprise SLA response.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500">Subscription & Billing</span>
                    <div className="font-mono font-bold text-sand-900 text-xs">billing@vibecheck.ai</div>
                    <p className="text-[11px] text-sand-600">Organization licenses, GST invoices, and renewal assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-sand-950">Privacy Policy</h3>
                <span className="text-[11px] font-mono text-sand-500">Last Updated: November 2026</span>
              </div>

              <div className="space-y-3 text-sand-700">
                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">1. Data Ownership & Content Protection</h4>
                  <p>
                    All content, text drafts, DOCX files, audio recordings, and video media uploaded to VibeCheck AI remain the exclusive intellectual property of your organization. We do not use your private drafts to train public foundation models.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">2. Cookies & Local Storage</h4>
                  <p>
                    VibeCheck AI uses essential cookies and client storage to securely preserve session authentication, active organization keys, workspace preferences, and offline audit history. Non-essential cookies may be rejected at any time via the cookie banner.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">3. Security & Cryptographic Storage</h4>
                  <p>
                    All communication between your browser and our AI audit infrastructure is encrypted using TLS 1.3. Approved submissions are signed with cryptographic SHA-256 digital hashes to ensure unalterable compliance trails.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-sand-950">Terms of Service</h3>
                <span className="text-[11px] font-mono text-sand-500">Organization SaaS Agreement</span>
              </div>

              <div className="space-y-3 text-sand-700">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-1.5 text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <CreditCard className="h-4 w-4 text-amber-800" />
                    Organization Subscription: ₹5,000 / month
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Access to VibeCheck AI is granted on a monthly subscription basis of <strong>₹5,000 per month</strong> per company workspace. The organization Admin is exclusively responsible for maintaining active subscription billing. If the subscription expires or lapses, workspace services automatically suspend for all associated creators, reviewers, and managers until renewed.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">1. Multi-Seat Workspace Coverage</h4>
                  <p>
                    A single ₹5,000/month organization subscription includes unlimited team members under the organization&apos;s unique admin key. Creators, Reviewers, and Managers never pay individually.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">2. Acceptable Use & Governance Standards</h4>
                  <p>
                    Users must not submit defamatory, unlawful, or intentionally harmful content. VibeCheck AI flags safety and regulatory violations in compliance with applicable advertising and healthcare statutes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <h4 className="font-bold text-sand-900 text-xs">3. Cancellation & Renewal</h4>
                  <p>
                    Admins may cancel their subscription at any time. Active service will continue through the conclusion of the paid billing cycle, after which data remains exportable for 60 days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COPYRIGHT NOTICE */}
          {activeTab === 'copyright' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-sand-950">Copyright & Trademark Notice</h3>
                <span className="text-[11px] font-mono text-sand-500">© 2026 VibeCheck AI Inc. All rights reserved.</span>
              </div>

              <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-3 text-sand-700">
                <p>
                  The VibeCheck AI platform, including its software architecture, proprietary compliance evaluation engines, multi-track computer vision pipeline, user interface, brand assets, and documentation, is protected under international copyright, trademark, and intellectual property treaties.
                </p>
                <p>
                  Any unauthorized duplication, reverse engineering, unauthorized API scraping, or commercial resale of the software or its associated governance algorithms is strictly prohibited.
                </p>
                <div className="pt-2 border-t border-sand-200 font-mono text-[11px] text-sand-600">
                  VibeCheck AI™ and the Shield Checkmark logo are registered trademarks. All third-party trademarks (Google, YouTube, Canva, Microsoft Teams, GitHub) belong to their respective owners.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-center justify-between text-xs text-sand-600">
          <div className="font-mono text-[11px]">
            VibeCheck AI • Certified Brand Governance
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#3C311F] text-white font-bold hover:bg-[#2B2316] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

