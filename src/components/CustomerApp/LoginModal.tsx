import React, { useState } from 'react';
import { CustomerHairProfile, Language } from '../../types';
import { X, Phone, User, Check, Sparkles, LogIn, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { api, setApiActiveSession } from '../../utils/apiClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: CustomerHairProfile;
  onLogin: (profile: CustomerHairProfile) => void;
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLogin,
  language,
}) => {
  const [name, setName] = useState(userProfile.name || '');
  const [phoneOrEmail, setPhoneOrEmail] = useState(userProfile.phone || userProfile.email || '+255 ');
  const [naturalHairTexture, setNaturalHairTexture] = useState<CustomerHairProfile['naturalHairTexture']>(
    userProfile.naturalHairTexture || '4C'
  );
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [challengeId, setChallengeId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [deliveryNotice, setDeliveryNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hairTextures: CustomerHairProfile['naturalHairTexture'][] = [
    '4C',
    '4B',
    '4A',
    '4C2',
    '4B (AKC)',
    '4A (CAKC)',
    '3B',
    '4A YYE',
    'Relaxed',
    'Locs',
  ];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = phoneOrEmail.trim();
    if (!target || target.length < 5) {
      setErrorMessage(language === 'en' ? 'Please enter a valid phone number or email.' : 'Tafadhali weka namba au barua pepe halisi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.sendCustomerOtp(target, 'customer_auth');
      if (res.success && res.challengeId) {
        setChallengeId(res.challengeId);
        setDeliveryNotice(res.deliveryNotice || (language === 'en' ? `Verification code dispatched to ${target}` : `Kodi ya uthibitisho imetumwa kwa ${target}`));
        setStep('otp');
        setOtpCode('');
      } else {
        setErrorMessage('Failed to send verification code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMessage(language === 'en' ? 'Please enter the full 6-digit code received.' : 'Tafadhali weka namba zote 6 za uthibitisho.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.verifyCustomerOtp(challengeId, otpCode.trim());
      if (res.success && res.token && res.user) {
        setApiActiveSession(res.token, res.user, res.session);
        const updatedProfile: CustomerHairProfile = {
          ...userProfile,
          name: name.trim() || res.customer?.name || res.user.name || 'Client',
          phone: res.customer?.phone || phoneOrEmail.trim(),
          email: res.customer?.email || (phoneOrEmail.includes('@') ? phoneOrEmail.trim() : undefined),
          naturalHairTexture: (res.customer?.hairTexture as any) || naturalHairTexture,
          isLoggedIn: true,
        };
        onLogin(updatedProfile);
        setStep('success');
        setTimeout(() => {
          onClose();
          setStep('form');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EAEAEA] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] flex items-center justify-center text-[#666] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#B89758] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fine Hair Client Portal</span>
              </div>
              <h2 className="text-2xl font-serif font-medium text-[#111]">
                {language === 'en' ? 'Client Sign In' : 'Karibu Fine Hair'}
              </h2>
              <p className="text-xs text-[#666]">
                {language === 'en'
                  ? 'Verify with real SMS / WhatsApp OTP to access your tailored 4C/3C salon bookings and order history.'
                  : 'Thibitisha kwa namba ya simu kuangalia historia ya nywele na miadi yako.'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">
                  {language === 'en' ? 'Full Name' : 'Jina Kamili'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#999] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Mkwawa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">
                  {language === 'en' ? 'Phone Number / WhatsApp' : 'Namba ya Simu / WhatsApp'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#999] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="+255 754 892 110"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">
                  {language === 'en' ? 'Your Natural Hair Texture' : 'Muundo wa Nywele Zako Asilia'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {hairTextures.map((tex) => (
                    <button
                      key={tex}
                      type="button"
                      onClick={() => setNaturalHairTexture(tex)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        naturalHairTexture === tex
                          ? 'bg-[#111] text-white border-[#111] shadow-xs'
                          : 'bg-[#FAF9F6] text-[#666] border-[#E0DACE] hover:bg-[#F0EBE0]'
                      }`}
                    >
                      {tex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'en' ? 'Send Verification Code' : 'Tuma Kodi ya Uthibitisho'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#B89758] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security Verification</span>
              </div>
              <h2 className="text-xl font-serif font-medium text-[#111]">
                {language === 'en' ? 'Enter 6-Digit Code' : 'Thibitisha Namba'}
              </h2>
              <p className="text-xs text-[#666]">
                {deliveryNotice || (language === 'en' ? `Code dispatched securely to ${phoneOrEmail}` : `Kodi imetumwa kwa ${phoneOrEmail}`)}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setErrorMessage('');
                }}
                className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 bg-[#FAF9F6] border border-[#E0DACE] rounded-xl focus:bg-white focus:border-black outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 6}
              className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#25D366]" />
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>{language === 'en' ? 'Verify & Secure Session' : 'Thibitisha & Ingia'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('form');
                setErrorMessage('');
              }}
              className="w-full text-center text-xs text-[#777] hover:text-black py-1 cursor-pointer"
            >
              ← {language === 'en' ? 'Change Contact Information' : 'Badili Namba'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-[#25D366]/15 text-[#25D366] rounded-full mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-medium text-[#111]">
              {language === 'en' ? 'Authenticated Successfully!' : 'Umeingia Kikamilifu!'}
            </h2>
            <p className="text-xs text-[#666]">
              {language === 'en'
                ? `Welcome back, ${name || 'Client'}. Your secure session is active.`
                : `Karibu, ${name || 'Client'}. Taarifa zako zimehifadhiwa.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

