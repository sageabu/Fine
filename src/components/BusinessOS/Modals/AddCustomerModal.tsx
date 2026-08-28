import React, { useState } from 'react';
import { BOSCustomer } from '../../../types/businessOS';
import { X, User, Phone, Mail, Sparkles, Heart } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: BOSCustomer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+255 ');
  const [email, setEmail] = useState('');
  const [preferredService, setPreferredService] = useState('No Leave Out');
  const [source, setSource] = useState<'Instagram' | 'Referral' | 'Walk-in' | 'WhatsApp' | 'TikTok'>('Instagram');
  const [hairTexture, setHairTexture] = useState('4C Natural Coils');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: BOSCustomer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email: email || undefined,
      lastVisit: 'Just Added',
      preferredService,
      totalSpend: 0,
      status: 'Active',
      source,
      hairTexture,
      notes: notes || 'New client registered at Fine Hair atelier.',
    };

    onSave(newCust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Customer CRM</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Add Customer</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client Name"
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Preferred Service</label>
              <input
                type="text"
                value={preferredService}
                onChange={(e) => setPreferredService(e.target.value)}
                placeholder="e.g. No Leave Out, Knots"
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Acquisition Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Referral">Client Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="WhatsApp">WhatsApp Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Hair Texture / Scalp Notes</label>
            <input
              type="text"
              value={hairTexture}
              onChange={(e) => setHairTexture(e.target.value)}
              placeholder="e.g. 4C Coils, Sensitive to adhesive"
              className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Stylist Consultation Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Important hair history, preferred appointment days, etc."
              className="w-full border border-[#e3dce0] rounded-xl p-2.5 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
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
              className="px-5 py-2.5 rounded-xl bg-[#141214] text-white font-medium text-sm hover:bg-[#262226] transition-colors cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
