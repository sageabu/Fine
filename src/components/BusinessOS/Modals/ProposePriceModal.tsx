import React, { useState } from 'react';
import { BOSService, BOSApprovalItem } from '../../../types/businessOS';
import { X, ShieldAlert, Tag, Calendar, AlertCircle } from 'lucide-react';

interface ProposePriceModalProps {
  services?: BOSService[];
  preselectedServiceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (proposal: BOSApprovalItem) => void;
}

export const ProposePriceModal: React.FC<ProposePriceModalProps> = ({
  services = [],
  preselectedServiceId,
  isOpen,
  onClose,
  onSubmitProposal,
}) => {
  const initialService = (services || []).find((s) => s.id === preselectedServiceId) || services?.[0];
  const [selectedServiceId, setSelectedServiceId] = useState(initialService?.id || '');
  const currentService = (services || []).find((s) => s.id === selectedServiceId) || initialService;

  const [proposedPrice, setProposedPrice] = useState<number>(currentService ? currentService.currentPrice + 20000 : 300000);
  const [effectiveDate, setEffectiveDate] = useState('2026-09-01');
  const [reason, setReason] = useState('Increased cost of specialized needle-free threading and hypoallergenic scalp balm.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;

    const newApproval: BOSApprovalItem = {
      id: `appr-${Date.now()}`,
      title: `Price change — ${currentService.name}`,
      type: 'price_change',
      requestedBy: 'Service Manager',
      details: `${currentService.currentPrice.toLocaleString()} → ${proposedPrice.toLocaleString()} • Effective ${effectiveDate}`,
      serviceId: currentService.id,
      currentValue: currentService.currentPrice,
      proposedValue: proposedPrice,
      effectiveDate,
      reason,
      date: '2026-08-28',
      status: 'Pending',
    };

    onSubmitProposal(newApproval);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#ad8d58] font-bold block">Controlled Change</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Propose a Price Change</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Service</label>
            <select
              value={selectedServiceId}
              onChange={(e) => {
                const sId = e.target.value;
                setSelectedServiceId(sId);
                const s = services.find((srv) => srv.id === sId);
                if (s) setProposedPrice(s.currentPrice + 20000);
              }}
              className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Current TZS {s.currentPrice.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Current Price (TZS)</label>
              <input
                type="text"
                disabled
                value={currentService ? currentService.currentPrice.toLocaleString() : ''}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#f6f3f4] text-[#716a70]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Proposed Price (TZS)</label>
              <input
                type="number"
                step="5000"
                required
                value={proposedPrice}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Effective Date</label>
            <input
              type="date"
              required
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Business Justification / Reason</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for change (e.g. material costs, inflation, premium technique)"
              className="w-full border border-[#e3dce0] rounded-xl p-2.5 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div className="p-3 bg-[#fcf6ea] border border-[#e8dcc6] rounded-xl text-xs text-[#a46d22] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <b>Governance Note:</b> This creates a structured proposal in the Management Approval Queue. It will NOT publish or alter customer billing until an authorized Executive approves it.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e3dce0] bg-white text-[#141214] font-medium text-sm hover:bg-[#f6f3f4] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#9b627d] text-white font-medium text-sm hover:bg-[#854f68] transition-colors cursor-pointer"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
