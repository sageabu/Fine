import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

interface AICampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export const AICampaignModal: React.FC<AICampaignModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [message, setMessage] = useState(
    'Habari! It may be time for your next Fine Hair maintenance appointment at Mikocheni B. We have saved your custom styling & texture preferences on file. Would you like us to reserve your preferred stylist for this upcoming weekend?'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">AI CRM Insight</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Rebooking Campaign Draft</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#141214]">Target Audience:</span>
              <span className="px-2 py-0.5 rounded-full bg-[#efe7eb] text-[#9b627d] font-bold">34 High-Value VIP Clients</span>
            </div>
            <p className="text-[#716a70]">
              Clients who haven't visited in 45+ days and regularly book high-margin services (No Leave Out, Traditional Knots, Weaving).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1.5 uppercase tracking-wider">Generated WhatsApp Rebooking Copy</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-[#e3dce0] rounded-xl p-3 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div className="p-3 bg-[#eef8f3] border border-[#d6ede1] rounded-xl text-xs text-[#2e7d5a] flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <b>Expected Return:</b> Historical conversion on AI rebooking reminders is <b>38%</b>, yielding an estimated TZS 3.2M in recovered appointment revenue.
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
              type="button"
              onClick={() => {
                onConfirm(message);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#9b627d] text-white font-medium text-sm hover:bg-[#854f68] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Save Campaign Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
