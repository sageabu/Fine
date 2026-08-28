import React from 'react';
import { BOSInventoryProduct, BusinessOSPage } from '../../types/businessOS';
import { DollarSign, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Package } from 'lucide-react';

interface CommercePageProps {
  inventory: BOSInventoryProduct[];
  onNavigate: (page: BusinessOSPage) => void;
  onOpenApproval: () => void;
}

export const CommercePage: React.FC<CommercePageProps> = ({
  inventory,
  onNavigate,
  onOpenApproval,
}) => {
  return (
    <div className="space-y-6">
      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Today's Sales</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">TZS 1.28M</div>
          <div className="text-xs text-[#716a70]">Services + product retail</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Outstanding Balances</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">TZS 640K</div>
          <div className="text-xs text-[#716a70]">Across 8 active appointments</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Low Stock SKUs</div>
          <div className="font-serif text-3xl font-semibold text-[#a94646] my-2">4</div>
          <div className="text-xs text-[#a94646] font-medium">Review purchasing orders</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Refund Requests</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">2</div>
          <div className="text-xs text-[#716a70]">This calendar month</div>
        </div>
      </div>

      {/* Grid: Inventory & Financial Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inventory Panel */}
        <div className="lg:col-span-7 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Product Inventory</h2>
            <span className="text-xs text-[#716a70]">Mikocheni B Backbar & Retail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3dce0]">
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Product</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Stock</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Threshold</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3dce0] text-xs">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbf9fa] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#141214]">{item.name}</div>
                      <div className="text-[10px] text-[#716a70] font-mono">{item.sku}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#141214]">
                      {item.stock} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#716a70]">
                      {item.threshold}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Healthy'
                          ? 'bg-[#eef8f3] text-[#2e7d5a]'
                          : item.status === 'Reorder'
                          ? 'bg-[#fcf6ea] text-[#a46d22]'
                          : 'bg-[#fbefef] text-[#a94646]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Controls Panel */}
        <div className="lg:col-span-5 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">Financial Controls</h2>
            <div className="space-y-3">
              <div
                onClick={onOpenApproval}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-xs text-[#141214]">Discounts pending approval</div>
                  <div className="text-[10px] text-[#716a70]">Exceptions requested by senior reception</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#efe7eb] text-[#9b627d]">
                  2
                </span>
              </div>

              <div
                onClick={onOpenApproval}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-xs text-[#141214]">Refunds pending approval</div>
                  <div className="text-[10px] text-[#716a70]">Customer deposit return authorization</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#efe7eb] text-[#9b627d]">
                  1
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#e3dce0] bg-[#fbf9fa]">
                <div>
                  <div className="font-semibold text-xs text-[#141214]">Cash & Till Reconciliation</div>
                  <div className="text-[10px] text-[#716a70]">Lipa Namba & M-Pesa automated match</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  Ready
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-[#f6f3f4] rounded-xl text-xs text-[#716a70] border border-[#e3dce0]">
            <b className="text-[#141214] block mb-1">Audit Policy</b>
            Discounts &gt;5% or any refund require two-party authorization to maintain financial compliance.
          </div>
        </div>
      </div>
    </div>
  );
};
