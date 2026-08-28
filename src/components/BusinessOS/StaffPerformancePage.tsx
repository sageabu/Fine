import React, { useState } from 'react';
import { BOSStaffRecord } from '../../types/businessOS';
import { Search, UserCheck, AlertCircle, Award, Star, ArrowUpDown } from 'lucide-react';

interface StaffPerformancePageProps {
  staff: BOSStaffRecord[];
  onOpenEmployee: (staffMember?: BOSStaffRecord) => void;
}

export const StaffPerformancePage: React.FC<StaffPerformancePageProps> = ({ staff, onOpenEmployee }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'kpi' | 'score' | 'name'>('kpi');

  const filteredStaff = staff
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.roleTitle.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'kpi') return b.kpiScore - a.kpiScore;
      if (sortBy === 'score') return b.clientScore - a.clientScore;
      return a.name.localeCompare(b.name);
    });

  const presentCount = staff.filter((s) => s.present).length;
  const lateCount = staff.filter((s) => s.lateCount > 0).length;

  return (
    <div className="space-y-6">
      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Staff Present</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">
            {presentCount}/{staff.length}
          </div>
          <div className="text-xs font-semibold text-[#a46d22]">{lateCount} late today</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Reports Submitted</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">96%</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 4% vs last month</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Average KPI</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">82%</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">Very Good salon standard</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Client Complaints</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">3</div>
          <div className="text-xs font-semibold text-[#a94646]">2 need supervisor review</div>
        </div>
      </div>

      {/* Staff Table Panel */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Staff Performance</h2>
            <p className="text-xs text-[#716a70]">
              Objective operational data combined with management assessment across 19 stylists.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#716a70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stylist..."
                className="pl-8 pr-3 py-1.5 border border-[#e3dce0] rounded-xl text-xs bg-white focus:outline-[#9b627d]"
              />
            </div>
            <button
              onClick={() => onOpenEmployee()}
              className="px-4 py-2 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all cursor-pointer shrink-0"
            >
              Open employee
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e3dce0]">
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Employee</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Present</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Late</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Appointments</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Completed</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Client Score</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">KPI</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3dce0] text-xs">
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => onOpenEmployee(member)}
                  className="hover:bg-[#fbf9fa] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#e3dce0]"
                      />
                      <div>
                        <div className="font-bold text-[#141214]">{member.name}</div>
                        <div className="text-[10px] text-[#716a70]">{member.roleTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`font-semibold ${member.present ? 'text-[#2e7d5a]' : 'text-[#a94646]'}`}>
                      {member.present ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`font-mono ${member.lateCount > 0 ? 'text-[#a46d22] font-bold' : 'text-[#716a70]'}`}>
                      {member.lateCount}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#141214]">{member.appointmentsCount}</td>
                  <td className="py-3.5 px-3 font-mono text-[#141214]">{member.completedCount}</td>
                  <td className="py-3.5 px-3 font-medium text-[#141214]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#ad8d58] fill-[#ad8d58]" />
                      {member.clientScore}/5
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#efe7eb] text-[#9b627d]">
                      {member.kpiScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#716a70]">{member.reportsSubmittedPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
