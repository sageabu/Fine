import React, { useState } from 'react';
import { BOSService } from '../../types/businessOS';
import { Search, Plus, ShieldCheck, Tag, Clock, ArrowRight, Lock } from 'lucide-react';

interface ServicesPricingPageProps {
  services: BOSService[];
  onProposePriceChange: (service?: BOSService) => void;
}

export const ServicesPricingPage: React.FC<ServicesPricingPageProps> = ({
  services,
  onProposePriceChange,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All categories' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
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
              placeholder="Search service..."
              className="w-full pl-9 pr-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white focus:outline-[#9b627d]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-[#e3dce0] rounded-xl text-xs bg-white text-[#141214] focus:outline-[#9b627d] cursor-pointer"
          >
            <option value="All categories">All categories</option>
            <option value="Installation">Installation</option>
            <option value="Braids">Braids</option>
            <option value="Colour">Colour</option>
            <option value="Care">Care</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <button
          onClick={() => onProposePriceChange()}
          className="px-4 py-2 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Propose price change</span>
        </button>
      </div>

      {/* Service Master Table */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Service Master</h2>
            <p className="text-xs text-[#716a70]">
              Official salon pricing and duration standards applied across checkout and online bookings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e3dce0]">
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Service</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Category</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Current Price</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Duration</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                <th className="py-3 px-3 text-right text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Price Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3dce0] text-xs">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#fbf9fa] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#141214]">{srv.name}</div>
                    <div className="text-[10px] text-[#716a70] max-w-sm truncate">{srv.description}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#716a70]">{srv.category}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#141214]">
                    TZS {srv.currentPrice.toLocaleString()}+
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#716a70]">{srv.duration}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
                      {srv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onProposePriceChange(srv)}
                      className="px-3 py-1.5 rounded-lg border border-[#e3dce0] bg-white text-[#141214] text-xs font-semibold hover:bg-[#efe7eb] hover:border-[#9b627d] transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Principle Card */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <div className="text-[10px] uppercase tracking-wider text-[#ad8d58] font-bold mb-1">
          Control Principle
        </div>
        <h2 className="font-serif text-xl font-semibold text-[#141214] mb-2">
          Prices are centrally controlled
        </h2>
        <p className="text-xs text-[#716a70] leading-relaxed max-w-3xl">
          Staff can view approved prices, but cannot directly alter or discount them at POS. A price change follows a transparent governance lifecycle: <b>Proposal → Executive Approval → Effective Date → Immutable Audit Log</b>.
        </p>
      </div>
    </div>
  );
};
