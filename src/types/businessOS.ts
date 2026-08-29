export type BusinessOSPage =
  | 'overview'
  | 'appointments'
  | 'staff'
  | 'customers'
  | 'services'
  | 'commerce'
  | 'marketing'
  | 'brand-experience'
  | 'ai'
  | 'reports';

export type BusinessOSRole = 'Executive' | 'Manager' | 'Reception' | 'Staff' | 'Marketing';

export interface BOSStaffRecord {
  id: string;
  name: string;
  roleTitle: string;
  present: boolean;
  lateCount: number;
  appointmentsCount: number;
  completedCount: number;
  clientScore: number; // e.g. 4.8
  kpiScore: number; // e.g. 91%
  reportsSubmittedPct: number; // e.g. 100%
  avatar: string;
  specialties: string[];
  punctualityScore: number;
  notes: string;
}

export interface BOSAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  staffName: string;
  dateTime: string; // e.g. "28 Aug / 09:00"
  date: string; // "2026-08-28"
  time: string; // "09:00"
  paymentStatus: 'Deposit paid' | 'Pending balance' | 'Paid in full' | 'Unpaid';
  status: 'Confirmed' | 'In service' | 'Completed' | 'No-show' | 'Cancelled';
  price: number;
  deposit: number;
  hairNotes?: string;
}

export interface BOSCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit: string;
  preferredService: string;
  totalSpend: number; // in TZS
  status: 'VIP' | 'Active' | 'Rebook due' | 'At risk';
  source: 'Instagram' | 'Referral' | 'Walk-in' | 'WhatsApp' | 'TikTok';
  preferredStylist?: string;
  notes?: string;
  hairTexture?: string;
}

export interface BOSService {
  id: string;
  name: string;
  category: 'Installation' | 'Braids' | 'Colour' | 'Care' | 'Maintenance';
  currentPrice: number;
  duration: string;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  swahiliDescription?: string;
  popularAddons?: { name: string; price: number }[];
}

export interface BOSApprovalItem {
  id: string;
  title: string;
  type: 'price_change' | 'refund' | 'discount' | 'stock_reorder' | 'campaign_broadcast';
  requestedBy: string;
  details: string;
  serviceId?: string;
  currentValue?: string | number;
  proposedValue?: string | number;
  effectiveDate?: string;
  reason?: string;
  amount?: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface BOSComplaint {
  id: string;
  customerName: string;
  issue: string;
  staffName: string;
  status: 'Review required' | 'Under investigation' | 'Resolved';
  dueDate: string;
  notes?: string;
}

export interface BOSMarketingPost {
  id: string;
  title: string;
  series: 'Fine Hair Fix' | 'Transformations' | 'Education' | 'Behind the Scenes' | 'VIP Spotlights';
  platforms: ('Instagram' | 'TikTok' | 'Facebook' | 'YouTube')[];
  publishDate: string;
  publishTime: string;
  status: 'Scheduled' | 'Awaiting approval' | 'Draft' | 'Published';
  reachEstimate?: string;
  author: string;
  notes?: string;
}

export interface BOSInventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  status: 'Healthy' | 'Reorder' | 'Low' | 'Critical';
  price: number;
  unit: string;
}

export interface BOSAuditItem {
  id: string;
  time: string;
  message: string;
  author: string;
  type: 'appointment' | 'service' | 'marketing' | 'manager' | 'price' | 'refund';
}
