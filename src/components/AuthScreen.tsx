'use client';

import React, { useState } from 'react';
import { UserAccount, Organization, UserRole } from '@/lib/types';
import {
  ShieldCheck,
  KeyRound,
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  CreditCard,
  FileText,
} from 'lucide-react';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';

interface AuthScreenProps {
  organizations: Organization[];
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
  onRegister: (account: UserAccount, newOrg?: Organization) => void;
  onBackToLanding?: () => void;
  onOpenLegal?: (tab: 'about' | 'contact' | 'privacy' | 'terms' | 'copyright') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  organizations,
  accounts,
  onLogin,
  onRegister,
  onBackToLanding,
  onOpenLegal,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('creator');
  const [regOrgName, setRegOrgName] = useState(''); // If Admin
  const [regAdminKey, setRegAdminKey] = useState(''); // If Creator, Reviewer, Manager
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Subscription Payment Modal for Admin
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [pendingAdminData, setPendingAdminData] = useState<{
    account: UserAccount;
    org: Organization;
  } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = accounts.find((a) => a.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (!user) {
      setErrorMsg('No account found with this email. Please check your spelling or register.');
      return;
    }

    onLogin(user);
  };

  const handleQuickDemoLogin = (email: string) => {
    const user = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (user) {
      onLogin(user);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please enter your name and email.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy to create an account.');
      return;
    }

    if (accounts.some((a) => a.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setErrorMsg('An account with this email already exists.');
      return;
    }

    if (regRole === 'admin') {
      if (!regOrgName.trim()) {
        setErrorMsg('Please enter your Company / Organization name.');
        return;
      }

      const generatedKey = `${regOrgName.replace(/[^A-Za-z0-9]/g, '').substring(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrgId = `org_${Date.now()}`;
      const newUserId = `usr_${Date.now()}`;

      const newOrg: Organization = {
        id: newOrgId,
        name: regOrgName.trim(),
        adminKey: generatedKey,
        createdAt: new Date().toISOString(),
        adminId: newUserId,
        adminEmail: regEmail.trim(),
        subscriptionStatus: 'unpaid', // Activated upon ₹5,000 payment
        subscriptionPrice: 5000,
        subscriptionBillingCycle: 'monthly',
      };

      const newAccount: UserAccount = {
        id: newUserId,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword || 'password',
        role: 'admin',
        orgId: newOrgId,
        orgName: regOrgName.trim(),
        createdAt: new Date().toISOString(),
      };

      // Open ₹5,000 subscription payment step for Admin
      setPendingAdminData({ account: newAccount, org: newOrg });
      setShowSubscriptionModal(true);
    } else {
      // Creator, Reviewer, Manager must enter a valid admin key
      const keyToSearch = regAdminKey.trim().toUpperCase();
      const matchedOrg = organizations.find((o) => o.adminKey.toUpperCase() === keyToSearch);

      if (!matchedOrg) {
        setErrorMsg('Invalid Organization Key. Please ask your Admin for their company key.');
        return;
      }

      const newUserId = `usr_${Date.now()}`;
      const newAccount: UserAccount = {
        id: newUserId,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword || 'password',
        role: regRole,
        orgId: matchedOrg.id,
        orgName: matchedOrg.name,
        createdAt: new Date().toISOString(),
      };

      onRegister(newAccount);
    }
  };

  // Payment successful for Admin
  const handlePaymentSuccess = (paymentDetails: {
    txnId: string;
    amount: number;
    paymentMethod: string;
    billingDate: string;
  }) => {
    if (!pendingAdminData) return;

    const activatedOrg: Organization = {
      ...pendingAdminData.org,
      subscriptionStatus: 'active',
      subscriptionPrice: paymentDetails.amount,
      subscriptionBillingCycle: 'monthly',
      nextBillingDate: paymentDetails.billingDate,
      lastPaymentTxnId: paymentDetails.txnId,
      paymentMethod: paymentDetails.paymentMethod,
    };

    setShowSubscriptionModal(false);
    onRegister(pendingAdminData.account, activatedOrg);
  };

  // Check matching org for feedback
  const matchedOrgPreview = regAdminKey.trim()
    ? organizations.find((o) => o.adminKey.toUpperCase() === regAdminKey.trim().toUpperCase())
    : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      {/* Brand Identity Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-sand-900 text-sand-100 shadow-md mb-3">
          <ShieldCheck className="h-6 w-6 text-sand-300" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-sand-900 tracking-tight">
          VibeCheck<span className="text-sand-600 font-sans ml-0.5">AI</span>
        </h1>
        <p className="text-xs text-sand-600 mt-1">
          Intelligent Brand Governance Platform
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-sand-300 shadow-card p-6 md:p-8">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="mb-4 text-xs font-semibold text-sand-500 hover:text-sand-900 flex items-center gap-1.5 transition-colors"
          >
            ← Back to Home
          </button>
        )}

        {/* Toggle Login / Register */}
        <div className="flex border-b border-sand-200 mb-6 pb-2">
          <button
            onClick={() => {
              setIsRegistering(false);
              setErrorMsg(null);
            }}
            className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center transition-all ${
              !isRegistering
                ? 'border-b-2 border-sand-900 text-sand-900'
                : 'text-sand-500 hover:text-sand-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegistering(true);
              setErrorMsg(null);
            }}
            className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center transition-all ${
              isRegistering
                ? 'border-b-2 border-sand-900 text-sand-900'
                : 'text-sand-500 hover:text-sand-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-sand-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs text-sand-900 bg-sand-50/60 border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-sand-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs text-sand-900 bg-sand-50/60 border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              Sign In
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Quick Demo Logins for Instant Testing */}
            <div className="pt-4 border-t border-sand-200">
              <div className="text-[10px] uppercase font-bold text-sand-500 tracking-wider text-center mb-2">
                One-Click Role Demo Sign-In
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left"
                >
                  <div className="font-bold text-sand-900">Admin</div>
                  <div className="text-[10px] text-sand-500">Lumina Health</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('elena@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left"
                >
                  <div className="font-bold text-sand-900">Manager</div>
                  <div className="text-[10px] text-sand-500">Sign-Offs</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('julian@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left"
                >
                  <div className="font-bold text-sand-900">Reviewer</div>
                  <div className="text-[10px] text-sand-500">Editorial</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('maya@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left"
                >
                  <div className="font-bold text-sand-900">Creator</div>
                  <div className="text-[10px] text-sand-500">Draft & AI Scan</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['creator', 'reviewer', 'manager', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRegRole(role)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                      regRole === role
                        ? 'bg-sand-900 text-sand-50 border-sand-900 shadow-2xs'
                        : 'bg-sand-50 text-sand-700 border-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-sand-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 text-xs text-sand-900 bg-sand-50/60 border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-sand-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs text-sand-900 bg-sand-50/60 border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-sand-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-sand-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs text-sand-900 bg-sand-50/60 border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>
            </div>

            {/* If Admin: Enter Company Name & Subscription Requirement Notice */}
            {regRole === 'admin' ? (
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-300 space-y-2">
                <label className="text-xs font-bold text-sand-900 block flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-sand-700" />
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={regOrgName}
                  onChange={(e) => setRegOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full p-2 text-xs text-sand-900 bg-white border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 space-y-1 text-amber-950">
                  <div className="text-[11px] font-bold flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-amber-800" />
                    Subscription: ₹5,000 / month
                  </div>
                  <p className="text-[10px] text-amber-800 leading-tight">
                    Admin registers the company plan (₹5,000/mo). All invited creators, reviewers, and managers join free using your organization key.
                  </p>
                </div>
              </div>
            ) : (
              /* If Creator, Reviewer, Manager: Enter Admin Key */
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-300 space-y-2">
                <label className="text-xs font-bold text-sand-900 block flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-amber-700" />
                  Admin Organization Key
                </label>
                <input
                  type="text"
                  required
                  value={regAdminKey}
                  onChange={(e) => setRegAdminKey(e.target.value)}
                  placeholder="e.g. LUMINA-8842"
                  className="w-full p-2 text-xs font-mono font-bold text-sand-900 bg-white border border-sand-300 rounded-lg uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
                {matchedOrgPreview ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Connecting to <strong>{matchedOrgPreview.name}</strong> (Included under Admin Plan)
                  </div>
                ) : (
                  <p className="text-[11px] text-sand-600">
                    Enter the key provided by your Admin (e.g. try demo key <strong>LUMINA-8842</strong>) to connect directly.
                  </p>
                )}
              </div>
            )}

            {/* MANDATORY TERMS & CONDITIONS CHECKBOX */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-sand-300 text-sand-900 focus:ring-[#3C311F]"
                />
                <span className="text-[11px] text-sand-700 leading-tight">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('terms')}
                    className="font-bold underline text-[#3C311F] hover:text-sand-950"
                  >
                    Terms &amp; Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('privacy')}
                    className="font-bold underline text-[#3C311F] hover:text-sand-950"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {regRole === 'admin' ? (
                <>
                  <CreditCard className="h-3.5 w-3.5 text-amber-300" />
                  Proceed to Payment (₹5,000/mo) & Activate
                </>
              ) : (
                <>
                  Create {regRole.toUpperCase()} Account
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* CHECKOUT MODAL FOR ADMIN */}
      {showSubscriptionModal && pendingAdminData && (
        <SubscriptionCheckoutModal
          isOpen={showSubscriptionModal}
          orgName={pendingAdminData.org.name}
          adminEmail={pendingAdminData.account.email}
          amount={5000}
          onClose={() => setShowSubscriptionModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
