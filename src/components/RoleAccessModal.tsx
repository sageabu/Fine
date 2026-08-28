import React, { useState } from 'react';
import { EcosystemPerspective, Language, StaffMember } from '../types';
import {
  ShieldCheck,
  ClipboardList,
  ShoppingBag,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  LogOut,
} from 'lucide-react';

interface RoleAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'customer' | 'staff' | 'management';
  activeStaffMember?: StaffMember;
  staffList: StaffMember[];
  onSelectRole: (role: 'customer' | 'staff' | 'management', staffId?: string) => void;
  language: Language;
}

export const RoleAccessModal: React.FC<RoleAccessModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  activeStaffMember,
  staffList = [],
  onSelectRole,
  language,
}) => {
  const [selectedTargetRole, setSelectedTargetRole] = useState<'customer' | 'staff' | 'management'>(
    currentRole === 'customer' ? 'management' : currentRole
  );
  const [pinCode, setPinCode] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(activeStaffMember?.id || staffList?.[0]?.id || 'staff-1');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  // Management PIN is 8899 (or demo bypass)
  // Staff PIN is 2024 (or demo stylist selector)
  const handleVerifyAndSwitch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (selectedTargetRole === 'customer') {
      setSuccessMessage('Switched to Customer App');
      setTimeout(() => {
        onSelectRole('customer');
        onClose();
      }, 400);
      return;
    }

    if (selectedTargetRole === 'management') {
      if (pinCode.trim() === '8899' || pinCode.trim() === 'admin' || pinCode.trim() === 'director') {
        setSuccessMessage('Upper Management Access Granted. Welcome, Salon Director.');
        setTimeout(() => {
          onSelectRole('management');
          onClose();
        }, 500);
      } else {
        setErrorMessage(
          language === 'en'
            ? 'Invalid Upper Management PIN. (Hint: Use 8899 or click 1-Click Demo)'
            : 'PIN ya Uongozi si sahihi. (Tumia 8899 au bonyeza Demo ya Haraka)'
        );
      }
      return;
    }

    if (selectedTargetRole === 'staff') {
      if (pinCode.trim() === '2024' || pinCode.trim() === 'staff' || pinCode.trim() === '') {
        const staff = staffList.find((s) => s.id === selectedStaffId) || staffList?.[0];
        setSuccessMessage(`Staff Workstation unlocked for ${staff?.name || 'Staff'}.`);
        setTimeout(() => {
          onSelectRole('staff', selectedStaffId);
          onClose();
        }, 500);
      } else {
        setErrorMessage(
          language === 'en'
            ? 'Invalid Staff Passcode. (Hint: Use 2024 or click 1-Click Stylist Access)'
            : 'Nenosiri la mfanyakazi si sahihi. (Tumia 2024 au chagua mfanyakazi)'
        );
      }
    }
  };

  const handleQuickDemoAccess = (role: 'customer' | 'staff' | 'management', staffId?: string) => {
    setErrorMessage('');
    if (role === 'management') {
      setPinCode('8899');
      setSelectedTargetRole('management');
      setSuccessMessage('Upper Management Access Authenticated (Executive Suite)');
      setTimeout(() => {
        onSelectRole('management');
        onClose();
      }, 400);
    } else if (role === 'staff') {
      const chosenStaffId = staffId || selectedStaffId || 'staff-1';
      const staff = staffList.find((s) => s.id === chosenStaffId) || staffList?.[0];
      setPinCode('2024');
      setSelectedTargetRole('staff');
      setSelectedStaffId(chosenStaffId);
      setSuccessMessage(`Logged in as ${staff?.name || 'Staff'} (${staff?.role || 'Stylist'})`);
      setTimeout(() => {
        onSelectRole('staff', chosenStaffId);
        onClose();
      }, 400);
    } else {
      setSelectedTargetRole('customer');
      setSuccessMessage('Switched to Customer Store & Booking');
      setTimeout(() => {
        onSelectRole('customer');
        onClose();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B89758]/20 border border-[#B89758]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-medium tracking-tight">
                {language === 'en' ? 'Fine Hair Role & Portal Access' : 'Mfumo wa Milango & Idhini za Watumiaji'}
              </h2>
              <p className="text-[11px] text-[#A5A5A5]">
                {language === 'en'
                  ? 'Strict access barrier between Customers, Stylists & Management'
                  : 'Ulinzi thabiti unaotenganisha Wateja, Wafanyakazi na Uongozi'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portal Selection Tabs */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F5F3] rounded-xl border border-[#E5E5E0]">
            {/* Customer Portal */}
            <button
              type="button"
              onClick={() => {
                setSelectedTargetRole('customer');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                selectedTargetRole === 'customer'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-black'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#B89758]" />
              <span>{language === 'en' ? 'Customer' : 'Mteja'}</span>
              <span className="text-[9px] text-[#888] font-normal">Public View</span>
            </button>

            {/* Staff Workstation */}
            <button
              type="button"
              onClick={() => {
                setSelectedTargetRole('staff');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                selectedTargetRole === 'staff'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-black'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-[#B89758]" />
              <span>{language === 'en' ? 'Staff Stylist' : 'Mfanyakazi'}</span>
              <span className="text-[9px] text-[#888] font-normal">Workstation</span>
            </button>

            {/* Upper Management */}
            <button
              type="button"
              onClick={() => {
                setSelectedTargetRole('management');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                selectedTargetRole === 'management'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-black'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#B89758]" />
              <span>{language === 'en' ? 'Management' : 'Uongozi'}</span>
              <span className="text-[9px] text-[#888] font-normal">Executive BI</span>
            </button>
          </div>

          {/* Role Access Scope Info */}
          <div className="bg-[#FAF9F5] border border-[#E8DECC] rounded-xl p-3.5 text-xs text-[#555] space-y-1.5">
            {selectedTargetRole === 'customer' && (
              <>
                <div className="flex items-center space-x-1.5 font-semibold text-[#111]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                  <span>Customer Experience Scope:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#666]">
                  Full access to 4C/Raw Wigs & Bundles shop, FineTouch booking, AI Hair Stylist Advisor, hair profile, and Academy. Zero access to backend staff tasks or owner financial ledgers.
                </p>
              </>
            )}

            {selectedTargetRole === 'staff' && (
              <>
                <div className="flex items-center space-x-1.5 font-semibold text-[#111]">
                  <CheckCircle2 className="w-4 h-4 text-[#B89758]" />
                  <span>Staff Stylist Workstation Scope:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#666]">
                  Personal shift schedule, today's client appointment check-ins, hair/scalp notes, end-of-day Swahili voice report submission, and personal commission tracking. Cannot edit product master pricing or see company P&L.
                </p>
              </>
            )}

            {selectedTargetRole === 'management' && (
              <>
                <div className="flex items-center space-x-1.5 font-semibold text-[#111]">
                  <ShieldCheck className="w-4 h-4 text-[#B89758]" />
                  <span>Upper Management Executive Scope:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#666]">
                  Executive Overview, Financial P&L & Revenue, Master Catalog Pricing Controls, Inventory Control (534 Units) & Floor Audits, Stock Reconciliation & Exception Approvals, Staff Shift & Voice Reports Overview.
                </p>
              </>
            )}
          </div>

          {/* Form & PIN Input */}
          <form onSubmit={handleVerifyAndSwitch} className="space-y-4">
            {selectedTargetRole === 'staff' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#333]">
                  {language === 'en' ? 'Select Stylist Shift Identity:' : 'Chagua Mfanyakazi / Stylist:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {staffList.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStaffId(st.id)}
                      className={`p-2 rounded-lg border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                        selectedStaffId === st.id
                          ? 'border-[#B89758] bg-[#FAF6EE] text-[#111]'
                          : 'border-[#EAEAEA] bg-white text-[#666] hover:bg-[#F9F9F9]'
                      }`}
                    >
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#EAEAEA]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#111] truncate">{st.name.split(' ')[0]}</p>
                        <p className="text-[9px] text-[#888] truncate">{st.role.split(' ')[0]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTargetRole !== 'customer' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#333]">
                    {selectedTargetRole === 'management'
                      ? language === 'en' ? 'Upper Management PIN:' : 'PIN ya Mkurugenzi / Uongozi:'
                      : language === 'en' ? 'Stylist Passcode (or use 1-click):' : 'Nenosiri la Mfanyakazi:'}
                  </label>
                  <span className="text-[10px] text-[#888]">
                    {selectedTargetRole === 'management' ? 'Default: 8899' : 'Default: 2024'}
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#888] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder={selectedTargetRole === 'management' ? 'Enter 8899' : 'Enter 2024'}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm font-mono tracking-widest text-[#111] focus:outline-hidden focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]"
                  />
                </div>
              </div>
            )}

            {/* Error / Success Feedback */}
            {errorMessage && (
              <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center space-x-2 text-xs text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#25D366]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>
                  {selectedTargetRole === 'customer'
                    ? 'Enter Customer Store & Booking'
                    : selectedTargetRole === 'staff'
                    ? 'Unlock Stylist Workstation'
                    : 'Authenticate Upper Management Suite'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              {/* Quick 1-Click Switchers for Verification */}
              <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] text-[#666]">
                <span className="font-medium text-[#444]">Quick Verification:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoAccess('customer')}
                    className="px-2.5 py-1 bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#333] rounded-md font-medium transition-colors cursor-pointer"
                  >
                    Customer View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoAccess('staff', 'staff-1')}
                    className="px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#F0EAD8] text-[#8A6D3B] rounded-md font-medium border border-[#E5D7C2] transition-colors cursor-pointer"
                  >
                    Staff (Farida)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoAccess('management')}
                    className="px-2.5 py-1 bg-[#111] hover:bg-black text-[#D4AF37] rounded-md font-medium transition-colors cursor-pointer"
                  >
                    Director PIN
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
