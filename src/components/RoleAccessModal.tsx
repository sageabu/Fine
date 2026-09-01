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
  Sparkles,
  LogOut,
  Mail,
  Loader2,
  Smartphone,
  Key,
  UserCheck,
  RefreshCw,
  Clock,
  Laptop,
} from 'lucide-react';
import { api, setApiActiveSession, clearApiSession, UserAccount, SessionRecord, getStoredUser, getStoredSession } from '../utils/apiClient';

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
  currentSession,
  onAuthenticated,
  onLoggedOut,
  language,
}) => {
  const [tab, setTab] = useState<'login' | 'mfa' | 'profile' | 'change_password' | 'activate'>('login');
  
  // Login Form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  // Password Change Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Invitation Activation Form
  const [inviteToken, setInviteToken] = useState('');
  const [invitePassword, setInvitePassword] = useState('');

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.role !== 'Customer') {
      setTab('profile');
    } else {
      setTab('login');
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
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials or account suspended.');
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
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'MFA validation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    if (newPass.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.changePassword(currentPass, newPass);
      setSuccessMessage('Password successfully updated.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setTab('profile'), 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken.trim() || invitePassword.length < 8) {
      setErrorMessage('Valid token and password of at least 8 characters required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.acceptInvitation(inviteToken.trim(), invitePassword);
      setSuccessMessage(res.message || 'Account activated. Please log in.');
      setTab('login');
      setIdentifier(res.user?.email || '');
      setPassword(invitePassword);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to activate invitation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      onLoggedOut();
      setTab('login');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoading(true);
    try {
      await api.logoutAllDevices();
      onLoggedOut();
      setTab('login');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B89758]/20 border border-[#B89758]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-medium tracking-tight">
                Fine Hair Enterprise Identity & Access Management
              </h2>
              <p className="text-[11px] text-[#A5A5A5]">
                Authoritative Session Security & Server-Side RBAC Enforcement
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EAEAEA] bg-[#FAF9F6] text-xs font-semibold px-4 pt-3 space-x-2">
          {!currentUser || currentUser.role === 'Customer' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  tab === 'login' || tab === 'mfa' ? 'border-[#111] text-[#111]' : 'border-transparent text-[#777] hover:text-black'
                }`}
              >
                Staff Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('activate');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  tab === 'activate' ? 'border-[#111] text-[#111]' : 'border-transparent text-[#777] hover:text-black'
                }`}
              >
                Activate Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setTab('profile');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  tab === 'profile' ? 'border-[#111] text-[#111]' : 'border-transparent text-[#777] hover:text-black'
                }`}
              >
                Active Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('change_password');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  tab === 'change_password' ? 'border-[#111] text-[#111]' : 'border-transparent text-[#777] hover:text-black'
                }`}
              >
                Change Password
              </button>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#25D366]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: STAFF LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#111]">
                  Staff & Executive Suite Sign-In
                </h3>
                <p className="text-xs text-[#666]">
                  Enter your official email or phone number and secure cryptographic password.
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
                    placeholder="director@finehair.co.tz"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
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
              </div>
            </form>
          )}

          {/* TAB 2: STEP-UP MFA */}
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
                  Privileged roles (Executive/Manager) require step-up token verification to issue signed session credentials.
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
                className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
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

          {/* TAB 3: ACTIVE SESSION PROFILE & PERMISSIONS */}
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
                  <p className="text-xs text-[#666]">{currentUser.email}</p>
                  <p className="text-[11px] text-[#888]">{currentUser.department || 'Fine Hair Atelier'} • {currentUser.branchId || 'Mikocheni B'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#333] uppercase tracking-wider">
                  Authoritative Permissions ({currentUser.permissions.length})
                </h5>
                <div className="max-h-32 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl flex flex-wrap gap-1.5">
                  {currentUser.permissions.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 text-[10px] font-mono bg-white border border-[#DDD] rounded-md text-[#444]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {currentSession && (
                <div className="p-3 bg-[#F5F5F5] rounded-xl text-[11px] text-[#555] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Session Token Status:</span>
                    <span className="font-semibold text-green-700 uppercase">{currentSession.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expires At:</span>
                    <span className="font-mono text-[#333]">{new Date(currentSession.expiresAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Current Device</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogoutAll}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl border border-red-400 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Revoke All Sessions</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CHANGE PASSWORD */}
          {tab === 'change_password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#111]">
                  Change Account Password
                </h3>
                <p className="text-xs text-[#666]">
                  Ensure your new password contains at least 8 characters.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <Key className="w-4 h-4 text-[#D4AF37]" />
                    <span>Update Account Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 5: ACTIVATE INVITATION */}
          {tab === 'activate' && (
            <form onSubmit={handleAcceptInvite} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#111]">
                  Staff Onboarding & Activation
                </h3>
                <p className="text-xs text-[#666]">
                  Enter the invitation token received from management and set your initial password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Invitation Token
                </label>
                <input
                  type="text"
                  required
                  placeholder="inv_..."
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">
                  Create New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:bg-white focus:border-black outline-hidden font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#25D366]" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-[#25D366]" />
                    <span>Activate Staff Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
