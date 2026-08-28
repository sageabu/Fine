import React, { useState } from 'react';
import { BOSStaffRecord } from '../../../types/businessOS';
import { X, Award, CheckCircle2, Clock, Calendar, Star, AlertCircle, FileText } from 'lucide-react';

interface EmployeeDetailModalProps {
  staff?: BOSStaffRecord[];
  staffMember?: BOSStaffRecord | null;
  selectedStaffId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  staff = [],
  staffMember,
  selectedStaffId,
  isOpen,
  onClose,
}) => {
  const initialId = staffMember?.id || selectedStaffId || staff?.[0]?.id || '';
  const [activeId, setActiveId] = useState<string>(initialId);

  React.useEffect(() => {
    if (staffMember?.id) {
      setActiveId(staffMember.id);
    } else if (selectedStaffId) {
      setActiveId(selectedStaffId);
    } else if (staff?.[0]?.id) {
      setActiveId(staff[0].id);
    }
  }, [staffMember?.id, selectedStaffId, isOpen]);

  if (!isOpen) return null;

  const current = staff.find((s) => s.id === activeId) || staffMember || staff?.[0];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3dce0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Staff & Performance</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Employee Profile & KPI</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Employee Switcher */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#716a70] mb-1.5 uppercase tracking-wider">Select Employee</label>
          <select
            value={current.id}
            onChange={(e) => setActiveId(e.target.value)}
            className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.roleTitle} (KPI {s.kpiScore}%)
              </option>
            ))}
          </select>
        </div>

        {/* Profile Card */}
        <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-2xl mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={current.avatar}
            alt={current.name}
            className="w-20 h-20 rounded-2xl object-cover border border-[#e3dce0] shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="font-serif text-xl font-bold text-[#141214]">{current.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                current.present ? 'bg-[#eef8f3] text-[#2e7d5a]' : 'bg-[#fbefef] text-[#a94646]'
              }`}>
                {current.present ? 'Present Today' : 'Absent'}
              </span>
              {current.lateCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#fcf6ea] text-[#a46d22]">
                  1 Late Flag
                </span>
              )}
            </div>
            <p className="text-xs text-[#716a70] mb-2">{current.roleTitle} • Mikocheni B Atelier</p>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {current.specialties.map((sp, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#e3dce0] text-[#716a70]">
                  {sp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Score Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 bg-white border border-[#e3dce0] rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#716a70] font-semibold block mb-1">Client Rating</span>
            <div className="font-serif text-2xl font-bold text-[#141214] flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-[#ad8d58] fill-[#ad8d58]" />
              {current.clientScore}/5
            </div>
            <span className="text-[10px] text-[#2e7d5a]">Very High</span>
          </div>

          <div className="p-3 bg-white border border-[#e3dce0] rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#716a70] font-semibold block mb-1">Monthly KPI</span>
            <div className="font-serif text-2xl font-bold text-[#9b627d]">{current.kpiScore}%</div>
            <span className="text-[10px] text-[#716a70]">Objective Score</span>
          </div>

          <div className="p-3 bg-white border border-[#e3dce0] rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#716a70] font-semibold block mb-1">Appointments</span>
            <div className="font-serif text-2xl font-bold text-[#141214]">{current.completedCount}/{current.appointmentsCount}</div>
            <span className="text-[10px] text-[#2e7d5a]">Completed</span>
          </div>

          <div className="p-3 bg-white border border-[#e3dce0] rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#716a70] font-semibold block mb-1">Daily Reports</span>
            <div className="font-serif text-2xl font-bold text-[#141214]">{current.reportsSubmittedPct}%</div>
            <span className="text-[10px] text-[#2e7d5a]">On-time log</span>
          </div>
        </div>

        {/* Evaluation Breakdown */}
        <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-2xl mb-4">
          <h4 className="font-serif text-base font-semibold text-[#141214] mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ad8d58]" />
            Monthly Assessment Inputs
          </h4>
          <p className="text-xs text-[#716a70] leading-relaxed mb-3">
            Evaluated on: Attendance • Punctuality • Appointments completed • Client feedback • Rework/repairs • Report compliance • Technical craftsmanship • Salon teamwork.
          </p>
          <div className="p-3 bg-white border border-[#e3dce0] rounded-xl text-xs text-[#141214]">
            <b className="text-[#716a70] block uppercase tracking-wider text-[10px] mb-1">Management Observation Notes</b>
            {current.notes}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#141214] text-white text-sm font-medium hover:bg-[#262226] cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
