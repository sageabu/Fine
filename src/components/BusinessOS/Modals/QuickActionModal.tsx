import React, { useState } from 'react';
import { BOSService, BOSStaffRecord, BOSAppointment, BOSCustomer, BOSApprovalItem, BOSMarketingPost } from '../../../types/businessOS';
import { X, Calendar, User, Tag, Send, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, MessageSquare, Clock, Phone, DollarSign } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'appointment' | 'customer' | 'price' | 'social') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, onSelectAction }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Business OS</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Quick Action</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onSelectAction('appointment')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#9b627d] transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#141214] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 text-[#cda6b8]" />
            </div>
            <span className="font-medium text-sm text-[#141214]">New Appointment</span>
            <span className="text-xs text-[#716a70]">Book client flow & slot</span>
          </button>

          <button
            onClick={() => onSelectAction('customer')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#9b627d] transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#141214] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <User className="w-4 h-4 text-[#cda6b8]" />
            </div>
            <span className="font-medium text-sm text-[#141214]">Add Customer</span>
            <span className="text-xs text-[#716a70]">Register profile in CRM</span>
          </button>

          <button
            onClick={() => onSelectAction('price')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#9b627d] transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#141214] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Tag className="w-4 h-4 text-[#ad8d58]" />
            </div>
            <span className="font-medium text-sm text-[#141214]">Propose Price</span>
            <span className="text-xs text-[#716a70]">Submit change for review</span>
          </button>

          <button
            onClick={() => onSelectAction('social')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#9b627d] transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#141214] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4 text-[#9b627d]" />
            </div>
            <span className="font-medium text-sm text-[#141214]">Schedule Post</span>
            <span className="text-xs text-[#716a70]">Publish content to channels</span>
          </button>
        </div>
      </div>
    </div>
  );
};
