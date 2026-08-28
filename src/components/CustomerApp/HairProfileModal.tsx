import React, { useState } from 'react';
import { CustomerHairProfile, StaffMember } from '../../types';
import { Crown, Sparkles, X, Check, Gift, ShieldCheck, Heart } from 'lucide-react';

interface HairProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: CustomerHairProfile;
  onSaveProfile: (updated: CustomerHairProfile) => void;
  staffList: StaffMember[];
}

export const HairProfileModal: React.FC<HairProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  staffList,
}) => {
  if (!isOpen) return null;

  const currentProfile = profile || {
    name: 'Sarah Mkwawa',
    phone: '+255 754 892 110',
    naturalHairTexture: '4C',
    preferredWigStyles: ['Bone Straight', 'HD Lace Closure'],
    preferredLengths: ['28 inch', '30 inch'],
    preferredDensities: ['250%'],
    scalpSensitivity: 'Normal',
    capSize: 'Medium (22.5")',
    loyaltyPoints: 1450,
    loyaltyTier: 'Gold VIP',
  };

  const [naturalTexture, setNaturalTexture] = useState(currentProfile.naturalHairTexture || '4C');
  const [capSize, setCapSize] = useState(currentProfile.capSize || 'Medium (22.5")');
  const [scalpSensitivity, setScalpSensitivity] = useState(currentProfile.scalpSensitivity || 'Normal');
  const [preferredStyles, setPreferredStyles] = useState<string[]>(currentProfile.preferredWigStyles || ['Bone Straight', 'HD Lace Closure']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const styleOptions = ['Bone Straight', 'Deep Wave', 'Body Wave', 'HD Lace Closure', 'Glueless 30-Sec Wig', 'Boho Knotless'];

  const toggleStyle = (style: string) => {
    if (preferredStyles.includes(style)) {
      setPreferredStyles(preferredStyles.filter((s) => s !== style));
    } else {
      setPreferredStyles([...preferredStyles, style]);
    }
  };

  const handleSave = () => {
    onSaveProfile({
      ...currentProfile,
      naturalHairTexture: naturalTexture,
      capSize,
      scalpSensitivity,
      preferredWigStyles: preferredStyles,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const loyaltyTier = currentProfile.loyaltyTier || 'Gold VIP';
  const loyaltyPoints = currentProfile.loyaltyPoints ?? 1450;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAEAEA] p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-full text-[#333] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Loyalty & Tier Status Card */}
        <div className="bg-gradient-to-br from-[#111111] via-[#1E1E1E] to-[#2B2418] text-white p-6 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs uppercase tracking-widest text-[#E5D7C2] font-semibold">
                FINE HAIR LUXE CLUB
              </span>
            </div>
            <span className="text-xs bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-medium">
              {loyaltyTier}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-[#AAA]">Reward Balance</span>
              <div className="text-3xl font-serif font-bold text-white mt-0.5">
                {loyaltyPoints.toLocaleString()} <span className="text-sm font-sans font-normal text-[#D4AF37]">Points</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-[#DDD]">
              <span>Next reward: <strong>Free Wig Spa Wash</strong> at 2,000 pts</span>
            </div>
          </div>

          {/* Perks Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-[10px] text-[#E0E0E0]">
            <div className="flex items-center space-x-1">
              <Gift className="w-3 h-3 text-[#D4AF37]" />
              <span>10% VIP Birthday Gift</span>
            </div>
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>Priority Stylist Booking</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Free Knot Bleaching</span>
            </div>
          </div>
        </div>

        {/* Beauty & Hair Preferences Form */}
        <div className="space-y-5">
          <div className="border-b border-[#EAEAEA] pb-3">
            <h2 className="editorial-title text-2xl text-[#111]">Personalized Hair Profile</h2>
            <p className="text-xs text-[#666]">
              Configuring your natural hairline and sizing ensures seamless recommendations without guesswork.
            </p>
          </div>

          {/* Natural Hair Texture */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111] uppercase tracking-wider block">
              Natural Hair Texture
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['4A', '4B', '4C', 'Relaxed', 'Locs'] as const).map((tex) => (
                <button
                  key={tex}
                  type="button"
                  onClick={() => setNaturalTexture(tex)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    naturalTexture === tex
                      ? 'border-black bg-black text-white'
                      : 'border-[#EAEAEA] bg-white text-[#333] hover:border-black'
                  }`}
                >
                  {tex}
                </button>
              ))}
            </div>
          </div>

          {/* Cap Size */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111] uppercase tracking-wider block">
              Wig Cap Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Small (21.5")', 'Medium (22.5")', 'Large (23.5")'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setCapSize(sz)}
                  className={`p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    capSize === sz
                      ? 'border-black bg-black text-white'
                      : 'border-[#EAEAEA] bg-white text-[#333] hover:border-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Scalp Sensitivity */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111] uppercase tracking-wider block">
              Scalp Sensitivity & Glue Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'Sensitive to Glue', 'Dry Scalp'] as const).map((sens) => (
                <button
                  key={sens}
                  type="button"
                  onClick={() => setScalpSensitivity(sens)}
                  className={`p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    scalpSensitivity === sens
                      ? 'border-[#B89758] bg-[#FAF6EE] text-[#8A6D3B] font-semibold'
                      : 'border-[#EAEAEA] bg-white text-[#333] hover:border-black'
                  }`}
                >
                  {sens}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Styles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111] uppercase tracking-wider block">
              Favorite Styles & Textures
            </label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((opt) => {
                const isSelected = preferredStyles.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleStyle(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-[#EAEAEA] bg-white text-[#444] hover:border-black'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
          <span className="text-xs text-[#888]">Updated in real-time</span>
          <button
            onClick={handleSave}
            className="bg-[#111111] hover:bg-black text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Profile Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
