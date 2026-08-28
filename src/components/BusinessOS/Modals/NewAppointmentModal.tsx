import React, { useState } from 'react';
import { BOSAppointment, BOSService, BOSStaffRecord } from '../../../types/businessOS';
import { X, Calendar, Clock, User, Phone, CheckCircle2, DollarSign } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services?: BOSService[];
  staff?: BOSStaffRecord[];
  staffList?: BOSStaffRecord[];
  onSave: (appointment: BOSAppointment) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  services = [],
  staff = [],
  staffList,
  onSave,
}) => {
  const effectiveStaff = staff && staff.length > 0 ? staff : (staffList || []);
  const [clientName, setClientName] = useState('Amina M.');
  const [clientPhone, setClientPhone] = useState('+255 754 112 390');
  const [serviceName, setServiceName] = useState(services?.[0]?.name || 'No Leave Out');
  const [staffName, setStaffName] = useState(effectiveStaff?.[7]?.name || effectiveStaff?.[0]?.name || 'Maria');
  const [date, setDate] = useState('2026-08-28');
  const [time, setTime] = useState('09:00');
  const [paymentStatus, setPaymentStatus] = useState<'Deposit paid' | 'Pending balance' | 'Paid in full' | 'Unpaid'>('Deposit paid');
  const [deposit, setDeposit] = useState(50000);
  const [hairNotes, setHairNotes] = useState('Type 4C natural coils; client requested gentle hairline styling.');

  if (!isOpen) return null;

  const currentService = (services || []).find((s) => s.name === serviceName) || services?.[0];
  const price = currentService ? currentService.currentPrice : 280000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const formattedDate = new Date(date + 'T' + time);
    const dayMonth = formattedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const dateTimeStr = `${dayMonth} / ${time}`;

    const newApt: BOSAppointment = {
      id: `apt-${Date.now()}`,
      clientName,
      clientPhone,
      serviceName,
      staffName,
      dateTime: dateTimeStr,
      date,
      time,
      paymentStatus,
      status: 'Confirmed',
      price,
      deposit,
      hairNotes,
    };

    onSave(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3dce0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Appointment Control</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Create Appointment</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Client Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Phone (Tanzania)</label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Service</label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (TZS {s.currentPrice.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Assigned Staff</label>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              >
                {effectiveStaff.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name} ({st.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              >
                <option value="Deposit paid">Deposit paid</option>
                <option value="Paid in full">Paid in full</option>
                <option value="Pending balance">Pending balance</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Deposit (TZS)</label>
              <input
                type="number"
                step="5000"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Hair & Service Notes</label>
            <textarea
              rows={2}
              value={hairNotes}
              onChange={(e) => setHairNotes(e.target.value)}
              placeholder="e.g. hair length, leave-out preferences, lace shade"
              className="w-full border border-[#e3dce0] rounded-xl p-2.5 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div className="p-3 bg-[#f6f3f4] rounded-xl text-xs text-[#716a70]">
            <b>Production note:</b> Staff availability, booth capacity, and conflicting appointments are verified automatically.
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
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AppointmentDetailModalProps {
  appointment: BOSAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (aptId: string, newStatus: BOSAppointment['status']) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Appointment Record</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">{appointment.clientName}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-sm">
            <div>
              <span className="text-xs text-[#716a70] block">Service</span>
              <span className="font-semibold text-[#141214]">{appointment.serviceName}</span>
            </div>
            <div>
              <span className="text-xs text-[#716a70] block">Assigned Stylist</span>
              <span className="font-semibold text-[#141214]">{appointment.staffName}</span>
            </div>
            <div>
              <span className="text-xs text-[#716a70] block">Date & Time</span>
              <span className="font-semibold text-[#141214]">{appointment.dateTime}</span>
            </div>
            <div>
              <span className="text-xs text-[#716a70] block">Contact</span>
              <span className="font-semibold text-[#141214]">{appointment.clientPhone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-sm">
            <div>
              <span className="text-xs text-[#716a70] block">Total Amount</span>
              <span className="font-serif text-lg font-bold text-[#141214]">TZS {appointment.price.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-[#716a70] block">Payment State</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#efe7eb] text-[#9b627d]">
                <DollarSign className="w-3 h-3" />
                {appointment.paymentStatus} (TZS {appointment.deposit.toLocaleString()})
              </span>
            </div>
          </div>

          {appointment.hairNotes && (
            <div className="p-3 bg-[#f6f3f4] rounded-xl text-xs text-[#141214]">
              <b className="text-[#716a70] block uppercase tracking-wider mb-1">Stylist Notes</b>
              {appointment.hairNotes}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-2 uppercase tracking-wider">Update Booking Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Confirmed', 'In service', 'Completed', 'Cancelled', 'No-show'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(appointment.id, st)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    appointment.status === st
                      ? 'bg-[#141214] text-white border-[#141214]'
                      : 'bg-white text-[#716a70] border-[#e3dce0] hover:bg-[#f6f3f4]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141214] text-white text-sm font-medium hover:bg-[#262226] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
