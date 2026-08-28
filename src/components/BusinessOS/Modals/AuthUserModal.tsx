import React, { useState } from 'react';
import { UserAccount, api, setApiActiveUser } from '../../../utils/apiClient';
import { X, ShieldCheck, Lock, CheckCircle2, User, KeyRound } from 'lucide-react';

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
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(currentUser);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      api.getUsers().then((u) => {
        setUsers(u);
        if (!selectedUser && u.length > 0) {
          setSelectedUser(u[0]);
        }
      }).catch(console.error);
      setPin('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    setError(null);

    try {
      // If user typed PIN or wants one-click fast pass with default pin
      const pinToUse = pin || selectedUser.pin;
      const res = await api.login(selectedUser.email, pinToUse);
      if (res.user) {
        setApiActiveUser(res.user.id);
        onUserAuthenticated(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
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
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3dce0] animate-in fade-in zoom-in-95 duration-150"
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
                Switch Authenticated User
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
          Fine Hair enforces strict <b>Login → Role → Permissions → Data Access</b> and <b>Segregation of Duties</b>. Employees cannot approve their own price changes, discounts, or refunds.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#fbefef] border border-[#f5c6cb] rounded-xl text-xs text-[#a94646]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-2 uppercase tracking-wider">
              Select Salon Professional / Executive Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setPin(u.pin);
                    }}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#9b627d] bg-[#efe7eb]/40 shadow-xs'
                        : 'border-[#e3dce0] bg-[#faf9fa] hover:bg-white hover:border-[#ad8d58]'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#e3dce0]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-[#141214] truncate flex items-center justify-between">
                        <span>{u.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#9b627d] shrink-0" />}
                      </div>
                      <div className="text-[10px] text-[#9b627d] font-medium uppercase tracking-wide">
                        {u.role}
                      </div>
                      <div className="text-[10px] text-[#716a70] truncate mt-0.5">{u.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedUser && (
            <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#716a70] font-medium">Authorizations for this role:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#efe7eb] text-[#9b627d]">
                  {selectedUser.permissions.length} Permissions Active
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedUser.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#e3dce0] text-[10px] text-[#141214] font-mono"
                  >
                    {perm}
                  </span>
                ))}
              </div>
              {selectedUser.role === 'Executive' ? (
                <div className="text-[11px] text-[#2e7d5a] font-medium pt-1">
                  ✓ Full Executive Authority: Can sign off on service prices, refunds, and financial reconciliations.
                </div>
              ) : (
                <div className="text-[11px] text-[#a46d22] font-medium pt-1">
                  ⚠️ Segregation of Duties: This role cannot sign off on self-submitted proposals or price edits.
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Security PIN / Fast Pass</span>
              <span className="text-[10px] font-normal normal-case text-[#ad8d58]">
                Auto-filled for selected account
              </span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#716a70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#e3dce0] rounded-xl bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d] font-mono tracking-widest"
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
              <Lock className="w-3.5 h-3.5 text-[#ad8d58]" />
              <span>{loading ? 'Authenticating...' : `Authenticate as ${selectedUser?.name || 'User'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
