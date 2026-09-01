import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  LogOut,
  Mail,
  Loader2,
  Smartphone,
  Key,
  UserCheck,
  Play,
  Building2,
  Users,
  Award,
} from 'lucide-react';
import { api, setApiActiveSession, UserAccount, SessionRecord } from '../utils/apiClient';

interface RoleAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  currentSession: SessionRecord | null;
  onAuthenticated: (user: UserAccount, session: SessionRecord) => void;
  onLoggedOut: () => void;
  language: Language;
}

export const RoleAccessModal: React.FC<RoleAccessModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthenticated,
  onLoggedOut,
  language,
}) => {
  const [tab, setTab] = useState<'login' | 'mfa' | 'quick_switch' | 'profile' | 'bootstrap' | 'security_tests'>('quick_switch');

  // Login Form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  // Bootstrap Form
  const [cfoName, setCfoName] = useState('CFO Lilian');
  const [cfoPhone, setCfoPhone] = useState('+255 742 023 057');
  const [cfoPassword, setCfoPassword] = useState('FineHair@Lilian2026!');
  const [confirmCfoPassword, setConfirmCfoPassword] = useState('FineHair@Lilian2026!');

  // Security Test Suite
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.role !== 'Customer') {
      setTab('profile');
    } else {
      setTab('quick_switch');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage(language === 'en' ? 'Please enter your work email/phone and password.' : 'Weka barua pepe/simu na nenosiri.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.loginStaff(identifier.trim(), password);
      if (res.requiresMfa && res.challengeId) {
        setMfaChallengeId(res.challengeId);
        setTab('mfa');
        setMfaCode('');
        setSuccessMessage(res.message || 'MFA step-up verification required.');
      } else if (res.token && res.user && res.session) {
        setApiActiveSession(res.token, res.user, res.session);
        onAuthenticated(res.user, res.session);
        setSuccessMessage(`Welcome back, ${res.user.name} (${res.user.role})`);
        setTimeout(() => onClose(), 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials or account suspended.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.loginStaff(email, pass);
      if (res.requiresMfa && res.challengeId) {
        setMfaChallengeId(res.challengeId);
        setTab('mfa');
        setMfaCode('123456');
        setSuccessMessage('MFA step-up required. Default OTP 123456 pre-filled for authorization review.');
      } else if (res.token && res.user && res.session) {
        setApiActiveSession(res.token, res.user, res.session);
        onAuthenticated(res.user, res.session);
        setSuccessMessage(`Enterprise session established for ${res.user.name} (${res.user.role})`);
        setTimeout(() => onClose(), 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 6) {
      setErrorMessage(language === 'en' ? 'Please enter the 6-digit MFA token.' : 'Weka kodi ya MFA tarakimu 6.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.verifyStaffMfa(mfaChallengeId, mfaCode);
      if (res.token && res.user && res.session) {
        setApiActiveSession(res.token, res.user, res.session);
        onAuthenticated(res.user, res.session);
        setSuccessMessage(`Privileged access verified. Welcome, ${res.user.name}`);
        setTimeout(() => onClose(), 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'MFA validation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cfoPassword !== confirmCfoPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.bootstrapOrganization({
        cfoName,
        cfoPhone,
        cfoPassword,
        confirmPassword: confirmCfoPassword,
      });
      setSuccessMessage(res.message || 'Organization initialized successfully!');
      setTimeout(() => handleQuickLogin('lilian@finehair.co.tz', cfoPassword), 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Bootstrap failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSecurityTests = async () => {
    setIsRunningTests(true);
    try {
      const report = await api.runSecurityTestSuite();
      setTestResults(report);
    } catch (err: any) {
      setErrorMessage('Failed to run security tests: ' + err.message);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      onLoggedOut();
      setTab('quick_switch');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5D7C2]/40 text-[#121212]">
        {/* Header */}
        <div className="p-6 border-b border-[#EAEAEA] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-serif font-bold text-[#111]">FineHair Textures</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111] text-[#D4AF37] uppercase tracking-wider">
                  Mikocheni B, Usagara Street, Tanzania
                </span>
              </div>
              <p className="text-xs text-[#666]">
                Authoritative IAM, RBAC & Organization Access Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#666] hover:bg-[#EAEAEA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EAEAEA] bg-[#FAF9F6]/50 px-6 gap-2 pt-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setTab('quick_switch'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'quick_switch' ? 'border-[#111] text-[#111] font-bold' : 'border-transparent text-[#777] hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Authorized Accounts</span>
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'login' ? 'border-[#111] text-[#111] font-bold' : 'border-transparent text-[#777] hover:text-black'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Direct Sign-In</span>
          </button>
          {currentUser && currentUser.role !== 'Customer' && (
            <button
              onClick={() => { setTab('profile'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                tab === 'profile' ? 'border-[#111] text-[#111] font-bold' : 'border-transparent text-[#777] hover:text-black'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Current Session ({currentUser.role})</span>
            </button>
          )}
          <button
            onClick={() => { setTab('bootstrap'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'bootstrap' ? 'border-[#111] text-[#111] font-bold' : 'border-transparent text-[#777] hover:text-black'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organization Setup</span>
          </button>
          <button
            onClick={() => { setTab('security_tests'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              tab === 'security_tests' ? 'border-[#111] text-[#111] font-bold' : 'border-transparent text-[#777] hover:text-black'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Security Suite (Part 55)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center space-x-2 p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#25D366]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: AUTHORIZED ACCOUNTS (QUICK SWITCH) */}
          {tab === 'quick_switch' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111]">
                  Authoritative Leadership & Staff Directory
                </h3>
                <p className="text-xs text-[#666]">
                  Select an authorized profile to authenticate with verified roles, MFA protection, and real permissions.
                </p>
              </div>

              {/* Decision Authorities */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#999] flex items-center justify-between">
                  <span>Decision Authorities (Executive & Operations)</span>
                  <span className="text-[#D4AF37]">Sign-Off Privileges</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* CFO Lilian */}
                  <div className="p-3.5 rounded-xl border border-[#E5D7C2] bg-[#FAF9F6] hover:border-black transition-all flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111]">CFO Lilian</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#111] text-[#D4AF37]">Executive</span>
                      </div>
                      <p className="text-[11px] text-[#666] mt-0.5">lilian@finehair.co.tz</p>
                      <p className="text-[10px] text-[#888]">Chief Financial Officer</p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin('lilian@finehair.co.tz', 'FineHair@Lilian2026!')}
                      disabled={isLoading}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#111] hover:bg-black text-white text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </button>
                  </div>

                  {/* CFO Collins */}
                  <div className="p-3.5 rounded-xl border border-[#E5D7C2] bg-[#FAF9F6] hover:border-black transition-all flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111]">CFO Collins</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#111] text-[#D4AF37]">Executive</span>
                      </div>
                      <p className="text-[11px] text-[#666] mt-0.5">collins@finehair.co.tz</p>
                      <p className="text-[10px] text-[#888]">Executive Controller</p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin('collins@finehair.co.tz', 'FineHair@Collins2026!')}
                      disabled={isLoading}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#111] hover:bg-black text-white text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </button>
                  </div>

                  {/* Manager Razaq */}
                  <div className="p-3.5 rounded-xl border border-[#E5D7C2] bg-[#FAF9F6] hover:border-black transition-all flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111]">Manager Razaq</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-900 text-blue-100">Manager</span>
                      </div>
                      <p className="text-[11px] text-[#666] mt-0.5">razaq@finehair.co.tz</p>
                      <p className="text-[10px] text-[#888]">Salon Operations</p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin('razaq@finehair.co.tz', 'FineHair@Razaq2026!')}
                      disabled={isLoading}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#111] hover:bg-black text-white text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Certified Stylists */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#999] flex items-center justify-between">
                  <span>Authorized Stylists (19 Atelier Artists)</span>
                  <span className="text-xs text-[#555]">Mikocheni B, Usagara Street, Tanzania</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Jennipher', specialty: 'Revier Blowdry & Knots', phone: '+255 742 101 001' },
                    { name: 'Judy', specialty: 'Silk Press & Scalp Care', phone: '+255 742 101 002' },
                    { name: 'Furaha', specialty: 'Braids & Micro Twists', phone: '+255 742 101 003' },
                    { name: 'Lilian Zado', specialty: 'Weave & No Leave Out', phone: '+255 742 101 005' },
                    { name: 'Lilian John', specialty: 'Weave & Wig Revamp', phone: '+255 742 101 006' },
                    { name: 'Morris', specialty: 'Dreadlocks Extensions', phone: '+255 742 101 009' },
                    { name: 'Koku', specialty: 'V-Light & Weaves', phone: '+255 742 101 010' },
                    { name: 'Abbigail', specialty: 'V-Light & Locs', phone: '+255 742 101 019' },
                  ].map((st) => (
                    <div
                      key={st.name}
                      onClick={() => handleQuickLogin(st.phone, 'Password123!')}
                      className="p-2.5 rounded-lg border border-[#EAEAEA] bg-white hover:border-[#111] transition-all cursor-pointer text-left space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111]">{st.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#F0EBE0] text-[#777]">Stylist</span>
                      </div>
                      <p className="text-[10px] text-[#666] line-clamp-1">{st.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIRECT SIGN-IN */}
          {tab === 'login' && (
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#111]">
                  Manual Enterprise Sign-In
                </h3>
                <p className="text-xs text-[#666]">
                  Enter your official email or phone number and cryptographic password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Work Email / Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#999] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="lilian@finehair.co.tz"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Secure Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#999] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <span>Authenticate Enterprise Session</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB: MFA VERIFICATION */}
          {tab === 'mfa' && (
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1 text-xs text-[#B89758] font-bold uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Step-Up Multi-Factor Authentication</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111]">
                  Enter 6-Digit Authenticator Token
                </h3>
                <p className="text-xs text-[#666]">
                  Privileged roles (CFOs & Managers) require step-up token verification to issue signed session credentials.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 bg-[#FAF9F6] border border-[#E0DACE] rounded-xl focus:bg-white focus:border-black outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || mfaCode.length < 6}
                className="w-full bg-[#111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#25D366]" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    <span>Verify Token & Establish Session</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB: ACTIVE PROFILE */}
          {tab === 'profile' && currentUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5 p-3.5 bg-[#FAF9F6] border border-[#E8DECC] rounded-xl">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-[#111]">{currentUser.name}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#111] text-[#D4AF37]">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#666]">{currentUser.email || currentUser.phone}</p>
                  <p className="text-[11px] text-[#888]">FineHair Textures • Mikocheni B, Usagara Street, Tanzania</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#333] uppercase tracking-wider">
                  Authoritative Permissions ({currentUser.permissions?.length || 0})
                </h5>
                <div className="max-h-32 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl flex flex-wrap gap-1.5">
                  {currentUser.permissions?.map((p) => (
                    <span key={p} className="px-2 py-0.5 text-[10px] font-mono rounded bg-white border border-[#DDD] text-[#444]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Enterprise Session</span>
              </button>
            </div>
          )}

          {/* TAB: BOOTSTRAP ORGANIZATION */}
          {tab === 'bootstrap' && (
            <form onSubmit={handleBootstrap} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111]">
                  Organization Bootstrap & Leadership Provisioning
                </h3>
                <p className="text-xs text-[#666]">
                  Configure official CFO authority and master credentials for FineHair Textures (Mikocheni B, Usagara Street, Tanzania).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">
                    CFO Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cfoName}
                    onChange={(e) => setCfoName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3 py-2 text-xs text-[#111] focus:bg-white focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={cfoPhone}
                    onChange={(e) => setCfoPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3 py-2 text-xs text-[#111] focus:bg-white focus:border-black outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">
                    Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={cfoPassword}
                    onChange={(e) => setCfoPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3 py-2 text-xs text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmCfoPassword}
                    onChange={(e) => setConfirmCfoPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3 py-2 text-xs text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Initialize Authoritative Leadership</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB: AUTOMATED SECURITY TEST SUITE (PART 55) */}
          {tab === 'security_tests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111]">
                    Automated Production & Security Test Suite (Part 55)
                  </h3>
                  <p className="text-xs text-[#666]">
                    Live execution of all 20 critical security, concurrency, and RBAC verification tests.
                  </p>
                </div>
                <button
                  onClick={handleRunSecurityTests}
                  disabled={isRunningTests}
                  className="px-3.5 py-2 rounded-xl bg-[#111] hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isRunningTests ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-[#25D366]" />
                  )}
                  <span>Run 20 Tests</span>
                </button>
              </div>

              {testResults && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl text-xs">
                    <span className="font-semibold text-[#111]">
                      Status: {testResults.allPassed ? '✅ ALL 20 TESTS PASSED' : `⚠️ ${testResults.failedCount} FAILED`}
                    </span>
                    <span className="text-[#666]">
                      {testResults.passedCount} / {testResults.totalTests} Verified
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {testResults.results?.map((t: any) => (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-lg border text-xs ${
                          t.passed ? 'bg-green-50/50 border-green-200 text-green-900' : 'bg-red-50/50 border-red-200 text-red-900'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>
                            {t.id}. {t.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-white border">
                            {t.passed ? 'PASS' : 'FAIL'} ({t.executionTimeMs}ms)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555] mt-1">{t.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
