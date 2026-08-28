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

// Modals
import { QuickActionModal } from './Modals/QuickActionModal';
import { NewAppointmentModal, AppointmentDetailModal } from './Modals/NewAppointmentModal';
import { EmployeeDetailModal } from './Modals/EmployeeDetailModal';
import { AddCustomerModal } from './Modals/AddCustomerModal';
import { ProposePriceModal } from './Modals/ProposePriceModal';
import { ScheduleSocialModal } from './Modals/ScheduleSocialModal';
import { AICampaignModal } from './Modals/AICampaignModal';
import { CustomerAIModal, StaffAIModal, ApprovalReviewModal } from './Modals/CustomerAIModal';

interface BusinessOSDashboardProps {
  onOpenStorefront: () => void;
}

export const BusinessOSDashboard: React.FC<BusinessOSDashboardProps> = ({ onOpenStorefront }) => {
  // Navigation & Role State
  const [activePage, setActivePage] = useState<BusinessOSPage>('overview');
  const [activeRole, setActiveRole] = useState<BusinessOSRole>('Executive');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Datasets
  const [appointments, setAppointments] = useState<BOSAppointment[]>(INITIAL_BOS_APPOINTMENTS);
  const [staff, setStaff] = useState<BOSStaffRecord[]>(INITIAL_BOS_STAFF);
  const [customers, setCustomers] = useState<BOSCustomer[]>(INITIAL_BOS_CUSTOMERS);
  const [services, setServices] = useState<BOSService[]>(INITIAL_BOS_SERVICES);
  const [inventory, setInventory] = useState<BOSInventoryProduct[]>(INITIAL_BOS_INVENTORY);
  const [posts, setPosts] = useState<BOSMarketingPost[]>(INITIAL_BOS_MARKETING_POSTS);
  const [approvals, setApprovals] = useState<BOSApprovalItem[]>(INITIAL_BOS_APPROVALS);
  const [complaints, setComplaints] = useState<BOSComplaint[]>(INITIAL_BOS_COMPLAINTS);

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

  // Handlers for Add/Update
  const handleCreateAppointment = (newApt: BOSAppointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleCreateCustomer = (newCust: BOSCustomer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleProposePrice = (proposal: BOSApprovalItem) => {
    setApprovals((prev) => [proposal, ...prev]);
  };

  const handleSchedulePost = (post: BOSMarketingPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleApproveItem = (item: BOSApprovalItem) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: 'Approved' as const } : a))
    );

    // If price change, apply update to Service Master
    if (item.type === 'price_change' && item.serviceId && item.proposedValue) {
      setServices((prev) =>
        prev.map((s) => (s.id === item.serviceId ? { ...s, currentPrice: item.proposedValue! } : s))
      );
    }
  };

  const handleRejectItem = (item: BOSApprovalItem) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: 'Rejected' as const } : a))
    );
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

          {activePage === 'marketing' && (
            <MarketingHubPage
              posts={posts}
              onSchedulePost={() => setIsScheduleSocialOpen(true)}
              onNavigate={setActivePage}
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
            />
          )}
        </main>
      </div>

      {/* MODALS */}
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
          onUpdateStatus={(aptId, newStatus) => {
            setAppointments((prev) =>
              prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
            );
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
          // Add approval or post
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

      {/* 11. Approval Review Modal */}
      <ApprovalReviewModal
        item={selectedApprovalItem}
        isOpen={!!selectedApprovalItem}
        onClose={() => setSelectedApprovalItem(null)}
        onApprove={handleApproveItem}
        onReject={handleRejectItem}
      />
    </div>
  );
};
