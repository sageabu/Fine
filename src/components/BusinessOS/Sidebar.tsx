import React from 'react';
import { BusinessOSPage, BusinessOSRole } from '../../types/businessOS';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Tag,
  ShoppingBag,
  Share2,
  Sparkles,
  FileCheck2,
  ExternalLink,
  Store,
} from 'lucide-react';

interface SidebarProps {
  activePage: BusinessOSPage;
  onSelectPage: (page: BusinessOSPage) => void;
  activeRole: BusinessOSRole;
  onChangeRole: (role: BusinessOSRole) => void;
  onOpenStorefront: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  activeRole,
  onChangeRole,
  onOpenStorefront,
  isOpenMobile = false,
  onCloseMobile,
  pendingApprovalsCount = 3,
}) => {
  const navItems: { id: BusinessOSPage; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'staff', label: 'Staff & Performance', icon: Users },
    { id: 'customers', label: 'Customers / CRM', icon: UserCheck },
    { id: 'services', label: 'Services & Pricing', icon: Tag },
    { id: 'commerce', label: 'Commerce', icon: ShoppingBag },
    { id: 'marketing', label: 'Marketing Hub', icon: Share2 },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'reports', label: 'Reports & Approvals', icon: FileCheck2, badge: pendingApprovalsCount },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#171518] text-white p-5 flex flex-col justify-between z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="px-2 mb-6">
            <div className="font-serif text-2xl tracking-wider text-white font-medium">FINE HAIR</div>
            <div className="text-[10px] text-[#bdb5ba] tracking-[0.2em] uppercase font-semibold mt-0.5">
              Business OS
            </div>
          </div>

          {/* Role Switcher */}
          <div className="bg-[#262226] border border-[#3d353b] rounded-xl p-3 mb-6">
            <label className="text-[10px] uppercase tracking-wider text-[#aaa1a8] block mb-1.5 font-bold">
              VIEW AS
            </label>
            <select
              value={activeRole}
              onChange={(e) => onChangeRole(e.target.value as BusinessOSRole)}
              className="w-full bg-[#332d32] text-white text-xs rounded-lg px-2.5 py-2 border-0 focus:ring-1 focus:ring-[#9b627d] cursor-pointer"
            >
              <option value="Executive">Executive</option>
              <option value="Manager">Manager</option>
              <option value="Reception">Reception</option>
              <option value="Staff">Staff</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3a3036] text-white shadow-xs'
                      : 'text-[#c9c1c6] hover:text-white hover:bg-[#262226]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#cda6b8]' : 'text-[#8e858b]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ad8d58] text-[#171518]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Link & Location Info */}
        <div className="pt-4 border-t border-[#2d282c] space-y-3">
          <button
            onClick={onOpenStorefront}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#292327] to-[#362e33] border border-[#4a3f46] hover:border-[#ad8d58] transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[#ad8d58] group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-semibold text-white">Customer Boutique</div>
                <div className="text-[10px] text-[#bdb5ba]">Shop & Client View</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#ad8d58]" />
          </button>

          <div className="px-2 text-[10px] text-[#8e858b] leading-tight">
            Mikocheni B, Ussagara St<br />
            Dar es Salaam, Tanzania
          </div>
        </div>
      </aside>
    </>
  );
};
