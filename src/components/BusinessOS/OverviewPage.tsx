import React from 'react';
import { BOSAppointment, BusinessOSPage } from '../../types/businessOS';
import { ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface OverviewPageProps {
  appointments: BOSAppointment[];
  onOpenAppointment: (apt: BOSAppointment) => void;
  onNavigate: (page: BusinessOSPage) => void;
  pendingApprovalsCount: number;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  appointments,
  onOpenAppointment,
  onNavigate,
  pendingApprovalsCount,
}) => {
  // Today's appointments (first 4)
  const todayOps = appointments.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Today's Revenue</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">TZS 4.86M</div>
          <div className="text-xs font-semibold text-[#2e7d5a] flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-[#716a70] font-normal">vs last Tuesday</span>
          </div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Bookings</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">34</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">27 completed • 4 in service</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Qualified Enquiries</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">21</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">11 converted this week</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Customer Satisfaction</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">4.7/5</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 0.2 this month</div>
        </div>
      </div>

      {/* Grid: Operations Table & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Operations Table */}
        <div className="lg:col-span-7 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Today's Operations</h2>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-bold text-[#9b627d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View calendar <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3dce0]">
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Time</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Client</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Service</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Staff</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3dce0] text-xs">
                {todayOps.map((apt) => (
                  <tr
                    key={apt.id}
                    onClick={() => onOpenAppointment(apt)}
                    className="hover:bg-[#fbf9fa] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-medium text-[#141214]">{apt.time}</td>
                    <td className="py-3 px-3 font-semibold text-[#141214]">{apt.clientName}</td>
                    <td className="py-3 px-3 text-[#716a70]">{apt.serviceName}</td>
                    <td className="py-3 px-3 text-[#141214]">{apt.staffName}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        apt.status === 'Completed'
                          ? 'bg-[#eef8f3] text-[#2e7d5a]'
                          : apt.status === 'In service'
                          ? 'bg-[#fcf6ea] text-[#a46d22]'
                          : 'bg-[#efe7eb] text-[#9b627d]'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="lg:col-span-5 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">Needs Attention</h2>
            <div className="space-y-3">
              <div
                onClick={() => onNavigate('staff')}
                className="border-l-4 border-[#a46d22] bg-[#fcf6ea] p-3 rounded-r-xl text-xs text-[#141214] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="font-semibold">2 staff late today</div>
                <div className="text-[#716a70] text-[11px]">Attendance review scheduled for afternoon meeting.</div>
              </div>

              <div
                onClick={() => onNavigate('reports')}
                className="border-l-4 border-[#a94646] bg-[#fbefef] p-3 rounded-r-xl text-xs text-[#141214] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="font-semibold text-[#a94646]">1 unresolved customer complaint</div>
                <div className="text-[#716a70] text-[11px]">Due today: follow up on hairline tension feedback.</div>
              </div>

              <div
                onClick={() => onNavigate('reports')}
                className="border-l-4 border-[#ad8d58] bg-[#fcf9f2] p-3 rounded-r-xl text-xs text-[#141214] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="font-semibold text-[#ad8d58]">{pendingApprovalsCount} approvals pending</div>
                <div className="text-[#716a70] text-[11px]">Price change proposal, refund request, and discount waiver.</div>
              </div>

              <div
                onClick={() => onNavigate('commerce')}
                className="border-l-4 border-[#2e7d5a] bg-[#eef8f3] p-3 rounded-r-xl text-xs text-[#141214] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="font-semibold text-[#2e7d5a]">Inventory alert</div>
                <div className="text-[#716a70] text-[11px]">All critical backbar items currently covered at Mikocheni B.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Commercial Targets & AI Management Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Commercial Targets Progress */}
        <div className="lg:col-span-6 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <h2 className="font-serif text-xl font-semibold text-[#141214] mb-5">Commercial Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#141214] mb-1.5">
                <span>Revenue vs monthly target</span>
                <span className="font-mono">78%</span>
              </div>
              <div className="h-2.5 bg-[#eee8eb] rounded-full overflow-hidden">
                <div className="h-full bg-[#9b627d] rounded-full transition-all duration-500" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#141214] mb-1.5">
                <span>Bookings vs monthly target</span>
                <span className="font-mono">84%</span>
              </div>
              <div className="h-2.5 bg-[#eee8eb] rounded-full overflow-hidden">
                <div className="h-full bg-[#ad8d58] rounded-full transition-all duration-500" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#141214] mb-1.5">
                <span>Repeat customer rate</span>
                <span className="font-mono">61%</span>
              </div>
              <div className="h-2.5 bg-[#eee8eb] rounded-full overflow-hidden">
                <div className="h-full bg-[#2e7d5a] rounded-full transition-all duration-500" style={{ width: '61%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Management Brief */}
        <div className="lg:col-span-6 rounded-2xl p-5 border border-[#e4d5dc] bg-gradient-to-br from-[#f5e8ef] via-[#f9f3f6] to-[#f1e8e3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#9b627d] font-bold">
              AI Management Brief
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mt-1 mb-2">
              What needs your attention?
            </h2>
            <p className="text-xs text-[#554e54] leading-relaxed mb-4">
              Bookings are healthy, but two late arrivals and one unresolved complaint require action today. Marketing-attributed enquiries are converting 18% better than last month, driven by transformation video content.
            </p>
          </div>

          <div>
            <button
              onClick={() => onNavigate('ai')}
              className="px-4 py-2 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#cda6b8]" />
              <span>Ask AI Management Engine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
