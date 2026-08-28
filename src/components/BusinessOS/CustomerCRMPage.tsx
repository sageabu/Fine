import React, { useState } from 'react';
import { BOSCustomer } from '../../types/businessOS';
import { Search, Plus, Sparkles, UserCheck, MessageCircle, Heart, Phone, Filter } from 'lucide-react';

interface CustomerCRMPageProps {
  customers: BOSCustomer[];
  onAddCustomer: () => void;
  onOpenCampaignDraft: () => void;
}

export const CustomerCRMPage: React.FC<CustomerCRMPageProps> = ({
  customers,
  onAddCustomer,
  onOpenCampaignDraft,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All customers');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.preferredService.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All customers' ||
      (statusFilter === 'New' && c.lastVisit.toLowerCase().includes('just added')) ||
      (statusFilter === 'Returning' && (c.status === 'VIP' || c.status === 'Active')) ||
      (statusFilter === 'At risk' && (c.status === 'At risk' || c.status === 'Rebook due'));

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
              placeholder="Search customer by name or phone..."
              className="w-full pl-9 pr-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white focus:outline-[#9b627d]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white text-[#141214] focus:outline-[#9b627d] cursor-pointer"
          >
            <option value="All customers">All customers</option>
            <option value="Returning">Returning & VIP</option>
            <option value="New">New</option>
            <option value="At risk">At risk / Rebook due</option>
          </select>
        </div>

        <button
          onClick={onAddCustomer}
          className="px-4 py-2 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add customer</span>
        </button>
      </div>

      {/* Customer Health & AI CRM Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mb-3">Customer Health</h2>
            <p className="text-xs text-[#716a70] mb-4">
              Real-time retention telemetry across registered clients in Dar es Salaam.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-[#716a70] block mb-1">Active</span>
              <div className="font-serif text-2xl font-bold text-[#141214]">1,284</div>
              <span className="text-[10px] text-[#2e7d5a]">Regular bookings</span>
            </div>

            <div className="p-3 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-[#716a70] block mb-1">New</span>
              <div className="font-serif text-2xl font-bold text-[#9b627d]">146</div>
              <span className="text-[10px] text-[#716a70]">This month</span>
            </div>

            <div className="p-3 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-[#716a70] block mb-1">At risk</span>
              <div className="font-serif text-2xl font-bold text-[#a94646]">82</div>
              <span className="text-[10px] text-[#a94646]">&gt;60 days inactive</span>
            </div>
          </div>
        </div>

        {/* AI CRM Insight */}
        <div className="lg:col-span-6 rounded-2xl p-5 border border-[#e4d5dc] bg-gradient-to-br from-[#f5e8ef] via-[#f9f3f6] to-[#f1e8e3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#9b627d] font-bold">
              AI CRM Insight
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mt-1 mb-2">
              Retention opportunity
            </h2>
            <p className="text-xs text-[#554e54] leading-relaxed mb-4">
              34 high-value customers are past their normal maintenance interval for No Leave Out and Weaving. Consider triggering a personalized rebooking campaign with their preferred stylists.
            </p>
          </div>
          <div>
            <button
              onClick={onOpenCampaignDraft}
              className="px-4 py-2 bg-[#9b627d] text-white text-xs font-bold rounded-xl hover:bg-[#854f68] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbf9fa]" />
              <span>Create campaign draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Customers Table */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">Recent Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e3dce0]">
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Customer</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Last Visit</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Preferred Service</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Spend</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Source</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3dce0] text-xs">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#fbf9fa] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-[#141214]">{cust.name}</div>
                    <div className="text-[10px] text-[#716a70]">{cust.phone}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#141214]">{cust.lastVisit}</td>
                  <td className="py-3.5 px-3 text-[#716a70]">{cust.preferredService}</td>
                  <td className="py-3.5 px-3 font-mono font-medium text-[#141214]">
                    TZS {cust.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-[#716a70]">{cust.source}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      cust.status === 'VIP'
                        ? 'bg-[#f4eee3] text-[#ad8d58]'
                        : cust.status === 'Active'
                        ? 'bg-[#eef8f3] text-[#2e7d5a]'
                        : cust.status === 'Rebook due'
                        ? 'bg-[#fcf6ea] text-[#a46d22]'
                        : 'bg-[#fbefef] text-[#a94646]'
                    }`}>
                      {cust.status}
                    </span>
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
