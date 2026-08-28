import React from 'react';
import { BusinessOSPage, BusinessOSRole } from '../../types/businessOS';
import { Menu, Plus, CheckCircle, Shield, Store, Bell } from 'lucide-react';

interface TopbarProps {
  activePage: BusinessOSPage;
  activeRole: BusinessOSRole;
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onOpenQuickAction: () => void;
  onToggleMobileMenu: () => void;
  onOpenStorefront: () => void;
}

const PAGE_TITLES: Record<BusinessOSPage, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive Overview',
    subtitle: 'One view of operations, customers, people and commercial performance.',
  },
  appointments: {
    title: 'Appointments Control',
    subtitle: 'Control capacity, client flow, payments and service completion.',
  },
  staff: {
    title: 'Staff & Performance',
    subtitle: 'Objective operational data plus management assessment for 19 salon specialists.',
  },
  customers: {
    title: 'Customers / CRM',
    subtitle: 'Customer relationship, retention, hair texture profiles and service history.',
  },
  services: {
    title: 'Services & Pricing Master',
    subtitle: 'One approved service master with centralized, auditable pricing governance.',
  },
  commerce: {
    title: 'Commerce & Inventory',
    subtitle: 'Product retail, inventory stock thresholds, payments, discounts and refund logs.',
  },
  marketing: {
    title: 'Marketing Hub',
    subtitle: 'Content calendar, campaign ROI attribution, and multi-channel publishing.',
  },
  ai: {
    title: 'Fine Hair AI Assistant',
    subtitle: 'Assistance for customers, staff and management — transparent with strict human guardrails.',
  },
  reports: {
    title: 'Reports & Approvals',
    subtitle: 'Approvals queue, shift submissions, open customer complaints and system audit trail.',
  },
};

export const Topbar: React.FC<TopbarProps> = ({
  activePage,
  activeRole,
  pendingApprovalsCount,
  onOpenApprovals,
  onOpenQuickAction,
  onToggleMobileMenu,
  onOpenStorefront,
}) => {
  const meta = PAGE_TITLES[activePage] || PAGE_TITLES.overview;

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#e3dce0]">
      <div className="flex items-start gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-[#e3dce0] bg-white text-[#141214] hover:bg-[#f6f3f4] mt-1 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#9b627d]">
              Fine Hair Digital Business Platform
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#ad8d58]" />
            <span className="hidden sm:inline-block text-[10px] text-[#716a70] uppercase font-semibold">
              Role: {activeRole}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141214] mt-0.5 tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#716a70] mt-0.5 max-w-2xl">
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          onClick={onOpenStorefront}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e3dce0] bg-white text-[#141214] text-xs font-semibold hover:bg-[#efe7eb] hover:border-[#9b627d] transition-all cursor-pointer"
          title="Switch to customer-facing boutique & booking view"
        >
          <Store className="w-3.5 h-3.5 text-[#9b627d]" />
          <span>Customer Boutique</span>
        </button>

        <button
          onClick={onOpenApprovals}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f4eee3] border border-[#e8dcc6] text-[#141214] text-xs font-bold hover:bg-[#eae1d0] transition-colors cursor-pointer"
        >
          <span>Approvals</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#141214] text-white text-[10px] font-mono font-semibold">
            {pendingApprovalsCount}
          </span>
        </button>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141214] text-white text-xs font-bold hover:bg-[#282327] transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Action</span>
        </button>
      </div>
    </header>
  );
};
