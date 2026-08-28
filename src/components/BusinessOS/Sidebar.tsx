import React from 'react';
import { BusinessOSPage, BusinessOSRole } from '../../types/businessOS';
import { UserAccount } from '../../utils/apiClient';
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
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  activePage: BusinessOSPage;
  onSelectPage: (page: BusinessOSPage) => void;
  activeRole: BusinessOSRole;
  onChangeRole?: (role: BusinessOSRole) => void;
  onOpenStorefront: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  pendingApprovalsCount?: number;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  activeRole,
  onOpenStorefront,
  isOpenMobile = false,
  onCloseMobile,
  pendingApprovalsCount = 3,
  currentUser,
  onOpenAuthModal,
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
          <div className="px-2 mb-4">
            <div className="font-serif text-2xl tracking-wider text-white font-medium">FINE HAIR</div>
            <div className="text-[10px] text-[#bdb5ba] tracking-[0.2em] uppercase font-semibold mt-0.5">
              Business OS
            </div>
          </div>

          {/* Authenticated User & Governance Profile */}
          <div className="bg-[#241f23] border border-[#3d333b] rounded-xl p-3 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-wider text-[#ad8d58] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Active Profile</span>
              </span>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-[10px] text-[#ad8d58] hover:text-white font-semibold cursor-pointer underline flex items-center gap-1"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Switch / Login</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}
                alt={currentUser?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-[#4d404b] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'Amina K. (CFO)'}
                </div>
                <div className="text-[10px] text-[#ad8d58] font-medium tracking-wide uppercase">
                  {currentUser?.role || activeRole}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#362d34] flex items-center justify-between text-[10px] text-[#8e858b]">
              <span>Permissions:</span>
              <span className="font-mono text-white font-semibold">
                {currentUser?.permissions.length || 7} Active
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
