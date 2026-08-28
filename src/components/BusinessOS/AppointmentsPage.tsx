import React, { useState } from 'react';
import { BOSAppointment } from '../../types/businessOS';
import { Search, Plus, Calendar, Filter, Clock, CheckCircle2 } from 'lucide-react';

interface AppointmentsPageProps {
  appointments: BOSAppointment[];
  onOpenAppointment: (apt: BOSAppointment) => void;
  onNewAppointment: () => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  onOpenAppointment,
  onNewAppointment,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.staffName.toLowerCase().includes(search.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All statuses' || apt.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-[#716a70] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or staff..."
              className="w-full pl-9 pr-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white focus:outline-[#9b627d]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white text-[#141214] focus:outline-[#9b627d] cursor-pointer"
          >
            <option value="All statuses">All statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In service">In service</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>

        <button
          onClick={onNewAppointment}
          className="px-4 py-2 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New appointment</span>
        </button>
      </div>

      {/* Main Appointment Control Panel */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Appointment Control</h2>
            <p className="text-xs text-[#716a70]">
              Weekly view of capacity, chair reservations, and active service flow at Mikocheni B.
            </p>
          </div>
        </div>

        {/* 7-Day Visual Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                MON 24
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight mb-1">
                09:00 Amina<br /><span className="text-[#9b627d]">No Leave Out</span>
              </div>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                14:00 Zainab<br /><span className="text-[#9b627d]">Weaving</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                TUE 25
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight mb-1">
                10:30 Sarah<br /><span className="text-[#9b627d]">Knots</span>
              </div>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                15:00 Nadia<br /><span className="text-[#9b627d]">Braids</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                WED 26
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                09:00 Leila<br /><span className="text-[#9b627d]">Coloring</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                THU 27
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight mb-1">
                09:00 Amina<br /><span className="text-[#9b627d]">No Leave Out</span>
              </div>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                12:00 Neema<br /><span className="text-[#9b627d]">Weaving</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                FRI 28
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                11:00 Fatma<br /><span className="text-[#9b627d]">Traditional Knots</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                SAT 29
              </strong>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight mb-1">
                10:00 Joy<br /><span className="text-[#9b627d]">Braids</span>
              </div>
              <div className="bg-[#efe7eb] rounded-lg p-1.5 text-[10px] text-[#141214] font-medium leading-tight">
                13:30 Sarah<br /><span className="text-[#9b627d]">Wash & Blowdry</span>
              </div>
            </div>
          </div>

          <div className="bg-[#faf9fa] border border-[#e3dce0] rounded-xl p-2.5 min-h-[120px] flex flex-col justify-between">
            <div>
              <strong className="text-[11px] font-bold text-[#141214] uppercase tracking-wider block mb-1">
                SUN 30
              </strong>
              <div className="text-[10px] text-[#716a70] italic mt-2">
                Controlled VIP / Bridal schedule
              </div>
            </div>
          </div>
        </div>

        {/* Full Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e3dce0]">
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Client</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Service</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Staff</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Date / Time</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Payment</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                <th className="py-3 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3dce0] text-xs">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#fbf9fa] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-[#141214]">{apt.clientName}</div>
                    <div className="text-[10px] text-[#716a70]">{apt.clientPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#141214]">{apt.serviceName}</td>
                  <td className="py-3.5 px-3 text-[#716a70]">{apt.staffName}</td>
                  <td className="py-3.5 px-3 text-[#141214] font-medium">{apt.dateTime}</td>
                  <td className="py-3.5 px-3 text-[#716a70]">
                    <span className="text-[11px] font-medium">{apt.paymentStatus}</span>
                  </td>
                  <td className="py-3.5 px-3">
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
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onOpenAppointment(apt)}
                      className="px-3 py-1.5 rounded-lg border border-[#e3dce0] bg-white text-[#141214] text-xs font-semibold hover:bg-[#f6f3f4] cursor-pointer"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
