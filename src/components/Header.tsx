import React from 'react';
import { EcosystemPerspective, AppPerspective, Language, CustomerHairProfile, StaffMember } from '../types';
import {
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Globe,
  User,
  ShieldCheck,
  ClipboardList,
  BookOpen,
  Crown,
  Search,
  Lock,
  LogOut,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  KeyRound,
} from 'lucide-react';
import { generateWhatsAppLink } from '../utils/formatters';
import { FineHairLogo } from './FineHairLogo';
import { UserAccount, SessionRecord } from '../utils/apiClient';

interface HeaderProps {
  currentPerspective: EcosystemPerspective | AppPerspective;
  activeRole: 'customer' | 'staff' | 'management';
  activeStaffMember?: StaffMember;
  currentUser?: UserAccount | null;
  currentSession?: SessionRecord | null;
  onSelectPerspective: (perspective: any) => void;
  onOpenRoleAccess: () => void;
  language: Language;
  onToggleLanguage: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenHairProfile: () => void;
  onOpenHairAdvisor: () => void;
  onOpenWhatsApp?: () => void;
  onOpenSearch?: () => void;
  userProfile?: CustomerHairProfile;
  customerTab?: 'home' | 'shop' | 'book' | 'learn' | 'profile';
  onSelectCustomerTab?: (tab: 'home' | 'shop' | 'book' | 'learn' | 'profile') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPerspective,
  activeRole,
  activeStaffMember,
  currentUser,
  currentSession,
  onSelectPerspective,
  onOpenRoleAccess,
  language,
  onToggleLanguage,
  cartCount,
  onOpenCart,
  onOpenHairProfile,
  onOpenHairAdvisor,
  onOpenWhatsApp,
  onOpenSearch,
  userProfile,
  customerTab = 'home',
  onSelectCustomerTab,
}) => {
  const loyaltyTier = userProfile?.loyaltyTier || 'Gold VIP';
  const loyaltyPoints = userProfile?.loyaltyPoints ?? 1450;

  const handleWhatsApp = () => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp();
    } else {
      window.open(
        generateWhatsAppLink(
          '+255754892110',
          'Habari Fine Hair! Naomba msaada kuhusu wigs, appointment au delivery ya Masaki/Mikocheni.'
        ),
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] transition-all">
      {/* 1. TOP STATUS & CONTEXT BAR */}
      {activeRole === 'management' ? (
        // Upper Management Banner
        <div className="bg-[#111111] text-[#FAFAFA] text-[11px] font-medium py-2 px-4 border-b border-[#222]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
              <span className="font-semibold tracking-wider text-[#D4AF37] uppercase flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UPPER MANAGEMENT EXECUTIVE SUITE</span>
              </span>
              <span className="text-[#666]">|</span>
              <span className="text-[#CCC]">Mikocheni B Headquarters & Inventory Hub (534 Units)</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSelectPerspective('staff')}
                className="text-[10px] bg-white/10 hover:bg-white/20 text-[#E5D7C2] px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                title="Inspect Staff Shift Workstations"
              >
                <ClipboardList className="w-3 h-3 text-[#D4AF37]" />
                <span>Staff Overview Mode</span>
              </button>
              <button
                onClick={onOpenRoleAccess}
                className="text-[10px] bg-[#B89758] hover:bg-[#A38345] text-black font-semibold px-3 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Switch Portal</span>
              </button>
              <button
                onClick={() => onSelectPerspective('customer')}
                className="text-[10px] text-[#BBB] hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                title="Preview Customer Storefront"
              >
                <Eye className="w-3 h-3" />
                <span>Customer View</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeRole === 'staff' ? (
        // Staff Stylist Workstation Banner
        <div className="bg-[#1C1A17] text-[#FAFAFA] text-[11px] font-medium py-2 px-4 border-b border-[#333]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              <span className="font-semibold text-[#E5D7C2] uppercase flex items-center space-x-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>STAFF WORKSTATION</span>
              </span>
              <span className="text-[#666]">|</span>
              <span className="text-white font-medium">
                Stylist: <strong className="text-[#D4AF37]">{activeStaffMember?.name || 'Farida Ally'}</strong> ({activeStaffMember?.role || 'Master Stylist'})
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenRoleAccess}
                className="text-[10px] bg-white/10 hover:bg-white/20 text-[#DDD] px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Switch Stylist / Shift</span>
              </button>
              <button
                onClick={() => onSelectPerspective('customer')}
                className="text-[10px] bg-[#B89758]/20 text-[#D4AF37] hover:bg-[#B89758]/30 px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit to Customer Store</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Default Customer Micro Bar
        <div className="bg-[#111111] text-[#FAFAFA] text-[11px] font-medium tracking-wider uppercase py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span>MIKOCHENI B, USSAGARA STREET • DAR ES SALAAM</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={onOpenHairProfile}
                className="flex items-center space-x-1.5 text-[#E5D7C2] hover:text-white transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">{loyaltyTier}</span>
                <span className="font-semibold text-white">({loyaltyPoints.toLocaleString()} pts)</span>
              </button>
              <span className="text-[#666]">|</span>
              <button
                onClick={onToggleLanguage}
                className="flex items-center space-x-1 text-[#EAEAEA] hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Badili Lugha / Switch Language"
              >
                <Globe className="w-3 h-3" />
                <span>{language === 'en' ? 'SW' : 'EN'}</span>
              </button>
              <span className="text-[#666]">|</span>
              {/* Discreet Staff & Management Portal Gate */}
              <button
                onClick={onOpenRoleAccess}
                className="flex items-center space-x-1 text-[#A5A5A5] hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Staff & Management Authorized Access"
              >
                <Lock className="w-3 h-3 text-[#888]" />
                <span className="text-[10px] font-normal lowercase tracking-normal">portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN BRAND & NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo Component */}
        <div
          onClick={() => {
            if (activeRole === 'customer') {
              if (onSelectCustomerTab) onSelectCustomerTab('home');
            } else {
              onSelectPerspective(activeRole);
            }
          }}
          className="cursor-pointer group flex items-center"
        >
          <FineHairLogo size="md" showSubtitle={true} variant="dark" />
        </div>

        {/* CUSTOMER PORTAL NAVIGATION */}
        {activeRole === 'customer' && (
          <nav className="hidden lg:flex items-center space-x-1 bg-[#F5F5F3] p-1 rounded-full border border-[#E5E5E0]">
            <button
              onClick={() => {
                onSelectPerspective('customer');
                if (onSelectCustomerTab) onSelectCustomerTab('home');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                customerTab === 'home'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {language === 'en' ? 'Atelier Home' : 'Mwanzo'}
            </button>
            <button
              onClick={() => {
                onSelectPerspective('customer');
                if (onSelectCustomerTab) onSelectCustomerTab('shop');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                customerTab === 'shop'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {language === 'en' ? 'Shop Wigs & Bundles' : 'Duka la Wigs & Bando'}
            </button>
            <button
              onClick={() => {
                onSelectPerspective('customer');
                if (onSelectCustomerTab) onSelectCustomerTab('book');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                customerTab === 'book'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {language === 'en' ? 'Book FineTouch Stylist' : 'Weka Nafasi ya Salon'}
            </button>
            <button
              onClick={() => {
                onSelectPerspective('customer');
                if (onSelectCustomerTab) onSelectCustomerTab('learn');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                customerTab === 'learn'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {language === 'en' ? 'Hair Academy & Care' : 'Utunzaji & Elimu'}
            </button>
          </nav>
        )}

        {/* STAFF WORKSTATION ACTIVE TITLE */}
        {activeRole === 'staff' && (
          <div className="hidden md:flex items-center space-x-2 bg-[#FAF6EE] border border-[#E5D7C2] px-4 py-1.5 rounded-full text-xs text-[#8A6D3B]">
            <span className="w-2 h-2 rounded-full bg-[#B89758]"></span>
            <span className="font-semibold">Stylist Station: Appointments, Check-ins & Daily Voice Reports</span>
          </div>
        )}

        {/* UPPER MANAGEMENT ACTIVE TITLE */}
        {activeRole === 'management' && (
          <div className="hidden md:flex items-center space-x-2 bg-[#111] text-white px-4 py-1.5 rounded-full text-xs font-medium border border-[#333]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Executive Business Intelligence & Master Inventory (534 Units)</span>
          </div>
        )}

        {/* ACTION CONTROLS */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#111111] hover:bg-[#F5F5F5] rounded-full border border-[#EAEAEA] transition-colors cursor-pointer"
              title="Search Products, Textures & Services"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* AI Hair Stylist Button */}
          <button
            onClick={onOpenHairAdvisor}
            className="flex items-center space-x-1.5 bg-[#F9F7F2] hover:bg-[#F0EBE0] text-[#111111] border border-[#E5D7C2] px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
            title="AI Hair Advisor & Recommendation"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B89758] animate-pulse" />
            <span className="hidden sm:inline font-normal">
              {language === 'en' ? 'AI Stylist' : 'Mshauri AI'}
            </span>
          </button>

          {/* WhatsApp Direct Concierge */}
          <button
            onClick={handleWhatsApp}
            className="p-2 text-[#25D366] hover:bg-[#F0FFF4] rounded-full border border-[#D1F2D9] transition-colors cursor-pointer"
            title="WhatsApp Concierge"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Customer Profile Trigger */}
          <button
            onClick={onOpenHairProfile}
            className="p-2 text-[#111111] hover:bg-[#F5F5F5] rounded-full border border-[#EAEAEA] transition-colors cursor-pointer"
            title="Hair Profile & Loyalty"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="relative p-2 bg-[#111111] text-white hover:bg-black rounded-full transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#111111] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
