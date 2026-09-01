import React from 'react';
import { BOSApprovalItem, BOSComplaint } from '../../types/businessOS';
import { CheckSquare, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ReportsApprovalsPageProps {
  approvals: BOSApprovalItem[];
  complaints: BOSComplaint[];
  onReviewApproval: (item: BOSApprovalItem) => void;
  currentUser?: { id: string; name: string; role: string };
}

export const ReportsApprovalsPage: React.FC<ReportsApprovalsPageProps> = ({
  approvals,
  complaints,
  onReviewApproval,
  currentUser,
}) => {
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Segregation of Duties Banner */}
      <div className="p-4 bg-white border border-[#e3dce0] rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#efe7eb] text-[#9b627d] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#141214] flex items-center gap-2">
              <span>Dual-Control Governance & Segregation of Duties Enforced</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
                Active
              </span>
            </div>
            <p className="text-xs text-[#716a70]">
              Logged in as: <b>{currentUser?.name || 'Authorized User'}</b> ({currentUser?.role || 'Staff'}). An employee cannot approve their own submissions; Executive dual-sign-off is mandatory.
            </p>
          </div>
        </div>
        <div className="text-[11px] text-[#9b627d] font-semibold bg-[#fbf9fa] px-3 py-1.5 rounded-xl border border-[#e3dce0]">
          {currentUser?.role === 'Executive' ? '✓ Executive Sign-off Authority Granted' : '🔒 Read/Review Only Mode'}
        </div>
      </div>

      {/* Grid: Approvals Queue & End-of-Day Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Approvals Queue */}
        <div className="lg:col-span-7 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#141214]">Approvals Queue</h2>
              <p className="text-xs text-[#716a70]">
                Governance queue for pricing adjustments, refunds, and policy exceptions.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#efe7eb] text-[#9b627d]">
              {pendingApprovals.length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3dce0]">
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Item</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Requested By</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Details</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                  <th className="py-2.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3dce0] text-xs">
                {approvals.map((appr) => {
                  const firstName = currentUser?.name?.split(' ')?.[0]?.toLowerCase() || '';
                  const isSelf = currentUser && (
                    (appr as any).requestedByUserId === currentUser.id ||
                    (firstName && appr.requestedBy?.toLowerCase()?.includes(firstName))
                  );
                  return (
                    <tr key={appr.id} className="hover:bg-[#fbf9fa] transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[#141214]">{appr.title}</td>
                      <td className="py-3.5 px-3 text-[#716a70]">
                        <span>{appr.requestedBy}</span>
                        {isSelf && (
                          <span className="block text-[10px] font-bold text-[#a94646]">
                            (Self-Submitted)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#716a70] max-w-xs truncate">{appr.details}</td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          appr.status === 'Approved'
                            ? 'bg-[#eef8f3] text-[#2e7d5a]'
                            : appr.status === 'Rejected'
                            ? 'bg-[#fbefef] text-[#a94646]'
                            : 'bg-[#fcf6ea] text-[#a46d22]'
                        }`}>
                          {appr.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {appr.status === 'Pending' ? (
                          <button
                            onClick={() => onReviewApproval(appr)}
                            className="px-3 py-1.5 rounded-lg border border-[#ad8d58] text-[#ad8d58] hover:bg-[#fcf9f2] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#716a70] italic">Decided</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* End-of-Day Submissions Panel */}
        <div className="lg:col-span-5 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">End-of-Day Submissions</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <div>
                  <div className="font-semibold text-[#141214]">Shift reports</div>
                  <div className="text-[10px] text-[#716a70]">Stylist shift closure logs</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  18/19 submitted
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <div>
                  <div className="font-semibold text-[#141214]">Cash reconciliation</div>
                  <div className="text-[10px] text-[#716a70]">Drawer & Lipa Namba tally</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  Matched
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <div>
                  <div className="font-semibold text-[#141214]">Service notes</div>
                  <div className="text-[10px] text-[#716a70]">Client texture & formula logs</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  32 completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <div>
                  <div className="font-semibold text-[#141214]">Inventory counts</div>
                  <div className="text-[10px] text-[#716a70]">Backbar bottles & lace adhesives</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#eef8f3] border border-[#d6ede1] rounded-xl text-xs text-[#2e7d5a] mt-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Salon operational integrity score today: <b>98.4%</b></span>
          </div>
        </div>
      </div>

      {/* Customer Complaints Panel */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">Customer Complaints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e3dce0]">
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Customer</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Issue</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Staff Involved</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                <th className="py-3 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3dce0] text-xs">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbf9fa] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#141214]">{c.customerName}</td>
                  <td className="py-3.5 px-3 text-[#141214]">{c.issue}</td>
                  <td className="py-3.5 px-3 text-[#716a70]">{c.staffName}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Resolved'
                        ? 'bg-[#eef8f3] text-[#2e7d5a]'
                        : 'bg-[#fbefef] text-[#a94646]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#a94646]">{c.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Trail */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <h2 className="font-serif text-xl font-semibold text-[#141214] mb-3">System Audit Trail</h2>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <span className="text-[#141214]">Price proposal submitted: Fine Hair No Leave Out (TZS 280,000 → 300,000)</span>
            <span className="text-[#716a70] text-[10px]">Today, 10:15 • Service Manager</span>
          </div>
          <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <span className="text-[#141214]">Shift report signed off by Lead Stylist Maria</span>
            <span className="text-[#716a70] text-[10px]">Today, 09:30 • Maria</span>
          </div>
          <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <span className="text-[#141214]">Scheduled Social Post: Fine Hair Fix #08 queued across Instagram & TikTok</span>
            <span className="text-[#716a70] text-[10px]">Today, 08:45 • Marketing Team</span>
          </div>
        </div>
      </div>
    </div>
  );
};
