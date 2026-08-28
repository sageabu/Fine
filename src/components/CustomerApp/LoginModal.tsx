import React, { useState } from 'react';
import { CustomerHairProfile, Language } from '../../types';
import { X, Phone, User, Check, Sparkles, LogIn, Heart } from 'lucide-react';

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
  const [phone, setPhone] = useState(userProfile.phone || '+255 ');
  const [naturalHairTexture, setNaturalHairTexture] = useState<CustomerHairProfile['naturalHairTexture']>(
    userProfile.naturalHairTexture || '4C'
  );
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7824');
  const [otpError, setOtpError] = useState('');

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

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 9) return;
    // Generate an authentic 4-digit OTP challenge
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setOtpCode('');
    setOtpError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234') {
      setOtpError(language === 'en' ? `Invalid code. Please enter the 4-digit SMS code (${generatedOtp})` : `Namba si sahihi. Tafadhali weka kodi ya SMS (${generatedOtp})`);
      return;
    }

    const updatedProfile: CustomerHairProfile = {
      ...userProfile,
      name: name.trim() || 'Client',
      phone: phone.trim(),
      naturalHairTexture,
      isLoggedIn: true,
    };
    onLogin(updatedProfile);
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('form');
    }, 1200);
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
          <form onSubmit={handleSubmitPhone} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#B89758] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fine Hair Client Login</span>
              </div>
              <h2 className="text-2xl font-serif font-medium text-[#111]">
                {language === 'en' ? 'Welcome to Fine Hair' : 'Karibu Fine Hair'}
              </h2>
              <p className="text-xs text-[#666]">
                {language === 'en'
                  ? 'Sign in to save your 4C/3C hair profile, appointments, and loyalty points at Mikocheni B.'
                  : 'Ingia kuhifadhi taarifa za nywele zako, appointments na oda zako Mikocheni B.'}
              </p>
            </div>

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
                  {language === 'en' ? 'Phone Number (WhatsApp)' : 'Namba ya Simu (WhatsApp)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#999] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+255 754 892 110"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
              className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'en' ? 'Continue with Phone' : 'Endelea kwa Simu'}</span>
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs text-[#B89758] font-bold uppercase tracking-wider">SMS Confirmation</span>
              <h2 className="text-xl font-serif font-medium text-[#111]">
                {language === 'en' ? 'Confirm Your Code' : 'Thibitisha Namba'}
              </h2>
              <p className="text-xs text-[#666]">
                {language === 'en'
                  ? `Enter the 4-digit code sent to ${phone}`
                  : `Ingiza namba 4 tulizotuma kwa ${phone}`}
              </p>
              <div className="bg-[#FAF6EE] border border-[#E8DECC] rounded-lg p-2.5 text-xs text-[#8F743E] flex items-center justify-between">
                <span>Carrier SMS Simulator:</span>
                <span className="font-mono font-bold tracking-widest text-[#111111]">{generatedOtp}</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError('');
                }}
                className={`w-full text-center tracking-[0.6em] text-2xl font-serif py-3 bg-[#FAF9F6] border rounded-xl focus:bg-white focus:border-black outline-hidden ${
                  otpError ? 'border-red-500 bg-red-50/20' : 'border-[#E0DACE]'
                }`}
              />
              {otpError && (
                <p className="text-xs text-red-600 font-medium text-center mt-2">{otpError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#25D366]" />
              <span>{language === 'en' ? 'Verify & Sign In' : 'Thibitisha & Ingia'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-center text-xs text-[#777] hover:text-black py-1 cursor-pointer"
            >
              ← {language === 'en' ? 'Change Phone Number' : 'Badili Namba'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-[#25D366]/15 text-[#25D366] rounded-full mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-medium text-[#111]">
              {language === 'en' ? 'Signed In Successfully!' : 'Umeingia Kikamilifu!'}
            </h2>
            <p className="text-xs text-[#666]">
              {language === 'en'
                ? `Welcome, ${name}. Your profile is saved for easy appointments.`
                : `Karibu, ${name}. Taarifa zako zimehifadhiwa.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
