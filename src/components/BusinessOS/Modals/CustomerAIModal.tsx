import React, { useState } from 'react';
import { BOSApprovalItem } from '../../../types/businessOS';
import { X, Sparkles, MessageSquare, Bot, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface CustomerAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAIModal: React.FC<CustomerAIModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Habari! I am the Fine Hair Concierge. What style, hair goals, or maintenance level are you looking for today?',
    },
    {
      sender: 'user',
      text: 'I have natural 4C hair and want a flat look with zero damage to my edges. What should I book?',
    },
    {
      sender: 'bot',
      text: 'I strongly recommend our signature "Fine Hair No Leave Out" (TZS 280,000, 3h). It provides full perimeter protection with custom braid foundation and zero leave-out required. Maria and Letisia specialize in low-tension edge protection.',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'bot',
        text: `Based on your request "${userText}", I suggest checking our approved service catalogue at Mikocheni B. Our stylists use medical-grade tension control and authentic raw Cambodian bundles. Would you like to proceed with a booking?`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0] flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Customer AI Concierge</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">“What service should I book?”</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#141214] text-white rounded-br-none'
                  : 'bg-white border border-[#e3dce0] text-[#141214] rounded-bl-none shadow-xs'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-[#fcf6ea] border border-[#e8dcc6] rounded-xl text-xs text-[#a46d22] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span><b>Strict Guardrail:</b> The AI concierge never invents non-approved services or rogue discounts.</span>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about wig care, installs, or hair types..."
            className="flex-1 border border-[#e3dce0] rounded-xl px-3 py-2 text-xs bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#141214] text-white text-xs font-semibold rounded-xl hover:bg-[#262226] cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

interface StaffAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffAIModal: React.FC<StaffAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Staff AI Assistant</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">“Prepare my daily report”</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5">
          <p className="text-xs text-[#716a70]">
            The Staff AI Assistant automates end-of-shift administrative burden by aggregating completed appointment records, service notes, and client reviews into a standardized draft.
          </p>

          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#141214] font-semibold border-b border-[#e3dce0] pb-1.5">
              <span>Shift Draft for Maria (Lead Stylist)</span>
              <span className="text-[#2e7d5a]">3 Services Completed</span>
            </div>
            <div className="text-[#716a70] space-y-1">
              <div>• 09:00 — Amina M. (No Leave Out) — Completed • Zero tension verified</div>
              <div>• 11:30 — Neema J. (Weaving Consultation) — Completed</div>
              <div>• 14:00 — Fatma S. (Lace Melting) — Completed • Client rating 5/5</div>
              <div>• Inventory alert: Requisitioned 2 melt bands for tomorrow morning</div>
            </div>
          </div>

          <div className="p-3 bg-[#eef8f3] border border-[#d6ede1] rounded-xl text-xs text-[#2e7d5a] flex items-start gap-2">
            <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <b>Employee Responsibility Guardrail:</b> The AI prepares the draft, but the employee must explicitly review, adjust, and sign off before submission to Management.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#141214] text-white text-sm font-medium hover:bg-[#262226] cursor-pointer"
            >
              Done Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ApprovalReviewModalProps {
  item: BOSApprovalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (item: BOSApprovalItem) => void;
  onReject: (item: BOSApprovalItem) => void;
  currentUser?: { id: string; name: string; role: string };
}

export const ApprovalReviewModal: React.FC<ApprovalReviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
  currentUser,
}) => {
  if (!isOpen || !item) return null;

  // Segregation of Duties checks:
  // 1. Employee cannot approve their own submission
  const isSelfSubmission = currentUser && (
    (item as any).requestedByUserId === currentUser.id ||
    item.requestedBy.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
  );
  // 2. Only Executive can sign off on price change, refund, or discount
  const hasExecutiveSignoffAuthority = currentUser?.role === 'Executive';
  const canApprove = !isSelfSubmission && hasExecutiveSignoffAuthority;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#ad8d58] font-bold block">Management Approval Centre</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">{item.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-xs text-[#716a70]">Submitted By:</span>
              <span className="font-semibold text-[#141214]">{item.requestedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#716a70]">Date:</span>
              <span className="font-semibold text-[#141214]">{item.date}</span>
            </div>
            {item.effectiveDate && (
              <div className="flex justify-between">
                <span className="text-xs text-[#716a70]">Effective Date:</span>
                <span className="font-semibold text-[#141214]">{item.effectiveDate}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#e3dce0]">
              <span className="text-xs text-[#716a70] block mb-1">Details:</span>
              <p className="font-medium text-[#141214]">{item.details}</p>
            </div>
            {item.reason && (
              <div className="pt-2 border-t border-[#e3dce0]">
                <span className="text-xs text-[#716a70] block mb-1">Justification:</span>
                <p className="text-xs text-[#716a70] leading-relaxed">{item.reason}</p>
              </div>
            )}
          </div>

          {/* Segregation of Duties Governance Warning */}
          {isSelfSubmission ? (
            <div className="p-3 bg-[#fbefef] border border-[#f5c6cb] rounded-xl text-xs text-[#a94646] flex items-start gap-2">
              <span className="font-bold">⚠️ Segregation of Duties Enforced:</span>
              <span>You requested this proposal ({item.requestedBy}). Governance rules strictly forbid approving your own requests. An independent Executive must sign off.</span>
            </div>
          ) : !hasExecutiveSignoffAuthority ? (
            <div className="p-3 bg-[#fcf6ea] border border-[#fae6be] rounded-xl text-xs text-[#a46d22] flex items-start gap-2">
              <span className="font-bold">🔒 Restricted Authority:</span>
              <span>Your active role ({currentUser?.role || 'Staff'}) lacks Executive sign-off privileges for pricing or financial items. Please switch to an Executive profile.</span>
            </div>
          ) : (
            <div className="p-3 bg-[#eef8f3] border border-[#d6ede1] rounded-xl text-xs text-[#2e7d5a] flex items-center gap-2">
              <span className="font-bold">✓ Dual-Control Verified:</span>
              <span>Executive authority validated. Independent sign-off permitted.</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                if (canApprove) {
                  onReject(item);
                  onClose();
                }
              }}
              disabled={!canApprove}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                canApprove
                  ? 'border-[#a94646] text-[#a94646] hover:bg-[#fbefef]'
                  : 'border-[#e3dce0] text-[#aaa1a8] cursor-not-allowed opacity-50'
              }`}
            >
              Reject Proposal
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#e3dce0] bg-white text-[#141214] font-medium text-sm hover:bg-[#f6f3f4] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (canApprove) {
                    onApprove(item);
                    onClose();
                  }
                }}
                disabled={!canApprove}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                  canApprove
                    ? 'bg-[#141214] text-white hover:bg-[#262226]'
                    : 'bg-[#e3dce0] text-[#716a70] cursor-not-allowed'
                }`}
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
