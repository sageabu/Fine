// Fine Hair Centralized API Client connecting UI to Server Database and Business Logic Layer

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Executive' | 'Manager' | 'Staff' | 'Reception' | 'Marketing' | 'Customer' | 'Supervisor' | 'Admin' | 'Stylist' | 'Colorist' | 'Trichologist' | 'System Admin';
  status: 'Active' | 'Suspended' | 'Archived' | 'Pending_Verification' | 'Pending Invitation' | 'Locked';
  mfaEnabled: boolean;
  staffId?: string;
  staffProfileId?: string;
  title: string;
  avatar: string;
  branchId?: string;
  department?: string;
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  token: string;
  userId: string;
  userRole: UserAccount['role'];
  userEmail: string;
  status: 'active' | 'revoked' | 'expired';
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface SecurityEventRecord {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ServiceRecord {
  id: string;
  name: string;
  swahiliName: string;
  category: 'Installation' | 'Braids' | 'Colour' | 'Care' | 'Maintenance';
  currentPrice: number;
  durationMinutes: number;
  depositRequired: number;
  durationLabel: string;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  swahiliDescription: string;
  priceHistory: { date: string; price: number; changedBy: string }[];
  qualifiedStaffIds: string[];
  imageUrl: string;
  brandCompliance: {
    representationVerified: boolean;
    hairTexture: string;
  };
}

export interface AppointmentRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerId?: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'Confirmed' | 'In service' | 'Completed' | 'No-show' | 'Cancelled';
  paymentStatus: 'Deposit paid' | 'Pending balance' | 'Paid in full' | 'Unpaid';
  price: number;
  depositPaid: number;
  balanceDue: number;
  paymentMethod: 'M-Pesa' | 'Lipa Namba' | 'Bank' | 'Cash';
  hairNotes?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hairTexture: string;
  preferredStylistId?: string;
  preferredStylistName?: string;
  preferredServiceId?: string;
  preferredServiceName?: string;
  totalSpend: number;
  visitCount: number;
  lastVisit: string;
  status: 'VIP' | 'Active' | 'Rebook due' | 'At risk';
  source: string;
  allergiesOrNotes?: string;
  avatar: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  email: string;
  present: boolean;
  lateCount: number;
  appointmentsCount: number;
  completedCount: number;
  clientScore: number;
  kpiScore: number;
  reportsSubmittedPct: number;
  avatar: string;
  specialties: string[];
  punctualityScore: number;
  commissionRate: number;
  accumulatedCommission: number;
  branchId: string;
  notes: string;
}

export interface InventoryRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  costPrice: number;
  retailPrice: number;
  unit: string;
  status: 'Healthy' | 'Reorder' | 'Low' | 'Critical';
  supplier: string;
  imageUrl: string;
}

export interface ApprovalRecord {
  id: string;
  title: string;
  type: 'price_change' | 'refund' | 'discount' | 'stock_reorder' | 'campaign_broadcast';
  requestedByUserId: string;
  requestedByName: string;
  requestedByRole: string;
  details: string;
  serviceId?: string;
  currentValue?: number | string;
  proposedValue?: number | string;
  effectiveDate?: string;
  reason?: string;
  amount?: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decidedByUserId?: string;
  decidedByName?: string;
  decidedAt?: string;
  rejectionReason?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
}

export interface SocialAccountConfig {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube';
  handle: string;
  status: 'Connected' | 'Token Expiring' | 'Disconnected' | 'Error';
  connectedAccountName: string;
  tokenExpiresAt: string;
  permissionsGranted: string[];
  autoPublishEnabled: boolean;
  webhookStatus: 'Active' | 'Idle' | 'Error';
  lastSyncedAt: string;
}

export interface MarketingPostRecord {
  id: string;
  title: string;
  series: 'Fine Hair Fix' | 'Transformations' | 'Education' | 'Behind the Scenes' | 'VIP Spotlights';
  platforms: ('Instagram' | 'TikTok' | 'Facebook' | 'YouTube')[];
  publishDate: string;
  publishTime: string;
  status: 'Scheduled' | 'Awaiting approval' | 'Draft' | 'Published' | 'Failed';
  mediaUrl: string;
  author: string;
  notes?: string;
  brandSafetyAudit: {
    representationVerified: boolean;
    hairTextureTag: string;
    africanModelVerified: boolean;
    complianceStatus: string;
  };
  attribution: {
    campaignId: string;
    reach: number;
    enquiries: number;
    bookings: number;
    attributedRevenueTZS: number;
  };
  deliveryLogs?: string[];
  retryCount: number;
}

export interface FinancialSummary {
  grossBookings: number;
  totalCollectedCash: number;
  accountsReceivable: number;
  staffCommissions: number;
  directCOGS: number;
  operatingExpenses: number;
  netOperatingProfit: number;
  appointmentsCount: number;
  completedAppointments: number;
}

export interface MediaAssetRecord {
  id: string;
  title: string;
  category: 'Hero Banners' | 'Service Catalogue' | 'Shop Products' | 'Journal & Editorial' | 'Transformations' | 'Campaigns';
  campaign: string;
  source: 'Fine Hair Studio Shoot' | 'Editorial Campaign' | 'Customer Transformation' | 'Behind The Scenes';
  usageRightsVerified: boolean;
  representationVerified: boolean;
  hairTexture: string;
  status: 'Approved' | 'Pending Review' | 'Draft' | 'Rejected' | 'Archived';
  uploadedBy: string;
  approvedBy?: string;
  url: string;
  thumbnailUrl: string;
  date: string;
  rejectionReason?: string;
}

export interface HomepageHeroCampaign {
  id: string;
  campaignName: string;
  status: 'Published' | 'Scheduled' | 'Draft' | 'Archived';
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroImageId: string;
  heroImageUrl: string;
  mobileHeroImageUrl: string;
  primaryCtaLabel: string;
  primaryCtaAction: string;
  secondaryCtaLabel: string;
  secondaryCtaAction: string;
  startDate: string;
  endDate: string;
  targetAudience: 'all' | 'new_clients' | 'returning_clients' | 'overdue_clients' | 'has_upcoming_appointment';
  createdAt: string;
  approvedBy?: string;
}

export interface HomepageSectionConfig {
  id: string;
  sectionKey: 'hero' | 'featured_services' | 'featured_collection' | 'promotion' | 'journal' | 'transformation' | 'ai_recommendation' | 'upcoming_appointment' | 'announcements' | 'testimonials';
  title: string;
  subtitle: string;
  enabled: boolean;
  sortOrder: number;
  targetAudience: 'all' | 'new_clients' | 'returning_clients' | 'overdue_clients' | 'has_upcoming_appointment';
  startDate?: string;
  endDate?: string;
  ctaText?: string;
  ctaLink?: string;
  bannerImage?: string;
}

export interface BranchRecord {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  status: 'Active' | 'Under Renovation';
  stationCount: number;
  openingHours: string;
}

export interface StaffDailyReportRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  branchId: string;
  appointmentsAssigned: number;
  completedCount: number;
  noShowCount: number;
  cancelledCount: number;
  totalServiceMinutes: number;
  complimentsCount: number;
  complaintsCount: number;
  additionalServicesCount: number;
  revenueHandled: number;
  wentWell: string;
  challenges: string;
  managementNotes: string;
  voiceNoteTranscript?: string;
  submittedAt: string;
  status: 'Submitted' | 'Reviewed';
}

export interface StaffPerformanceEvaluationRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  attendancePunctualityScore: number;
  qualityOfWorkScore: number;
  clientExperienceScore: number;
  professionalConductScore: number;
  teamworkAccountabilityScore: number;
  standardsScore: number;
  overallKpiScore: number;
  appointmentsCompleted: number;
  clientSatisfactionPct: number;
  strengths: string[];
  areasForImprovement: string[];
  trainingNeeds: string;
  managerComment: string;
  status: 'Draft' | 'Finalized' | 'Acknowledged';
}

export interface ExceptionRecord {
  id: string;
  title: string;
  category: string;
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

// Current active session tracking in browser
let activeToken = typeof window !== 'undefined' ? sessionStorage.getItem('finehair_token') || '' : '';
let currentUserCache: UserAccount | null = null;
let currentSessionCache: SessionRecord | null = null;

export const setApiActiveSession = (token: string, user: UserAccount, session?: SessionRecord) => {
  activeToken = token;
  currentUserCache = user;
  if (session) currentSessionCache = session;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('finehair_token', token);
    sessionStorage.setItem('finehair_user', JSON.stringify(user));
    if (session) sessionStorage.setItem('finehair_session', JSON.stringify(session));
  }
};

export const getApiActiveToken = () => activeToken;

export const getStoredUser = (): UserAccount | null => {
  if (currentUserCache) return currentUserCache;
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem('finehair_user');
    if (raw) {
      try {
        currentUserCache = JSON.parse(raw);
        return currentUserCache;
      } catch {}
    }
  }
  return null;
};

export const getStoredSession = (): SessionRecord | null => {
  if (currentSessionCache) return currentSessionCache;
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem('finehair_session');
    if (raw) {
      try {
        currentSessionCache = JSON.parse(raw);
        return currentSessionCache;
      } catch {}
    }
  }
  return null;
};

export const clearApiSession = () => {
  activeToken = '';
  currentUserCache = null;
  currentSessionCache = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('finehair_token');
    sessionStorage.removeItem('finehair_user');
    sessionStorage.removeItem('finehair_session');
    sessionStorage.removeItem('finehair_user_id');
  }
};

// Legacy bridge for existing callers
export const setApiActiveUser = (userId: string, token?: string, user?: UserAccount) => {
  if (token && user) {
    setApiActiveSession(token, user);
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to process request`);
  }
  return data;
}

export const api = {
  // Enterprise IAM & Authentication
  loginStaff: async (identifier: string, password: string) =>
    await request<{
      success: boolean;
      requiresMfa?: boolean;
      challengeId?: string;
      message?: string;
      session?: SessionRecord;
      user?: UserAccount;
      token?: string;
    }>('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  verifyStaffMfa: async (challengeId: string, code: string) =>
    await request<{
      success: boolean;
      session: SessionRecord;
      user: UserAccount;
      token: string;
    }>('/auth/staff/verify-mfa', {
      method: 'POST',
      body: JSON.stringify({ challengeId, code }),
    }),

  sendCustomerOtp: async (identifier: string, purpose?: string) =>
    await request<{
      success: boolean;
      challengeId: string;
      expiresAt: string;
      cooldownSeconds: number;
      deliveryNotice: string;
    }>('/auth/customer/send-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, purpose }),
    }),

  verifyCustomerOtp: async (challengeId: string, code: string) =>
    await request<{
      success: boolean;
      session: SessionRecord;
      user: UserAccount;
      customer: CustomerRecord;
      token: string;
    }>('/auth/customer/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ challengeId, code }),
    }),

  getMe: async () =>
    await request<{ success: boolean; user: UserAccount; session: SessionRecord }>('/auth/me'),

  logout: async () => {
    try {
      await request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
    } finally {
      clearApiSession();
    }
  },

  logoutAllDevices: async () => {
    try {
      return await request<{ success: boolean; message: string }>('/auth/logout-all', { method: 'POST' });
    } finally {
      clearApiSession();
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) =>
    await request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  inviteStaff: async (invitationData: {
    email: string;
    name: string;
    role: UserAccount['role'];
    branchId?: string;
    department?: string;
    phone?: string;
    specialties?: string[];
    commissionRate?: number;
  }) =>
    await request<{ success: boolean; invitation: any; activationLink: string }>('/auth/invite-staff', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    }),

  acceptInvitation: async (token: string, password: string) =>
    await request<{ success: boolean; user: UserAccount; message: string }>('/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  archiveStaffMember: async (staffId: string, reassignToStaffId?: string, reason?: string) =>
    await request<{ success: boolean; staff: StaffRecord; reallocatedAppointmentsCount: number }>(
      `/auth/staff/${staffId}/archive`,
      {
        method: 'POST',
        body: JSON.stringify({ reassignToStaffId, reason }),
      }
    ),

  reactivateStaffMember: async (staffId: string) =>
    await request<{ success: boolean; staff: StaffRecord }>(`/auth/staff/${staffId}/reactivate`, {
      method: 'POST',
    }),

  suspendUser: async (userId: string, reason?: string) =>
    await request<{ success: boolean; user: UserAccount }>(`/auth/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  updateUserAccess: async (
    userId: string,
    data: {
      role?: UserAccount['role'];
      permissions?: string[];
      branchId?: string;
      department?: string;
      mfaEnabled?: boolean;
    }
  ) =>
    await request<{ success: boolean; user: UserAccount }>(`/auth/users/${userId}/access`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSecurityEvents: async (limit?: number) =>
    (await request<{ events: SecurityEventRecord[] }>(`/auth/security-events${limit ? `?limit=${limit}` : ''}`)).events,

  getUsers: async () => (await request<{ users: UserAccount[] }>('/auth/users')).users,
  login: async (email: string, pinOrPass: string) =>
    await request<{ success: boolean; user: UserAccount; token?: string; session?: SessionRecord }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pinOrPass }),
    }),

  // Branches
  getBranches: async () => (await request<{ branches: BranchRecord[] }>('/branches')).branches,

  // Services Master CRUD
  getServices: async () => (await request<{ services: ServiceRecord[] }>('/services')).services,
  addService: async (serviceData: Partial<ServiceRecord>) =>
    await request<{ success: boolean; service: ServiceRecord }>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  updateService: async (id: string, serviceData: Partial<ServiceRecord>) =>
    await request<{ success: boolean; service: ServiceRecord }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  archiveService: async (id: string) =>
    await request<{ success: boolean; service: ServiceRecord }>(`/services/${id}/archive`, {
      method: 'POST',
    }),
  reactivateService: async (id: string) =>
    await request<{ success: boolean; service: ServiceRecord }>(`/services/${id}/reactivate`, {
      method: 'POST',
    }),
  proposePrice: async (serviceId: string, proposedPrice: number, reason: string) =>
    await request<{ success: boolean; approval: ApprovalRecord }>(`/services/${serviceId}/propose-price`, {
      method: 'POST',
      body: JSON.stringify({ proposedPrice, reason }),
    }),

  // Appointments
  getAppointments: async () =>
    (await request<{ appointments: AppointmentRecord[] }>('/appointments')).appointments,
  createAppointment: async (appointmentData: {
    customerName: string;
    customerPhone: string;
    serviceId: string;
    staffId: string;
    date: string;
    time: string;
    paymentMethod?: string;
    depositPaid?: number;
    hairNotes?: string;
    branchId?: string;
  }) =>
    await request<{ success: boolean; appointment: AppointmentRecord }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  updateAppointmentStatus: async (
    appointmentId: string,
    status: 'Confirmed' | 'In service' | 'Completed' | 'No-show' | 'Cancelled'
  ) =>
    await request<{ success: boolean; appointment: AppointmentRecord }>(
      `/appointments/${appointmentId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    ),

  // Staff Master
  getStaff: async () => (await request<{ staff: StaffRecord[] }>('/staff')).staff,
  addStaff: async (staffData: Partial<StaffRecord>) =>
    await request<{ success: boolean; staff: StaffRecord }>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    }),
  updateStaff: async (id: string, staffData: Partial<StaffRecord>) =>
    await request<{ success: boolean; staff: StaffRecord }>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    }),
  archiveStaff: async (id: string) =>
    await request<{ success: boolean; staff: StaffRecord }>(`/staff/${id}/archive`, {
      method: 'POST',
    }),
  reactivateStaff: async (id: string) =>
    await request<{ success: boolean; staff: StaffRecord }>(`/staff/${id}/reactivate`, {
      method: 'POST',
    }),
  recordStaffAttendance: async (staffId: string, type: 'check_in' | 'check_out') =>
    await request<{ success: boolean; staff: StaffRecord; timestamp: string }>(`/staff/${staffId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
  getStaffDailyReports: async () => (await request<{ reports: StaffDailyReportRecord[] }>('/staff/daily-reports')).reports,
  submitDailyReport: async (reportData: Partial<StaffDailyReportRecord>) =>
    await request<{ success: boolean; report: StaffDailyReportRecord }>('/staff/daily-reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),
  getStaffEvaluations: async () => (await request<{ evaluations: StaffPerformanceEvaluationRecord[] }>('/staff/evaluations')).evaluations,
  saveStaffEvaluation: async (evalData: Partial<StaffPerformanceEvaluationRecord>) =>
    await request<{ success: boolean; evaluation: StaffPerformanceEvaluationRecord }>('/staff/evaluations', {
      method: 'POST',
      body: JSON.stringify(evalData),
    }),

  // Customers CRM & Complaints
  getCustomers: async () => (await request<{ customers: CustomerRecord[] }>('/customers')).customers,
  createCustomer: async (data: Partial<CustomerRecord>) =>
    await request<{ success: boolean; customer: CustomerRecord }>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: async (id: string, data: Partial<CustomerRecord>) =>
    await request<{ success: boolean; customer: CustomerRecord }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getComplaints: async () => (await request<{ complaints: any[] }>('/customers/complaints')).complaints,
  createComplaint: async (data: any) =>
    await request<{ success: boolean; complaint: any }>('/customers/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComplaintStatus: async (id: string, status: string, resolutionNotes?: string) =>
    await request<{ success: boolean; complaint: any }>(`/customers/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNotes }),
    }),

  // Inventory & Stock Movements
  getInventory: async () => (await request<{ inventory: InventoryRecord[] }>('/inventory')).inventory,
  getProducts: async () => (await request<{ inventory: InventoryRecord[] }>('/inventory')).inventory,
  adjustInventory: async (itemId: string, delta: number, reason: string) =>
    await request<{ success: boolean; item: InventoryRecord }>(`/inventory/${itemId}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason }),
    }),
  getStockMovements: async () => (await request<{ movements: any[] }>('/inventory/movements')).movements,
  recordStockMovement: async (inventoryId: string, type: string, quantityChange: number, reason: string) =>
    await request<{ success: boolean; movement: any }>('/inventory/movement', {
      method: 'POST',
      body: JSON.stringify({ inventoryId, type, quantityChange, reason }),
    }),

  // Approvals
  getApprovals: async () => (await request<{ approvals: ApprovalRecord[] }>('/approvals')).approvals,
  decideApproval: async (approvalId: string, decision: 'Approved' | 'Rejected', rejectionReason?: string) =>
    await request<{ success: boolean; approval: ApprovalRecord }>(`/approvals/${approvalId}/decide`, {
      method: 'POST',
      body: JSON.stringify({ decision, rejectionReason }),
    }),

  // Brand & Customer Experience (CMS & Media Library)
  getMediaAssets: async () => (await request<{ mediaAssets: MediaAssetRecord[] }>('/brand-experience/media-library')).mediaAssets,
  addMediaAsset: async (assetData: Partial<MediaAssetRecord>) =>
    await request<{ success: boolean; asset: MediaAssetRecord }>('/brand-experience/media-library', {
      method: 'POST',
      body: JSON.stringify(assetData),
    }),
  decideMediaAsset: async (assetId: string, status: 'Approved' | 'Rejected' | 'Archived', rejectionReason?: string) =>
    await request<{ success: boolean; asset: MediaAssetRecord }>(`/brand-experience/media-library/${assetId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    }),
  getHeroCampaigns: async () =>
    await request<{ campaigns: HomepageHeroCampaign[]; activeHero: HomepageHeroCampaign }>('/brand-experience/hero-campaigns'),
  createHeroCampaign: async (campaign: Partial<HomepageHeroCampaign>) =>
    await request<{ success: boolean; campaign: HomepageHeroCampaign }>('/brand-experience/hero-campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    }),
  updateHeroCampaign: async (id: string, campaign: Partial<HomepageHeroCampaign>) =>
    await request<{ success: boolean; campaign: HomepageHeroCampaign }>(`/brand-experience/hero-campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    }),
  rollbackHeroCampaign: async (id: string) =>
    await request<{ success: boolean; campaign: HomepageHeroCampaign }>(`/brand-experience/hero-campaigns/${id}/rollback`, {
      method: 'POST',
    }),
  getHomepageSections: async () =>
    (await request<{ sections: HomepageSectionConfig[] }>('/brand-experience/sections')).sections,
  updateHomepageSections: async (sections: HomepageSectionConfig[]) =>
    await request<{ success: boolean; sections: HomepageSectionConfig[] }>('/brand-experience/sections', {
      method: 'PUT',
      body: JSON.stringify({ sections }),
    }),
  getPersonalizedHome: async (criteria: { customerId?: string; phone?: string; hairTexture?: string }) =>
    await request<{
      hero: HomepageHeroCampaign & {
        dynamicEyebrow: string;
        dynamicHeadline: string;
        dynamicSubheadline: string;
      };
      sections: HomepageSectionConfig[];
      clientLifecycle: 'new' | 'returning' | 'overdue' | 'upcoming';
      clientProfile: CustomerRecord | null;
      upcomingAppointment: AppointmentRecord | null;
    }>('/brand-experience/personalize-home', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),

  // Payments & Ledger
  createPaymentIntent: async (data: {
    appointmentId?: string;
    orderId?: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    provider?: string;
  }) =>
    await request<{ success: boolean; paymentIntent: any }>('/payments/intent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPaymentWebhook: async (payload: any) =>
    await request<{ success: boolean; verified: boolean; transactionId: string }>('/payments/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Assistance Layer
  getAiConcierge: async (query: string, hairTexture?: string, budgetTZS?: number) =>
    await request<{ success: boolean; recommendation: any }>('/ai/concierge', {
      method: 'POST',
      body: JSON.stringify({ query, hairTexture, budgetTZS }),
    }),
  getAiManagementAdvisor: async () =>
    await request<{ success: boolean; insights: any }>('/ai/management-advisor'),

  // Marketing
  getSocialAccounts: async () =>
    (await request<{ accounts: SocialAccountConfig[] }>('/marketing/accounts')).accounts,
  getMarketingPosts: async () =>
    (await request<{ posts: MarketingPostRecord[] }>('/marketing/posts')).posts,
  scheduleMarketingPost: async (postData: {
    title: string;
    series: string;
    platforms: string[];
    publishDate: string;
    publishTime: string;
    notes?: string;
    mediaUrl?: string;
    campaignId?: string;
    hairTextureTag?: string;
  }) =>
    await request<{ success: boolean; post: MarketingPostRecord }>('/marketing/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  publishPostNow: async (postId: string) =>
    await request<{ success: boolean; post: MarketingPostRecord }>(`/marketing/posts/${postId}/publish-now`, {
      method: 'POST',
    }),
  retryPost: async (postId: string) =>
    await request<{ success: boolean; post: MarketingPostRecord }>(`/marketing/posts/${postId}/retry`, {
      method: 'POST',
    }),

  // Exceptions
  getExceptions: async () => (await request<{ exceptions: ExceptionRecord[] }>('/exceptions')).exceptions,
  updateException: async (id: string, status: string, assignedTo?: string) =>
    await request<{ success: boolean; exception: ExceptionRecord }>(`/exceptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignedTo }),
    }),

  // Audit Logs & Financials
  getAuditLogs: async () => (await request<{ logs: AuditLogRecord[] }>('/audit-logs')).logs,
  getFinancials: async () => (await request<{ financials: FinancialSummary }>('/financials')).financials,

  // Company Settings & Bootstrap
  getCompanySettings: async () => await request<{ settings: any; branches: any[]; decisionAuthorities: string[]; paymentMethods: string[]; communicationMethods: string[]; socialPlatforms: string[] }>('/settings'),
  updateCompanySettings: async (settings: any) => await request<{ success: boolean; settings: any }>('/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  }),
  bootstrapOrganization: async (data: any) => await request<{ success: boolean; message: string }>('/bootstrap', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Automated Security Test Suite (PART 55)
  runSecurityTestSuite: async () => await request<any>('/security/test-suite'),
};
