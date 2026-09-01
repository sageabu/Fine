import React, { useState } from 'react';
import {
  BusinessOSPage,
  BusinessOSRole,
  BOSAppointment,
  BOSStaffRecord,
  BOSCustomer,
  BOSService,
  BOSInventoryProduct,
  BOSMarketingPost,
  BOSApprovalItem,
  BOSComplaint,
} from '../../types/businessOS';
import {
  INITIAL_BOS_APPOINTMENTS,
  INITIAL_BOS_STAFF,
  INITIAL_BOS_CUSTOMERS,
  INITIAL_BOS_SERVICES,
  INITIAL_BOS_INVENTORY,
  INITIAL_BOS_MARKETING_POSTS,
  INITIAL_BOS_APPROVALS,
  INITIAL_BOS_COMPLAINTS,
} from '../../data/businessOSMockData';
import { api, UserAccount, getStoredUser } from '../../utils/apiClient';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { OverviewPage } from './OverviewPage';
import { AppointmentsPage } from './AppointmentsPage';
import { StaffPerformancePage } from './StaffPerformancePage';
import { CustomerCRMPage } from './CustomerCRMPage';
import { ServicesPricingPage } from './ServicesPricingPage';
import { CommercePage } from './CommercePage';
import { MarketingHubPage } from './MarketingHubPage';
import { AIAssistantPage } from './AIAssistantPage';
import { ReportsApprovalsPage } from './ReportsApprovalsPage';
import { BrandExperienceCMSPage } from './BrandExperienceCMSPage';

// Modals
import { QuickActionModal } from './Modals/QuickActionModal';
import { NewAppointmentModal, AppointmentDetailModal } from './Modals/NewAppointmentModal';
import { EmployeeDetailModal } from './Modals/EmployeeDetailModal';
import { AddCustomerModal } from './Modals/AddCustomerModal';
import { ProposePriceModal } from './Modals/ProposePriceModal';
import { ScheduleSocialModal } from './Modals/ScheduleSocialModal';
import { AICampaignModal } from './Modals/AICampaignModal';
import { CustomerAIModal, StaffAIModal, ApprovalReviewModal } from './Modals/CustomerAIModal';
import { AuthUserModal } from './Modals/AuthUserModal';

interface BusinessOSDashboardProps {
  onOpenStorefront: () => void;
  externalServices?: BOSService[];
  onUpdateServices?: (services: BOSService[]) => void;
  externalAppointments?: BOSAppointment[];
  onAddAppointment?: (apt: BOSAppointment) => void;
  initialRole?: BusinessOSRole;
}

export const BusinessOSDashboard: React.FC<BusinessOSDashboardProps> = ({
  onOpenStorefront,
  externalServices,
  onUpdateServices,
  externalAppointments,
  onAddAppointment,
  initialRole = 'Executive',
}) => {
  // Navigation & Role State
  const [activePage, setActivePage] = useState<BusinessOSPage>('overview');
  const [activeRole, setActiveRole] = useState<BusinessOSRole>(initialRole);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Datasets
  const [appointments, setAppointments] = useState<BOSAppointment[]>(
    externalAppointments && externalAppointments.length > 0 ? externalAppointments : INITIAL_BOS_APPOINTMENTS
  );
  const [staff, setStaff] = useState<BOSStaffRecord[]>(INITIAL_BOS_STAFF);
  const [customers, setCustomers] = useState<BOSCustomer[]>(INITIAL_BOS_CUSTOMERS);
  const [services, setServices] = useState<BOSService[]>(
    externalServices && externalServices.length > 0 ? externalServices : INITIAL_BOS_SERVICES
  );
  const [inventory, setInventory] = useState<BOSInventoryProduct[]>(INITIAL_BOS_INVENTORY);
  const [posts, setPosts] = useState<BOSMarketingPost[]>(INITIAL_BOS_MARKETING_POSTS);
  const [approvals, setApprovals] = useState<BOSApprovalItem[]>(INITIAL_BOS_APPROVALS);
  const [complaints, setComplaints] = useState<BOSComplaint[]>(INITIAL_BOS_COMPLAINTS);

  // Initial Sync from Centralized Backend Database
  const refreshFromDatabase = async () => {
    try {
      const [meRes, dbServices, dbAppointments, dbApprovals, dbMarketing] = await Promise.allSettled([
        api.getMe(),
        api.getServices(),
        api.getAppointments(),
        api.getApprovals(),
        api.getMarketingPosts(),
      ]);

      if (meRes.status === 'fulfilled' && meRes.value.success && meRes.value.user) {
        setCurrentUser(meRes.value.user);
        setActiveRole(meRes.value.user.role as BusinessOSRole);
      }

      if (dbServices.status === 'fulfilled' && dbServices.value.length > 0) {
        const mappedServices: BOSService[] = dbServices.value.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          currentPrice: s.currentPrice,
          duration: s.durationLabel,
          status: s.status as any,
          description: s.description,
          swahiliDescription: s.swahiliName,
        }));
        setServices(mappedServices);
        if (onUpdateServices) onUpdateServices(mappedServices);
      }

      if (dbAppointments.status === 'fulfilled' && dbAppointments.value.length > 0) {
        setAppointments(dbAppointments.value as any);
      }

      if (dbApprovals.status === 'fulfilled' && dbApprovals.value.length > 0) {
        const mappedApprovals: BOSApprovalItem[] = dbApprovals.value.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type as any,
          requestedBy: a.requestedByName,
          requestedByUserId: a.requestedByUserId,
          details: a.details,
          serviceId: a.serviceId,
          currentValue: a.currentValue as any,
          proposedValue: a.proposedValue as any,
          effectiveDate: a.effectiveDate,
          reason: a.reason,
          amount: a.amount,
          date: a.date,
          status: a.status as any,
        } as any));
        setApprovals(mappedApprovals);
      }

      if (dbMarketing.status === 'fulfilled' && dbMarketing.value.length > 0) {
        setPosts(dbMarketing.value as any);
      }
    } catch (err) {
      console.warn('Initial sync notice: using cached state', err);
    }
  };

  React.useEffect(() => {
    refreshFromDatabase();
  }, []);

  React.useEffect(() => {
    if (externalServices && externalServices.length > 0) {
      setServices(externalServices);
    }
  }, [externalServices]);

  React.useEffect(() => {
    if (externalAppointments && externalAppointments.length > 0) {
      setAppointments(externalAppointments);
    }
  }, [externalAppointments]);

  // Modal Control States
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<BOSAppointment | null>(null);

  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<BOSStaffRecord | null>(null);

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const [isProposePriceOpen, setIsProposePriceOpen] = useState(false);
  const [selectedServiceForPrice, setSelectedServiceForPrice] = useState<BOSService | undefined>(undefined);

  const [isScheduleSocialOpen, setIsScheduleSocialOpen] = useState(false);
  const [isAICampaignOpen, setIsAICampaignOpen] = useState(false);
  const [isCustomerAIOpen, setIsCustomerAIOpen] = useState(false);
  const [isStaffAIOpen, setIsStaffAIOpen] = useState(false);

  const [selectedApprovalItem, setSelectedApprovalItem] = useState<BOSApprovalItem | null>(null);

  // Handlers for Add/Update connected to API layer
  const handleCreateAppointment = async (newApt: BOSAppointment) => {
    try {
      const res = await api.createAppointment({
        customerName: newApt.clientName,
        customerPhone: newApt.clientPhone,
        serviceId: (newApt as any).serviceId || 'srv-1',
        staffId: (newApt as any).staffId || 'staff-1',
        date: newApt.date,
        time: newApt.time,
        paymentMethod: 'M-Pesa',
        depositPaid: newApt.deposit || 0,
      });
      setAppointments((prev) => [res.appointment as any, ...prev]);
      if (onAddAppointment) {
        onAddAppointment(res.appointment as any);
      }
    } catch (err: any) {
      alert(`Booking collision or scheduling error: ${err.message}`);
    }
  };

  const handleCreateCustomer = (newCust: BOSCustomer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleProposePrice = async (proposal: BOSApprovalItem) => {
    if (proposal.serviceId && proposal.proposedValue) {
      try {
        const res = await api.proposePrice(
          proposal.serviceId,
          Number(proposal.proposedValue),
          proposal.reason || 'Price change proposal'
        );
        setApprovals((prev) => [res.approval as any, ...prev]);
      } catch (err: any) {
        alert(`Price proposal submission error: ${err.message}`);
      }
    } else {
      setApprovals((prev) => [proposal, ...prev]);
    }
  };

  const handleSchedulePost = async (post: BOSMarketingPost) => {
    try {
      const res = await api.scheduleMarketingPost({
        title: post.title,
        series: post.series,
        platforms: post.platforms,
        publishDate: post.publishDate,
        publishTime: post.publishTime,
        notes: post.notes,
        hairTextureTag: '4C Coily & Protective Styling',
      });
      setPosts((prev) => [res.post as any, ...prev]);
    } catch (err: any) {
      setPosts((prev) => [post, ...prev]);
    }
  };

  const handleApproveItem = async (item: BOSApprovalItem) => {
    try {
      await api.decideApproval(item.id, 'Approved');
      // Refresh state from database
      await refreshFromDatabase();
    } catch (err: any) {
      alert(`Governance Failure: ${err.message}`);
    }
  };

  const handleRejectItem = async (item: BOSApprovalItem) => {
    try {
      await api.decideApproval(item.id, 'Rejected', 'Rejected by executive reviewer');
      await refreshFromDatabase();
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="flex min-h-screen bg-[#fbf9fa] text-[#141214] font-sans antialiased selection:bg-[#9b627d] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onSelectPage={setActivePage}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        onOpenStorefront={onOpenStorefront}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingApprovalsCount={pendingApprovalsCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Topbar
            activePage={activePage}
            activeRole={activeRole}
            pendingApprovalsCount={pendingApprovalsCount}
            onOpenApprovals={() => {
              setActivePage('reports');
            }}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onOpenStorefront={onOpenStorefront}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* Page Routing */}
          {activePage === 'overview' && (
            <OverviewPage
              appointments={appointments}
              onOpenAppointment={(apt) => setSelectedAppointment(apt)}
              onNavigate={setActivePage}
              pendingApprovalsCount={pendingApprovalsCount}
            />
          )}

          {activePage === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              onOpenAppointment={(apt) => setSelectedAppointment(apt)}
              onNewAppointment={() => setIsNewAppointmentOpen(true)}
            />
          )}

          {activePage === 'staff' && (
            <StaffPerformancePage
              staff={staff}
              onOpenEmployee={(member) => {
                setSelectedStaffMember(member || staff?.[0] || null);
                setIsEmployeeDetailOpen(true);
              }}
            />
          )}

          {activePage === 'customers' && (
            <CustomerCRMPage
              customers={customers}
              onAddCustomer={() => setIsAddCustomerOpen(true)}
              onOpenCampaignDraft={() => setIsAICampaignOpen(true)}
            />
          )}

          {activePage === 'services' && (
            <ServicesPricingPage
              services={services}
              onProposePriceChange={(srv) => {
                setSelectedServiceForPrice(srv);
                setIsProposePriceOpen(true);
              }}
            />
          )}

          {activePage === 'commerce' && (
            <CommercePage
              inventory={inventory}
              onNavigate={setActivePage}
              onOpenApproval={() => setActivePage('reports')}
            />
          )}

          {activePage === 'brand-experience' && (
            <BrandExperienceCMSPage onOpenStorefront={onOpenStorefront} />
          )}

          {activePage === 'marketing' && (
            <MarketingHubPage
              posts={posts}
              onSchedulePost={() => setIsScheduleSocialOpen(true)}
              onNavigate={setActivePage}
              onPostUpdated={refreshFromDatabase}
            />
          )}

          {activePage === 'ai' && (
            <AIAssistantPage
              onOpenCustomerAI={() => setIsCustomerAIOpen(true)}
              onOpenStaffAI={() => setIsStaffAIOpen(true)}
            />
          )}

          {activePage === 'reports' && (
            <ReportsApprovalsPage
              approvals={approvals}
              complaints={complaints}
              onReviewApproval={(item) => setSelectedApprovalItem(item)}
              currentUser={currentUser || undefined}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 0. Authenticated User Login Modal */}
      <AuthUserModal
        isOpen={isAuthModalOpen}
        currentUser={currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        onUserAuthenticated={(user) => {
          setCurrentUser(user);
          setActiveRole(user.role as BusinessOSRole);
        }}
      />

      {/* 1. Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={(action: any) => {
          if (action === 'new_appointment' || action === 'appointment') setIsNewAppointmentOpen(true);
          if (action === 'add_customer' || action === 'customer') setIsAddCustomerOpen(true);
          if (action === 'propose_price' || action === 'price') {
            setSelectedServiceForPrice(services?.[0]);
            setIsProposePriceOpen(true);
          }
          if (action === 'schedule_post' || action === 'social') setIsScheduleSocialOpen(true);
        }}
      />

      {/* 2. New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        services={services}
        staff={staff}
        onSave={handleCreateAppointment}
      />

      {/* 3. Existing Appointment View Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          isOpen={true}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={async (aptId, newStatus) => {
            try {
              await api.updateAppointmentStatus(aptId, newStatus);
              await refreshFromDatabase();
            } catch (err: any) {
              setAppointments((prev) =>
                prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
              );
            }
          }}
        />
      )}

      {/* 4. Employee Detail Modal */}
      <EmployeeDetailModal
        staff={staff}
        staffMember={selectedStaffMember}
        selectedStaffId={selectedStaffMember?.id}
        isOpen={isEmployeeDetailOpen}
        onClose={() => {
          setIsEmployeeDetailOpen(false);
          setSelectedStaffMember(null);
        }}
      />

      {/* 5. Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSave={handleCreateCustomer}
      />

      {/* 6. Propose Price Modal */}
      <ProposePriceModal
        services={services}
        preselectedServiceId={selectedServiceForPrice?.id}
        isOpen={isProposePriceOpen}
        onClose={() => {
          setIsProposePriceOpen(false);
          setSelectedServiceForPrice(undefined);
        }}
        onSubmitProposal={handleProposePrice}
      />

      {/* 7. Schedule Social Post Modal */}
      <ScheduleSocialModal
        isOpen={isScheduleSocialOpen}
        onClose={() => setIsScheduleSocialOpen(false)}
        onSave={handleSchedulePost}
      />

      {/* 8. AI Campaign Modal */}
      <AICampaignModal
        isOpen={isAICampaignOpen}
        onClose={() => setIsAICampaignOpen(false)}
        onConfirm={(msg) => {
          const approval: BOSApprovalItem = {
            id: `appr-camp-${Date.now()}`,
            title: 'AI Rebooking Campaign Broadcast',
            type: 'campaign_broadcast',
            requestedBy: 'AI CRM Engine',
            details: `Targeting 34 VIP clients with personalized WhatsApp reminder.`,
            reason: msg,
            date: '2026-08-28',
            status: 'Pending',
          };
          setApprovals((prev) => [approval, ...prev]);
        }}
      />

      {/* 9. Customer AI Concierge Modal */}
      <CustomerAIModal
        isOpen={isCustomerAIOpen}
        onClose={() => setIsCustomerAIOpen(false)}
      />

      {/* 10. Staff AI Assistant Modal */}
      <StaffAIModal
        isOpen={isStaffAIOpen}
        onClose={() => setIsStaffAIOpen(false)}
      />

      {/* 11. Approval Review Modal with Segregation of Duties */}
      <ApprovalReviewModal
        item={selectedApprovalItem}
        isOpen={!!selectedApprovalItem}
        onClose={() => setSelectedApprovalItem(null)}
        onApprove={handleApproveItem}
        onReject={handleRejectItem}
        currentUser={currentUser || undefined}
      />
    </div>
  );
};
