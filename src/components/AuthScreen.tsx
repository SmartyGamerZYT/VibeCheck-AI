'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
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

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

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
  const [showLocalhostNotice, setShowLocalhostNotice] = useState(false);

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

  const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '577702414484-9q6isc2s1ks0i34u27afnouep97qdr0s.apps.googleusercontent.com';

  // Decode JWT helper for Google Credential
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Handle incoming Google Auth Credential
  const handleGoogleCredential = (credentialToken: string) => {
    if (!credentialToken) {
      setErrorMsg('No credential returned from Google. Please try again.');
      return;
    }

    try {
      const googleUser = parseJwt(credentialToken);
      if (!googleUser || !googleUser.email) {
        setErrorMsg('Unable to parse Google authentication token.');
        return;
      }

      const email = googleUser.email.toLowerCase();
      const name = googleUser.name || email.split('@')[0];

      // 1. Check if user already exists
      const existing = accounts.find((a) => a.email.toLowerCase() === email);
      if (existing) {
        onLogin(existing);
        return;
      }

      // 2. New Google User -> Automatically register under primary organization
      const defaultOrg = organizations[0] || {
        id: 'org_lumina',
        name: 'Lumina Health',
        adminKey: 'LUMINA-8842',
      };

      const newUserId = `usr_g_${Date.now()}`;
      const newAccount: UserAccount = {
        id: newUserId,
        name: name,
        email: email,
        password: 'google_authenticated',
        role: isRegistering ? regRole : 'creator',
        orgId: defaultOrg.id,
        orgName: defaultOrg.name,
        createdAt: new Date().toISOString(),
      };

      onRegister(newAccount);
    } catch (err: any) {
      console.error('Error processing Google sign-in:', err);
      setErrorMsg('Failed to process Google sign-in. Please try again.');
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initGoogle = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (res: any) => {
              handleGoogleCredential(res?.credential);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const container = document.getElementById('google-btn-rendered');
          if (container) {
            container.innerHTML = '';
            google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: isRegistering ? 'signup_with' : 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 320,
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          initGoogle();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isRegistering]);

  // Click handler for custom Google button
  const handleGoogleClick = () => {
    setErrorMsg(null);
    const google = (window as any).google;

    // Check if on localhost (Google Console currently authorizes https://vibe-check-ai-ecru.vercel.app)
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (google?.accounts?.id) {
      try {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt could not show (e.g., origin not registered on localhost)
            const rendered = document.getElementById('google-btn-rendered');
            const innerBtn = rendered?.querySelector('div[role=button]') as HTMLElement;
            if (innerBtn) {
              innerBtn.click();
            } else if (isLocalhost) {
              setShowLocalhostNotice(true);
            }
          }
        });
      } catch {
        if (isLocalhost) setShowLocalhostNotice(true);
      }
    } else {
      if (isLocalhost) setShowLocalhostNotice(true);
    }
  };

  // Quick simulation for local developer testing when localhost origin is pending in Google Console
  const handleSimulateGoogleLogin = (roleToUse?: UserRole) => {
    const defaultOrg = organizations[0] || {
      id: 'org_lumina',
      name: 'Lumina Health',
      adminKey: 'LUMINA-8842',
    };

    const simulatedAccount: UserAccount = {
      id: `usr_g_${Date.now()}`,
      name: 'Google User (Verified)',
      email: 'alex.morgan.google@gmail.com',
      password: 'google_authenticated',
      role: roleToUse || (isRegistering ? regRole : 'creator'),
      orgId: defaultOrg.id,
      orgName: defaultOrg.name,
      createdAt: new Date().toISOString(),
    };

    const existing = accounts.find(
      (a) => a.email.toLowerCase() === simulatedAccount.email.toLowerCase()
    );

    if (existing) {
      onLogin(existing);
    } else {
      onRegister(simulatedAccount);
    }
  };

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
        subscriptionStatus: 'unpaid',
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

      setPendingAdminData({ account: newAccount, org: newOrg });
      setShowSubscriptionModal(true);
    } else {
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
            className="mb-4 text-xs font-semibold text-sand-500 hover:text-sand-900 flex items-center gap-1.5 transition-colors cursor-pointer"
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
              setShowLocalhostNotice(false);
            }}
            className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${!isRegistering
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
              setShowLocalhostNotice(false);
            }}
            className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${isRegistering
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

        {/* ======================================================== */}
        {/* CONTINUE WITH GOOGLE SECTION */}
        {/* ======================================================== */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full py-2.5 px-4 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-sand-900 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-2xs hover:border-sand-400 transition-all cursor-pointer"
          >
            <GoogleIcon />
            <span>{isRegistering ? 'Sign up with Google' : 'Continue with Google'}</span>
          </button>

          {/* Hidden container for native Google rendered button */}
          <div id="google-btn-rendered" className="hidden" />

          {/* Localhost Origin Guidance for Developers */}
          {showLocalhostNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs space-y-2.5 shadow-2xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Google Console Origin Note:</strong> Your Client ID is registered with authorized origin{' '}
                  <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[10px]">https://vibe-check-ai-ecru.vercel.app</span>.
                  For local testing, add <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[10px]">http://localhost:3000</span> to <em>Authorized JavaScript Origins</em> in your Google Cloud Console.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin()}
                className="w-full py-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <GoogleIcon />
                Continue with Verified Google Profile (Dev Test)
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-sand-200"></div>
            <span className="shrink mx-3 text-[10px] font-bold text-sand-600 uppercase tracking-wider">
              or continue with email
            </span>
            <div className="grow border-t border-sand-200"></div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LOGIN FORM */}
        {/* ======================================================== */}
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
              className="w-full py-2.5 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left cursor-pointer"
                >
                  <div className="font-bold text-sand-900">Admin</div>
                  <div className="text-[10px] text-sand-500">Lumina Health</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('elena@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left cursor-pointer"
                >
                  <div className="font-bold text-sand-900">Manager</div>
                  <div className="text-[10px] text-sand-500">Sign-Offs</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('julian@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left cursor-pointer"
                >
                  <div className="font-bold text-sand-900">Reviewer</div>
                  <div className="text-[10px] text-sand-500">Editorial</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('maya@luminahealth.org')}
                  className="p-2 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-200 text-left cursor-pointer"
                >
                  <div className="font-bold text-sand-900">Creator</div>
                  <div className="text-[10px] text-sand-500">Draft & AI Scan</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ======================================================== */
          /* REGISTRATION FORM */
          /* ======================================================== */
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
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${regRole === role
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
                    className="font-bold underline text-[#3C311F] hover:text-sand-950 cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('privacy')}
                    className="font-bold underline text-[#3C311F] hover:text-sand-950 cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {regRole === 'admin' ? (
                <>
                  <CreditCard className="h-3.5 w-3.5 text-amber-300" />
                  Proceed to Payment (₹5,000/mo) &amp; Activate
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
