import React, { useState } from 'react';
import { UserAccount, api, setApiActiveSession, SessionRecord } from '../../../utils/apiClient';
import { X, ShieldCheck, Lock, CheckCircle2, KeyRound, Mail, Smartphone, Loader2 } from 'lucide-react';

interface AuthUserModalProps {
  isOpen: boolean;
  currentUser: UserAccount | null;
  onClose: () => void;
  onUserAuthenticated: (user: UserAccount) => void;
}

export const AuthUserModal: React.FC<AuthUserModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUserAuthenticated,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState(currentUser?.email || 'director@finehair.co.tz');
  const [password, setPassword] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (currentUser?.email) {
        setEmailOrPhone(currentUser.email);
      }
      setPassword('');
      setMfaCode('');
      setStep('credentials');
      setError(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      setError('Please provide your work email/phone and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.loginStaff(emailOrPhone.trim(), password);
      if (res.requiresMfa && res.challengeId) {
        setMfaChallengeId(res.challengeId);
        setStep('mfa');
        setMfaCode('');
      } else if (res.token && res.user && res.session) {
        setApiActiveSession(res.token, res.user, res.session);
        onUserAuthenticated(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 6) {
      setError('Please enter the 6-digit MFA token.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.verifyStaffMfa(mfaChallengeId, mfaCode);
      if (res.token && res.user && res.session) {
        setApiActiveSession(res.token, res.user, res.session);
        onUserAuthenticated(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'MFA token validation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e3dce0] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#141214] text-[#ad8d58] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">
                Access Governance & Permissions
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#141214]">
                Enterprise Staff Authentication
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#716a70] mb-4 leading-relaxed">
          Fine Hair enforces strict <b>Login → Verified Session Token → Authoritative RBAC → Segregation of Duties</b>.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#fbefef] border border-[#f5c6cb] rounded-xl text-xs text-[#a94646]">
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1.5 uppercase tracking-wider">
                Work Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#716a70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. director@finehair.co.tz"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#e3dce0] rounded-xl bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1.5 uppercase tracking-wider">
                Cryptographic Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#716a70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#e3dce0] rounded-xl bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#e3dce0] bg-white text-[#141214] font-medium text-xs hover:bg-[#f6f3f4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#141214] text-white font-semibold text-xs hover:bg-[#262226] transition-colors cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ad8d58]" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#ad8d58]" />
                )}
                <span>{loading ? 'Authenticating...' : 'Sign In & Issue Session'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyMfa} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#ad8d58] font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Privileged Role Step-Up MFA</span>
              </div>
              <h3 className="text-sm font-semibold text-[#141214]">
                Enter 6-Digit Authenticator Code
              </h3>
              <p className="text-xs text-[#716a70]">
                Executive Suite and Management roles require MFA authorization.
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
                className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl focus:bg-white focus:outline-[#9b627d]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs text-[#716a70] hover:text-black cursor-pointer"
              >
                ← Back to Password
              </button>
              <button
                type="submit"
                disabled={loading || mfaCode.length < 6}
                className="px-5 py-2.5 rounded-xl bg-[#141214] text-white font-semibold text-xs hover:bg-[#262226] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ad8d58]" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                )}
                <span>Verify Token</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
