'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles,
  ArrowRight,
  X,
  QrCode,
  Smartphone,
  Check,
} from 'lucide-react';

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  orgName: string;
  adminEmail: string;
  amount?: number; // default 5000
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: {
    txnId: string;
    amount: number;
    paymentMethod: string;
    billingDate: string;
  }) => void;
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  orgName,
  adminEmail,
  amount = 5000,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('admin@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('784');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const txnId = `TXN_${paymentMethod.toUpperCase()}_5000_${Date.now()}`;
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);

      setTimeout(() => {
        onPaymentSuccess({
          txnId,
          amount,
          paymentMethod,
          billingDate: nextMonth.toISOString().split('T')[0],
        });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-sand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-sand-300 shadow-2xl overflow-hidden animate-scaleUp">
        {/* HEADER */}
        <div className="p-5 border-b border-sand-200 bg-[#3C311F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-400 text-sand-950 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-sand-50">
                Organization SaaS Subscription
              </h3>
              <p className="text-[11px] text-amber-200 font-mono">
                {orgName || 'Company Workspace'} • Billed Monthly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-sand-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-sand-950">
                Payment Successful!
              </h4>
              <p className="text-xs text-sand-600">
                ₹{amount.toLocaleString('en-IN')} paid. Your organization workspace is fully activated for all members!
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900">
              Subscription Status: Active • Next billing in 30 days
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 text-xs text-sand-800">
            {/* PRICING BREAKDOWN CARD */}
            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sand-900 text-sm">Enterprise Workspace Plan</span>
                <span className="font-serif font-extrabold text-xl text-sand-950">
                  ₹{amount.toLocaleString('en-IN')}<span className="text-xs font-normal text-sand-500 font-sans">/mo</span>
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-sand-600 border-t border-sand-200 pt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                  Unlimited Creators, Reviewers & Managers under your Admin Key
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                  Real-time AI Content, Keyframe Vision & Speech Cadence Audits
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                  Live Team Video Calls, Screen Sharing & Workflow Integrations
                </li>
              </ul>
              <div className="text-[10px] text-amber-800 font-semibold bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                Only the Admin pays! All invited teammates join free using your company key.
              </div>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-[10px] text-sand-500 block">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#3C311F] bg-sand-100 text-[#3C311F] ring-1 ring-[#3C311F]'
                      : 'border-sand-200 bg-white text-sand-700 hover:bg-sand-50'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3C311F] bg-sand-100 text-[#3C311F] ring-1 ring-[#3C311F]'
                      : 'border-sand-200 bg-white text-sand-700 hover:bg-sand-50'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#3C311F] bg-sand-100 text-[#3C311F] ring-1 ring-[#3C311F]'
                      : 'border-sand-200 bg-white text-sand-700 hover:bg-sand-50'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* METHOD DETAILS */}
            {paymentMethod === 'upi' && (
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                <label className="font-bold text-sand-800 block text-[11px]">UPI ID / VPA</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    className="flex-1 p-2 rounded-lg border border-sand-300 bg-white text-sand-900 font-mono text-xs focus:ring-1 focus:ring-[#3C311F]"
                  />
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-sand-200 text-sand-800 font-semibold text-[11px]"
                  >
                    Verify
                  </button>
                </div>
                <div className="text-[10px] text-sand-500 flex items-center gap-1 pt-1">
                  <QrCode className="h-3 w-3" />
                  Supports Google Pay, PhonePe, Paytm, BHIM & all Indian UPI apps.
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                <div className="space-y-1">
                  <label className="font-bold text-sand-800 block text-[11px]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-sand-300 bg-white text-sand-900 font-mono text-xs focus:ring-1 focus:ring-[#3C311F]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-sand-800 block text-[10px]">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 rounded-lg border border-sand-300 bg-white text-sand-900 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-sand-800 block text-[10px]">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2 rounded-lg border border-sand-300 bg-white text-sand-900 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                <label className="font-bold text-sand-800 block text-[11px]">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 rounded-lg border border-sand-300 bg-white text-sand-900 font-semibold text-xs"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-[#3C311F] hover:bg-[#2B2316] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>Processing Secure Payment of ₹{amount.toLocaleString('en-IN')}...</>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-300" />
                  Pay ₹{amount.toLocaleString('en-IN')} & Activate Organization
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

