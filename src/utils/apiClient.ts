// Fine Hair Centralized API Client connecting UI to Server Database and Business Logic Layer

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Executive' | 'Manager' | 'Staff' | 'Reception' | 'Marketing' | 'Customer';
  pin: string;
  staffId?: string;
  title: string;
  avatar: string;
  permissions: string[];
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

// Current active session tracking in browser
let activeUserId = 'usr-cfo';

export const setApiActiveUser = (userId: string) => {
  activeUserId = userId;
};

export const getApiActiveUserId = () => activeUserId;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': activeUserId,
    ...(options.headers || {}),
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
  // Auth
  getUsers: async () => (await request<{ users: UserAccount[] }>('/auth/users')).users,
  login: async (email: string, pin: string) =>
    await request<{ success: boolean; user: UserAccount }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, pin }),
    }),

  // Services
  getServices: async () => (await request<{ services: ServiceRecord[] }>('/services')).services,
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
    paymentMethod: string;
    depositPaid?: number;
    hairNotes?: string;
  }) =>
    await request<{ success: boolean; appointment: AppointmentRecord }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  updateAppointmentStatus: async (aptId: string, status: string) =>
    await request<{ success: boolean; appointment: AppointmentRecord }>(`/appointments/${aptId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Staff
  getStaff: async () => (await request<{ staff: StaffRecord[] }>('/staff')).staff,
  updateStaffAttendance: async (staffId: string, present: boolean) =>
    await request<{ success: boolean; staff: StaffRecord }>(`/staff/${staffId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ present }),
    }),

  // Customers
  getCustomers: async () => (await request<{ customers: CustomerRecord[] }>('/customers')).customers,

  // Inventory
  getInventory: async () => (await request<{ inventory: InventoryRecord[] }>('/inventory')).inventory,
  adjustInventoryStock: async (id: string, delta: number, reason: string) =>
    await request<{ success: boolean; item: InventoryRecord }>(`/inventory/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason }),
    }),

  // Approvals & Segregation of Duties
  getApprovals: async () => (await request<{ approvals: ApprovalRecord[] }>('/approvals')).approvals,
  decideApproval: async (approvalId: string, decision: 'Approved' | 'Rejected', rejectionReason?: string) =>
    await request<{ success: boolean; approval: ApprovalRecord }>(`/approvals/${approvalId}/decide`, {
      method: 'POST',
      body: JSON.stringify({ decision, rejectionReason }),
    }),

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

  // Financials & Audit Logs
  getFinancials: async () =>
    (await request<{ financials: FinancialSummary }>('/financials')).financials,
  getAuditLogs: async () => (await request<{ logs: AuditLogRecord[] }>('/audit-logs')).logs,
};
