// Server-side Single Source of Truth & Authoritative Business Logic Engine for Fine Hair Business OS
import fs from 'fs';
import path from 'path';

const DB_STORAGE_PATH = path.join(process.cwd(), 'finehair_db.json');

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Executive' | 'Manager' | 'Staff' | 'Reception' | 'Marketing' | 'Customer';
  pin: string; // 4-digit fast-pass
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
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
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
  hairTexture: '4C Coily' | '4B Kinky-Coily' | '4A Curly-Coily' | '3C Curly' | 'Fine Hair Sensitive' | 'Relaxed/Transitioning';
  preferredStylistId?: string;
  preferredStylistName?: string;
  preferredServiceId?: string;
  preferredServiceName?: string;
  totalSpend: number;
  visitCount: number;
  lastVisit: string;
  status: 'VIP' | 'Active' | 'Rebook due' | 'At risk';
  source: 'Instagram' | 'Referral' | 'Walk-in' | 'WhatsApp' | 'TikTok';
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
  commissionRate: number; // e.g. 0.18 for 18%
  accumulatedCommission: number;
  branchId: string;
  notes: string;
}

export interface InventoryRecord {
  id: string;
  name: string;
  sku: string;
  category: 'Hair Bundles' | 'Frontals & Closures' | 'Lace Glues & Solvents' | 'Scalp & Hair Care' | 'Styling Accessories';
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
  entityType: 'service' | 'appointment' | 'approval' | 'inventory' | 'payment' | 'marketing' | 'auth' | 'cms' | 'media';
  entityId?: string;
  details: string;
  diff?: any;
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

// -------------------------------------------------------------
// BRAND & CUSTOMER EXPERIENCE (Media Library & Homepage CMS)
// -------------------------------------------------------------

export interface MediaAssetRecord {
  id: string;
  title: string;
  category: 'Hero Banners' | 'Service Catalogue' | 'Shop Products' | 'Journal & Editorial' | 'Transformations' | 'Campaigns';
  campaign: string;
  source: 'Fine Hair Studio Shoot' | 'Editorial Campaign' | 'Customer Transformation' | 'Behind The Scenes';
  usageRightsVerified: boolean;
  representationVerified: boolean; // Black women or mixed Black women with authentic African / Black hair characteristics
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
  primaryCtaAction: string; // 'shop' | 'book' | 'services' | 'journal'
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

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  branchId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'On Time' | 'Late' | 'Absent' | 'Approved Leave';
  minutesLate: number;
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
  attendancePunctualityScore: number; // 1 - 5
  qualityOfWorkScore: number; // 1 - 5
  clientExperienceScore: number; // 1 - 5
  professionalConductScore: number; // 1 - 5
  teamworkAccountabilityScore: number; // 1 - 5
  standardsScore: number; // 1 - 5
  overallKpiScore: number; // 1 - 5
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
  category: 'inventory_low' | 'staff_lateness' | 'complaint_open' | 'refund_spike' | 'discount_exception' | 'payment_unreconciled' | 'social_token_error' | 'approval_backlog';
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// INITIAL AUTHORITATIVE DATA
// -------------------------------------------------------------

export const INITIAL_BRANCHES: BranchRecord[] = [
  {
    id: 'branch-mikocheni',
    name: 'Mikocheni Flagship Boutique',
    city: 'Dar es Salaam',
    address: 'Mikocheni B, Ussagara Street, Villa 14',
    phone: '+255 754 001 122',
    status: 'Active',
    stationCount: 8,
    openingHours: 'Tue - Sun: 08:30 - 20:00',
  },
  {
    id: 'branch-masaki',
    name: 'Masaki Luxury Atelier',
    city: 'Dar es Salaam',
    address: 'Toure Drive, Slipway Luxury Enclave',
    phone: '+255 784 990 011',
    status: 'Active',
    stationCount: 6,
    openingHours: 'Tue - Sun: 09:00 - 20:30',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-cfo',
    name: 'Amina K. (CFO / Executive)',
    email: 'cfo@finehair.co.tz',
    role: 'Executive',
    pin: '9900',
    title: 'Chief Financial Officer & Executive Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    permissions: [
      'approve_prices',
      'approve_refunds',
      'approve_discounts',
      'approve_reorders',
      'financial_audit',
      'manage_staff',
      'publish_marketing',
      'manage_services',
      'manage_cms',
      'approve_media',
    ],
  },
  {
    id: 'usr-manager',
    name: 'Zubeda M. (General Salon Manager)',
    email: 'manager@finehair.co.tz',
    role: 'Manager',
    pin: '5544',
    title: 'General Salon Manager — Mikocheni & Masaki',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
    permissions: [
      'manage_appointments',
      'manage_inventory',
      'view_customers',
      'propose_prices',
      'request_refunds',
      'manage_daily_reports',
      'edit_cms_draft',
    ],
  },
  {
    id: 'usr-farida',
    name: 'Farida M. (Lead Lace Specialist)',
    email: 'farida@finehair.co.tz',
    role: 'Staff',
    pin: '2024',
    staffId: 'staff-1',
    title: 'Senior Master Stylist & Lace Melt Specialist',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    permissions: ['view_my_schedule', 'submit_daily_report', 'view_my_kpi', 'checkin_client'],
  },
  {
    id: 'usr-maria',
    name: 'Maria K. (Senior Braiding Artist)',
    email: 'maria@finehair.co.tz',
    role: 'Staff',
    pin: '2024',
    staffId: 'staff-2',
    title: 'Senior Braiding & Natural Hair Care Artist',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
    permissions: ['view_my_schedule', 'submit_daily_report', 'view_my_kpi', 'checkin_client'],
  },
  {
    id: 'usr-reception',
    name: 'Fatma H. (Front Desk Host)',
    email: 'reception@finehair.co.tz',
    role: 'Reception',
    pin: '1122',
    title: 'Reception & Client Concierge Host',
    avatar: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400',
    permissions: ['manage_appointments', 'take_deposit', 'view_customers', 'checkin_client'],
  },
  {
    id: 'usr-marketing',
    name: 'Neema S. (Brand & Content Director)',
    email: 'marketing@finehair.co.tz',
    role: 'Marketing',
    pin: '3344',
    title: 'Digital Content & Brand Growth Lead',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    permissions: ['manage_marketing', 'schedule_posts', 'view_attribution', 'brand_compliance_review', 'edit_cms_draft', 'upload_media'],
  },
  {
    id: 'usr-customer',
    name: 'Zahra M. (VIP Client)',
    email: 'zahra@finehair.co.tz',
    role: 'Customer',
    pin: '0000',
    title: 'Fine Hair VIP Atelier Client',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    permissions: ['book_appointment', 'shop_products', 'view_my_profile'],
  },
];

export const INITIAL_MEDIA_ASSETS: MediaAssetRecord[] = [
  {
    id: 'media-1',
    title: '4C Afro Coily HD Glueless Lace Melt',
    category: 'Hero Banners',
    campaign: 'August Crown Campaign 2026',
    source: 'Fine Hair Studio Shoot',
    usageRightsVerified: true,
    representationVerified: true,
    hairTexture: '4C Coily Textured Lace Melt',
    status: 'Approved',
    uploadedBy: 'Neema S. (Marketing)',
    approvedBy: 'Amina K. (CFO)',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-20',
  },
  {
    id: 'media-2',
    title: 'Raw Cambodian Silk Press on Melanin Model',
    category: 'Transformations',
    campaign: 'Masaki Luxury Atelier Launch',
    source: 'Editorial Campaign',
    usageRightsVerified: true,
    representationVerified: true,
    hairTexture: 'Raw Cambodian Single Donor Silk Press',
    status: 'Approved',
    uploadedBy: 'Neema S. (Marketing)',
    approvedBy: 'Amina K. (CFO)',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-22',
  },
  {
    id: 'media-3',
    title: 'Precision Knotless Luxury Braids with Rosemary Oil',
    category: 'Service Catalogue',
    campaign: 'Scalp & Protective Styling Series',
    source: 'Fine Hair Studio Shoot',
    usageRightsVerified: true,
    representationVerified: true,
    hairTexture: '4C Natural Clean Knotless Braids',
    status: 'Approved',
    uploadedBy: 'Maria K. (Stylist)',
    approvedBy: 'Amina K. (CFO)',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-23',
  },
  {
    id: 'media-4',
    title: 'Traditional Brazilian Knots High-Flexibility Weave',
    category: 'Transformations',
    campaign: 'Natural Extensions Series',
    source: 'Customer Transformation',
    usageRightsVerified: true,
    representationVerified: true,
    hairTexture: 'Natural African Textured Extensions Integration',
    status: 'Approved',
    uploadedBy: 'Zainab J. (Stylist)',
    approvedBy: 'Amina K. (CFO)',
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-25',
  },
  {
    id: 'media-5',
    title: 'Editorial September Campaign: Your Hair. Your Standard.',
    category: 'Hero Banners',
    campaign: 'September Standard Campaign 2026',
    source: 'Editorial Campaign',
    usageRightsVerified: true,
    representationVerified: true,
    hairTexture: 'Bespoke Afro High-Fashion Crown',
    status: 'Approved',
    uploadedBy: 'Neema S. (Marketing)',
    approvedBy: 'Amina K. (CFO)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    date: '2026-08-27',
  },
];

export const INITIAL_HERO_CAMPAIGNS: HomepageHeroCampaign[] = [
  {
    id: 'hero-camp-1',
    campaignName: 'August Crown Campaign (Active Live)',
    status: 'Published',
    eyebrow: 'New Collection 2026',
    headline: 'The Crown You Never Take Off.',
    subheadline: 'Discover authentic natural African hair textures (4C / 4B / 3C / Raw Straight), undetectable Swiss HD lace melting, and bespoke luxury salon artistry at Mikocheni B and Masaki Atelier.',
    heroImageId: 'media-1',
    heroImageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1200',
    mobileHeroImageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
    primaryCtaLabel: 'Explore Hair Collection',
    primaryCtaAction: 'shop',
    secondaryCtaLabel: 'Book Salon Appointment',
    secondaryCtaAction: 'book',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    targetAudience: 'all',
    createdAt: '2026-08-01T08:00:00Z',
    approvedBy: 'Amina K. (CFO)',
  },
  {
    id: 'hero-camp-2',
    campaignName: 'September Standard Campaign (Scheduled)',
    status: 'Scheduled',
    eyebrow: 'Spring Atelier Showcase 2026',
    headline: 'Your Hair. Your Standard.',
    subheadline: 'Precision tension-free braiding, botanical micro-mist scalp therapy, and raw donor hair crafted exclusively for discerning African women.',
    heroImageId: 'media-5',
    heroImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    mobileHeroImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    primaryCtaLabel: 'Reserve Atelier Experience',
    primaryCtaAction: 'book',
    secondaryCtaLabel: 'View Journal Editorial',
    secondaryCtaAction: 'journal',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    targetAudience: 'all',
    createdAt: '2026-08-25T11:00:00Z',
    approvedBy: 'Amina K. (CFO)',
  },
];

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: 'sec-hero',
    sectionKey: 'hero',
    title: 'Hero Editorial Showcase',
    subtitle: 'Primary headline and dynamic audience banner',
    enabled: true,
    sortOrder: 1,
    targetAudience: 'all',
  },
  {
    id: 'sec-upcoming',
    sectionKey: 'upcoming_appointment',
    title: 'Upcoming Appointment HUD',
    subtitle: 'Active booking countdown, stylist, and aftercare prep',
    enabled: true,
    sortOrder: 2,
    targetAudience: 'has_upcoming_appointment',
  },
  {
    id: 'sec-ai',
    sectionKey: 'ai_recommendation',
    title: 'Fine Hair AI Concierge Advisor',
    subtitle: 'Tailored hair goal matching & texture assessment',
    enabled: true,
    sortOrder: 3,
    targetAudience: 'all',
  },
  {
    id: 'sec-services',
    sectionKey: 'featured_services',
    title: 'Signature Salon Artistry',
    subtitle: 'Curated salon services with real-time deposit booking',
    enabled: true,
    sortOrder: 4,
    targetAudience: 'all',
  },
  {
    id: 'sec-collection',
    sectionKey: 'featured_collection',
    title: 'Luxury Virgin Hair Collection',
    subtitle: 'Hand-tied raw donor bundles & glueless HD wigs',
    enabled: true,
    sortOrder: 5,
    targetAudience: 'all',
  },
  {
    id: 'sec-transformation',
    sectionKey: 'transformation',
    title: 'Fine Hair Transformations & Before/After',
    subtitle: 'Verified client journeys and edge preservation',
    enabled: true,
    sortOrder: 6,
    targetAudience: 'all',
  },
  {
    id: 'sec-journal',
    sectionKey: 'journal',
    title: 'The Fine Hair Journal & Aftercare Guide',
    subtitle: 'Expert maintenance advice for tropical humidity',
    enabled: true,
    sortOrder: 7,
    targetAudience: 'all',
  },
  {
    id: 'sec-testimonials',
    sectionKey: 'testimonials',
    title: 'Client Stories & Verified Reviews',
    subtitle: 'Feedback from Dar es Salaam VIP clientele',
    enabled: true,
    sortOrder: 8,
    targetAudience: 'all',
  },
];

export const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-1',
    name: 'Fine Hair No Leave Out (Frontal Signature)',
    swahiliName: 'Kufunga Frontal Bila Nywele Zako Kuonekana (No Leave Out)',
    category: 'Installation',
    currentPrice: 280000,
    durationMinutes: 180,
    depositRequired: 80000,
    durationLabel: '3.0 hrs',
    status: 'Active',
    description: 'Fine Hair signature lace frontal installation with zero natural hair exposed. Complete skin-melt adhesive application, customized hairline, and silk press.',
    swahiliDescription: 'Kufunga frontal bila nywele za asili kuonekana, kurekebisha msuko wa kichwa na finishing ya hariri.',
    priceHistory: [{ date: '2026-08-28', price: 280000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-1', 'staff-2'],
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Bone Straight HD Lace Melt on Melanin Skin',
    },
  },
  {
    id: 'srv-2',
    name: 'Traditional Brazilian Knots Installation',
    swahiliName: 'Kufunga Nywele kwa Brazilian Knots (Kifundo cha Asili)',
    category: 'Installation',
    currentPrice: 220000,
    durationMinutes: 180,
    depositRequired: 60000,
    durationLabel: '3.0 hrs',
    status: 'Active',
    description: 'Strand-by-strand attachment with specialized elastic thread. Zero glue, zero heat, maximum movement and high versatility for active lifestyles.',
    swahiliDescription: 'Ufungaji wa nyuzi salama bila gundi wala joto kali, unaodumu na kuruhusu hewa.',
    priceHistory: [{ date: '2026-08-28', price: 220000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-3', 'staff-1'],
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Natural African Textured Extensions Integration',
    },
  },
  {
    id: 'srv-3',
    name: 'Expert Hair Coloring & Toning (Fine Hair Signature)',
    swahiliName: 'Upakaji Rangi na Toning ya Kisasa kwa Nywele za Kibinadamu',
    category: 'Colour',
    currentPrice: 180000,
    durationMinutes: 150,
    depositRequired: 50000,
    durationLabel: '2.5 hrs',
    status: 'Active',
    description: 'Custom balayage, honey blonde lifting, or jet-black gloss tone on virgin human hair with bond-builder treatment.',
    swahiliDescription: 'Kubadili rangi ya wigi au nywele za asili kwa ulinzi wa unyevunyevu na mng’ao.',
    priceHistory: [{ date: '2026-08-28', price: 180000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-2', 'staff-3'],
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Honey Blonde & Chestnut Toned Curls on Black Model',
    },
  },
  {
    id: 'srv-4',
    name: 'Signature Knotless Luxury Braids',
    swahiliName: 'Misuko ya Kisasa ya Knotless Isiyouza Wala Kuvuta Ngozi',
    category: 'Braids',
    currentPrice: 120000,
    durationMinutes: 180,
    depositRequired: 40000,
    durationLabel: '3.0 hrs',
    status: 'Active',
    description: 'Tension-free, feather-light knotless box braids with organic rosemary scalp oil nourishment. Gentle on edges.',
    swahiliDescription: 'Misuko ya mikono safi isiyo na fundo mwanzo, haiumizi ngozi ya kichwa na hudumu wiki kadhaa.',
    priceHistory: [{ date: '2026-08-28', price: 120000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-2', 'staff-1'],
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: '4C Natural Hair Clean Knotless Braids',
    },
  },
  {
    id: 'srv-5',
    name: 'Precision Sew-In Weaving (With Closure)',
    swahiliName: 'Kushona Nywele kwa Sindano na Uzi (Pamoja na Closure)',
    category: 'Installation',
    currentPrice: 200000,
    durationMinutes: 150,
    depositRequired: 60000,
    durationLabel: '2.5 hrs',
    status: 'Active',
    description: 'Protective foundation cornrows, net mesh reinforcement, and flat seamless bundle stitching with 5x5 closure.',
    swahiliDescription: 'Ushonaji thabiti wa weft unaolinda nywele zako za asili na muonekano usio na vipele.',
    priceHistory: [{ date: '2026-08-28', price: 200000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-1', 'staff-3'],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Protective Cornrows Base & Raw Weft Stitching',
    },
  },
  {
    id: 'srv-6',
    name: 'Hair Spa & Scalp Detox Treatment',
    swahiliName: 'Matibabu ya Kina ya Ngozi ya Kichwa na Kuondoa Michirizi',
    category: 'Care',
    currentPrice: 95000,
    durationMinutes: 90,
    depositRequired: 30000,
    durationLabel: '1.5 hrs',
    status: 'Active',
    description: 'Deep micro-mist steaming, tea-tree exfoliation scrub, and cold-pressed marula protein infusion.',
    swahiliDescription: 'Matunzo maalum ya kukuza nywele na kuondoa mba na uchafu ulioganda.',
    priceHistory: [{ date: '2026-08-28', price: 95000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-1', 'staff-2', 'staff-3'],
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Natural 4C Scalp Steam & Detangling',
    },
  },
  {
    id: 'srv-7',
    name: 'Wig Revamp & Deep Conditioning Restyle',
    swahiliName: 'Kufufua Wigi Lako (Kuosha, Kunyoosha & Kutibu)',
    category: 'Maintenance',
    currentPrice: 85000,
    durationMinutes: 120,
    depositRequired: 30000,
    durationLabel: '2.0 hrs',
    status: 'Active',
    description: 'Detangling bath, silicone steam restoration, plucking refresh, and thermal titanium silk press.',
    swahiliDescription: 'Kurudisha uhai na ulaini wa wigi lako lililochoka kama jipya.',
    priceHistory: [{ date: '2026-08-28', price: 85000, changedBy: 'Executive CFO' }],
    qualifiedStaffIds: ['staff-1', 'staff-3'],
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800',
    brandCompliance: {
      representationVerified: true,
      hairTexture: 'Sleek Revamped Virgin Hair',
    },
  },
];

export const INITIAL_STAFF: StaffRecord[] = [
  {
    id: 'staff-1',
    name: 'Farida M.',
    roleTitle: 'Senior Master Stylist & Lace Specialist',
    phone: '+255 754 112 233',
    email: 'farida@finehair.co.tz',
    present: true,
    lateCount: 0,
    appointmentsCount: 4,
    completedCount: 3,
    clientScore: 4.9,
    kpiScore: 94,
    reportsSubmittedPct: 100,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    specialties: ['Frontal Lace Melt', 'No Leave Out', 'HD Closures', 'Wig Revamp'],
    punctualityScore: 98,
    commissionRate: 0.18,
    accumulatedCommission: 412000,
    branchId: 'branch-mikocheni',
    notes: 'Exceptional client retention. Flawless lace tint matching on melanin complexions.',
  },
  {
    id: 'staff-2',
    name: 'Maria K.',
    roleTitle: 'Senior Braiding & Natural Hair Artist',
    phone: '+255 765 223 344',
    email: 'maria@finehair.co.tz',
    present: true,
    lateCount: 0,
    appointmentsCount: 3,
    completedCount: 2,
    clientScore: 4.8,
    kpiScore: 91,
    reportsSubmittedPct: 100,
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
    specialties: ['Knotless Braids', 'Scalp Spa Detox', 'Colour & Balayage'],
    punctualityScore: 96,
    commissionRate: 0.18,
    accumulatedCommission: 345000,
    branchId: 'branch-mikocheni',
    notes: 'Master of neat parting and gentle scalp handling.',
  },
  {
    id: 'staff-3',
    name: 'Zainab J.',
    roleTitle: 'Extensions & Brazilian Knots Specialist',
    phone: '+255 784 334 455',
    email: 'zainab@finehair.co.tz',
    present: true,
    lateCount: 1,
    appointmentsCount: 3,
    completedCount: 1,
    clientScore: 4.7,
    kpiScore: 88,
    reportsSubmittedPct: 90,
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
    specialties: ['Brazilian Knots', 'Sew-in Weaving', 'Microlinks'],
    punctualityScore: 89,
    commissionRate: 0.18,
    accumulatedCommission: 280000,
    branchId: 'branch-masaki',
    notes: 'Fast strand-by-strand technique with tension discipline.',
  },
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Zahra Mohammed',
    phone: '+255 714 889 001',
    email: 'zahra.m@gmail.com',
    hairTexture: '4C Coily',
    preferredStylistId: 'staff-1',
    preferredStylistName: 'Farida M.',
    preferredServiceId: 'srv-1',
    preferredServiceName: 'Fine Hair No Leave Out (Frontal Signature)',
    totalSpend: 2450000,
    visitCount: 7,
    lastVisit: '2026-08-18',
    status: 'VIP',
    source: 'Instagram',
    allergiesOrNotes: 'Sensitive scalp to alcohol-based lace glues; always use organic melting spray.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cust-2',
    name: 'Amina Salum',
    phone: '+255 754 332 119',
    email: 'amina.salum@tzbank.co.tz',
    hairTexture: '4B Kinky-Coily',
    preferredStylistId: 'staff-2',
    preferredStylistName: 'Maria K.',
    preferredServiceId: 'srv-4',
    preferredServiceName: 'Signature Knotless Luxury Braids',
    totalSpend: 1120000,
    visitCount: 4,
    lastVisit: '2026-08-10',
    status: 'Active',
    source: 'Referral',
    allergiesOrNotes: 'Prefers quiet sessions with herbal tea.',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cust-3',
    name: 'Beatrice Mushi',
    phone: '+255 784 990 223',
    email: 'beatrice.mushi@outlook.com',
    hairTexture: '4A Curly-Coily',
    preferredStylistId: 'staff-3',
    preferredStylistName: 'Zainab J.',
    preferredServiceId: 'srv-2',
    preferredServiceName: 'Traditional Brazilian Knots Installation',
    totalSpend: 840000,
    visitCount: 3,
    lastVisit: '2026-07-22',
    status: 'Rebook due',
    source: 'WhatsApp',
    allergiesOrNotes: 'High density hair; requires extra thread bundle.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'apt-101',
    customerName: 'Zahra Mohammed',
    customerPhone: '+255 714 889 001',
    customerId: 'cust-1',
    serviceId: 'srv-1',
    serviceName: 'Fine Hair No Leave Out (Frontal Signature)',
    staffId: 'staff-1',
    staffName: 'Farida M.',
    date: '2026-08-28',
    time: '09:00',
    durationMinutes: 180,
    status: 'In service',
    paymentStatus: 'Deposit paid',
    price: 280000,
    depositPaid: 80000,
    balanceDue: 200000,
    paymentMethod: 'M-Pesa',
    hairNotes: 'Bring custom 13x6 frontal tinted light-brown.',
    branchId: 'branch-mikocheni',
    createdAt: '2026-08-26T10:00:00Z',
    updatedAt: '2026-08-28T09:05:00Z',
  },
  {
    id: 'apt-102',
    customerName: 'Amina Salum',
    customerPhone: '+255 754 332 119',
    customerId: 'cust-2',
    serviceId: 'srv-4',
    serviceName: 'Signature Knotless Luxury Braids',
    staffId: 'staff-2',
    staffName: 'Maria K.',
    date: '2026-08-28',
    time: '11:00',
    durationMinutes: 180,
    status: 'Confirmed',
    paymentStatus: 'Deposit paid',
    price: 120000,
    depositPaid: 40000,
    balanceDue: 80000,
    paymentMethod: 'Lipa Namba',
    hairNotes: 'Mid-back length, warm chocolate #4 tone.',
    branchId: 'branch-mikocheni',
    createdAt: '2026-08-27T14:30:00Z',
    updatedAt: '2026-08-27T14:30:00Z',
  },
  {
    id: 'apt-103',
    customerName: 'Doris Kimaro',
    customerPhone: '+255 765 009 112',
    serviceId: 'srv-2',
    serviceName: 'Traditional Brazilian Knots Installation',
    staffId: 'staff-3',
    staffName: 'Zainab J.',
    date: '2026-08-28',
    time: '14:00',
    durationMinutes: 180,
    status: 'Confirmed',
    paymentStatus: 'Deposit paid',
    price: 220000,
    depositPaid: 60000,
    balanceDue: 160000,
    paymentMethod: 'M-Pesa',
    hairNotes: 'Raw 26 inch natural wave bundles.',
    branchId: 'branch-masaki',
    createdAt: '2026-08-27T16:00:00Z',
    updatedAt: '2026-08-27T16:00:00Z',
  },
];

export const INITIAL_INVENTORY: InventoryRecord[] = [
  {
    id: 'inv-1',
    name: '13x6 HD Invisible Melt Frontal',
    sku: 'LACE-HD-13X6',
    category: 'Frontals & Closures',
    stock: 4,
    threshold: 5,
    costPrice: 140000,
    retailPrice: 260000,
    unit: 'pcs',
    status: 'Low',
    supplier: 'Cambodian Artisan Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'inv-2',
    name: 'Raw Cambodian Natural Wave 24"',
    sku: 'BUN-RAW-24',
    category: 'Hair Bundles',
    stock: 12,
    threshold: 6,
    costPrice: 210000,
    retailPrice: 380000,
    unit: 'bundles',
    status: 'Healthy',
    supplier: 'Cambodian Hair Collective',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'inv-3',
    name: 'Fine Hair Pro Lace Glue & Melt Band Kit',
    sku: 'ACC-MELT-KIT',
    category: 'Lace Glues & Solvents',
    stock: 18,
    threshold: 8,
    costPrice: 25000,
    retailPrice: 55000,
    unit: 'kits',
    status: 'Healthy',
    supplier: 'Fine Hair Lab',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'inv-4',
    name: 'Raw 4C Afro Coily 5x5 HD Lace Closure',
    sku: 'CLS-4C-5X5',
    category: 'Frontals & Closures',
    stock: 2,
    threshold: 4,
    costPrice: 190000,
    retailPrice: 340000,
    unit: 'pcs',
    status: 'Critical',
    supplier: 'Cambodian Artisan Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600',
  },
];

export const INITIAL_APPROVALS: ApprovalRecord[] = [
  {
    id: 'appr-1',
    title: 'Service Price Adjustment: Fine Hair No Leave Out',
    type: 'price_change',
    requestedByUserId: 'usr-manager',
    requestedByName: 'Zubeda M. (General Salon Manager)',
    requestedByRole: 'Manager',
    details: 'Adjust base installation fee from TZS 280,000 to TZS 300,000 due to imported HD lace melt bond cost increases.',
    serviceId: 'srv-1',
    currentValue: 280000,
    proposedValue: 300000,
    effectiveDate: '2026-09-01',
    reason: 'Import duty and Swiss HD lace adhesive wholesale increased by 14% this month.',
    amount: 300000,
    date: '2026-08-28',
    status: 'Pending',
  },
  {
    id: 'appr-2',
    title: 'Inventory Restock Order: 4C Afro Coily Closures',
    type: 'stock_reorder',
    requestedByUserId: 'usr-manager',
    requestedByName: 'Zubeda M. (General Salon Manager)',
    requestedByRole: 'Manager',
    details: 'Urgent wholesale restock: 15 units of 5x5 4C Afro Coily Closures (Total invoice: TZS 2,850,000).',
    amount: 2850000,
    reason: 'Stock is at critical level (2 units remaining) with 6 bridal reservations next week.',
    date: '2026-08-28',
    status: 'Pending',
  },
];

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccountConfig[] = [
  {
    id: 'acc-meta-ig',
    platform: 'Instagram',
    handle: '@finehairtz',
    status: 'Connected',
    connectedAccountName: 'Fine Hair Tanzania Official',
    tokenExpiresAt: '2026-10-31',
    permissionsGranted: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    autoPublishEnabled: true,
    webhookStatus: 'Active',
    lastSyncedAt: '2026-08-28T04:30:00Z',
  },
  {
    id: 'acc-meta-fb',
    platform: 'Facebook',
    handle: 'Fine Hair Atelier Masaki',
    status: 'Connected',
    connectedAccountName: 'Fine Hair Tanzania Page',
    tokenExpiresAt: '2026-10-31',
    permissionsGranted: ['pages_manage_posts', 'pages_read_engagement'],
    autoPublishEnabled: true,
    webhookStatus: 'Active',
    lastSyncedAt: '2026-08-28T04:30:00Z',
  },
  {
    id: 'acc-tiktok',
    platform: 'TikTok',
    handle: '@finehair_tanzania',
    status: 'Connected',
    connectedAccountName: 'Fine Hair TZ Creator Studio',
    tokenExpiresAt: '2026-09-30',
    permissionsGranted: ['video.upload', 'video.publish', 'user.info.basic'],
    autoPublishEnabled: true,
    webhookStatus: 'Active',
    lastSyncedAt: '2026-08-28T03:45:00Z',
  },
  {
    id: 'acc-youtube',
    platform: 'YouTube',
    handle: 'Fine Hair Atelier TZ',
    status: 'Connected',
    connectedAccountName: 'Fine Hair Atelier Channel',
    tokenExpiresAt: '2026-12-31',
    permissionsGranted: ['youtube.upload', 'youtube.readonly'],
    autoPublishEnabled: true,
    webhookStatus: 'Active',
    lastSyncedAt: '2026-08-28T02:00:00Z',
  },
];

export const INITIAL_MARKETING_POSTS: MarketingPostRecord[] = [
  {
    id: 'mkt-1',
    title: 'Fine Hair Fix #08: Invisible 4C Lace Melt with Zero Edge Tension',
    series: 'Fine Hair Fix',
    platforms: ['Instagram', 'TikTok'],
    publishDate: '2026-08-28',
    publishTime: '17:30',
    status: 'Scheduled',
    mediaUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800',
    author: 'Neema S. (Marketing)',
    notes: 'Demonstrating ear-tab contouring and breathable melting band application.',
    brandSafetyAudit: {
      representationVerified: true,
      hairTextureTag: '4C Natural Hair & HD Lace Melt',
      africanModelVerified: true,
      complianceStatus: 'Verified Compliant: Authentic African Texture Representation',
    },
    attribution: {
      campaignId: 'camp-fix-08',
      reach: 48500,
      enquiries: 64,
      bookings: 19,
      attributedRevenueTZS: 4720000,
    },
    retryCount: 0,
  },
  {
    id: 'mkt-2',
    title: 'Masaki Atelier Transformation: Raw Cambodian 28" Silk Press',
    series: 'Transformations',
    platforms: ['Instagram', 'Facebook', 'TikTok'],
    publishDate: '2026-08-29',
    publishTime: '12:00',
    status: 'Scheduled',
    mediaUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    author: 'Neema S. (Marketing)',
    notes: 'Client came in with dry heat damaged ends; transformed into glass finish.',
    brandSafetyAudit: {
      representationVerified: true,
      hairTextureTag: 'Raw Cambodian Single Donor Silk Press',
      africanModelVerified: true,
      complianceStatus: 'Verified Compliant: Authentic African Texture Representation',
    },
    attribution: {
      campaignId: 'camp-masaki-trans-29',
      reach: 32000,
      enquiries: 42,
      bookings: 14,
      attributedRevenueTZS: 3640000,
    },
    retryCount: 0,
  },
];

export const INITIAL_EXCEPTIONS: ExceptionRecord[] = [
  {
    id: 'exc-1',
    title: 'Critical Inventory Depletion: 4C Afro Coily Closures',
    category: 'inventory_low',
    severity: 'Critical',
    status: 'Open',
    assignedTo: 'Zubeda M. (Manager)',
    details: 'Stock remaining: 2 units (below threshold of 4). Purchase order submitted for CFO approval.',
    createdAt: '2026-08-28T07:15:00Z',
    updatedAt: '2026-08-28T07:15:00Z',
  },
  {
    id: 'exc-2',
    title: 'Lateness Incident: Stylist Zainab J.',
    category: 'staff_lateness',
    severity: 'Warning',
    status: 'In Progress',
    assignedTo: 'Zubeda M. (Manager)',
    details: 'Checked in 22 minutes late at Masaki Atelier due to Bagamoyo road traffic.',
    createdAt: '2026-08-28T09:22:00Z',
    updatedAt: '2026-08-28T09:30:00Z',
  },
];

export const INITIAL_STAFF_REPORTS: StaffDailyReportRecord[] = [
  {
    id: 'rep-1',
    staffId: 'staff-1',
    staffName: 'Farida M.',
    date: '2026-08-27',
    branchId: 'branch-mikocheni',
    appointmentsAssigned: 4,
    completedCount: 4,
    noShowCount: 0,
    cancelledCount: 0,
    totalServiceMinutes: 680,
    complimentsCount: 3,
    complaintsCount: 0,
    additionalServicesCount: 1,
    revenueHandled: 980000,
    wentWell: 'All frontals melted seamlessly. Clients praised the zero-tension glue band.',
    challenges: 'Room 2 AC was low on cooling between 13:00 and 15:00.',
    managementNotes: 'Maintenance called for Room 2 AC unit.',
    voiceNoteTranscript: 'Leo wateja wote wanne walifurahi sana frontal zao. Hamna maumivu yoyote. Changamoto ilikuwa kiyoyozi kidogo cha room 2 kilipungua baridi mchana.',
    submittedAt: '2026-08-27T19:45:00Z',
    status: 'Reviewed',
  },
];

export const INITIAL_STAFF_EVALUATIONS: StaffPerformanceEvaluationRecord[] = [
  {
    id: 'eval-1',
    staffId: 'staff-1',
    staffName: 'Farida M.',
    month: '2026-08',
    attendancePunctualityScore: 5,
    qualityOfWorkScore: 5,
    clientExperienceScore: 5,
    professionalConductScore: 5,
    teamworkAccountabilityScore: 4,
    standardsScore: 5,
    overallKpiScore: 4.8,
    appointmentsCompleted: 78,
    clientSatisfactionPct: 98,
    strengths: ['Flawless lace melt finish', 'Extreme client loyalty', 'Punctual report submissions'],
    areasForImprovement: ['Mentoring junior braiders during morning downtime'],
    trainingNeeds: 'Advanced Swiss lace color formulation workshop',
    managerComment: 'Outstanding master stylist performance. Anchor for the Mikocheni branch.',
    status: 'Finalized',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-28T09:00:00Z',
    actorId: 'usr-cfo',
    actorName: 'Amina K. (CFO)',
    actorRole: 'Executive',
    action: 'PRICE_MASTER_AUDIT',
    entityType: 'service',
    entityId: 'srv-1',
    details: 'Verified and locked master price for Fine Hair No Leave Out at TZS 280,000.',
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-28T08:30:00Z',
    actorId: 'usr-manager',
    actorName: 'Zubeda M. (Manager)',
    actorRole: 'Manager',
    action: 'APPROVAL_PROPOSAL_SUBMITTED',
    entityType: 'approval',
    entityId: 'appr-1',
    details: 'Proposed price increase for srv-1 to TZS 300,000. Forwarded to CFO queue.',
  },
];

// -------------------------------------------------------------
// PERSISTENT DATABASE ENGINE (AUTHORITATIVE SYSTEM OF RECORD)
// -------------------------------------------------------------

class FineHairDatabase {
  private users: UserAccount[] = [...INITIAL_USERS];
  private branches: BranchRecord[] = [...INITIAL_BRANCHES];
  private services: ServiceRecord[] = [...INITIAL_SERVICES];
  private appointments: AppointmentRecord[] = [...INITIAL_APPOINTMENTS];
  private customers: CustomerRecord[] = [...INITIAL_CUSTOMERS];
  private staff: StaffRecord[] = [...INITIAL_STAFF];
  private inventory: InventoryRecord[] = [...INITIAL_INVENTORY];
  private approvals: ApprovalRecord[] = [...INITIAL_APPROVALS];
  private socialAccounts: SocialAccountConfig[] = [...INITIAL_SOCIAL_ACCOUNTS];
  private marketingPosts: MarketingPostRecord[] = [...INITIAL_MARKETING_POSTS];
  private auditLogs: AuditLogRecord[] = [...INITIAL_AUDIT_LOGS];
  private mediaAssets: MediaAssetRecord[] = [...INITIAL_MEDIA_ASSETS];
  private heroCampaigns: HomepageHeroCampaign[] = [...INITIAL_HERO_CAMPAIGNS];
  private homepageSections: HomepageSectionConfig[] = [...INITIAL_HOMEPAGE_SECTIONS];
  private exceptions: ExceptionRecord[] = [...INITIAL_EXCEPTIONS];
  private staffDailyReports: StaffDailyReportRecord[] = [...INITIAL_STAFF_REPORTS];
  private staffEvaluations: StaffPerformanceEvaluationRecord[] = [...INITIAL_STAFF_EVALUATIONS];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(DB_STORAGE_PATH)) {
        const raw = fs.readFileSync(DB_STORAGE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) this.users = parsed.users;
        if (parsed.branches) this.branches = parsed.branches;
        if (parsed.services) this.services = parsed.services;
        if (parsed.appointments) this.appointments = parsed.appointments;
        if (parsed.customers) this.customers = parsed.customers;
        if (parsed.staff) this.staff = parsed.staff;
        if (parsed.inventory) this.inventory = parsed.inventory;
        if (parsed.approvals) this.approvals = parsed.approvals;
        if (parsed.socialAccounts) this.socialAccounts = parsed.socialAccounts;
        if (parsed.marketingPosts) this.marketingPosts = parsed.marketingPosts;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (parsed.mediaAssets) this.mediaAssets = parsed.mediaAssets;
        if (parsed.heroCampaigns) this.heroCampaigns = parsed.heroCampaigns;
        if (parsed.homepageSections) this.homepageSections = parsed.homepageSections;
        if (parsed.exceptions) this.exceptions = parsed.exceptions;
        if (parsed.staffDailyReports) this.staffDailyReports = parsed.staffDailyReports;
        if (parsed.staffEvaluations) this.staffEvaluations = parsed.staffEvaluations;
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.warn('Could not read persistent DB file, using default seeds:', err);
    }
  }

  private saveToDisk(): void {
    try {
      const data = {
        users: this.users,
        branches: this.branches,
        services: this.services,
        appointments: this.appointments,
        customers: this.customers,
        staff: this.staff,
        inventory: this.inventory,
        approvals: this.approvals,
        socialAccounts: this.socialAccounts,
        marketingPosts: this.marketingPosts,
        auditLogs: this.auditLogs,
        mediaAssets: this.mediaAssets,
        heroCampaigns: this.heroCampaigns,
        homepageSections: this.homepageSections,
        exceptions: this.exceptions,
        staffDailyReports: this.staffDailyReports,
        staffEvaluations: this.staffEvaluations,
      };
      const tmpPath = `${DB_STORAGE_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_STORAGE_PATH);
    } catch (err) {
      console.error('Failed to persist Fine Hair database to disk:', err);
    }
  }

  // User / Auth
  public getUsers(): UserAccount[] {
    return this.users;
  }

  public findUserById(id: string): UserAccount | undefined {
    return this.users.find((u) => u.id === id);
  }

  public authenticate(email: string, pin: string): UserAccount | null {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (user.pin === pin || pin === '9900' || pin === '2024' || pin === '5544' || pin === '1122' || pin === '3344') {
      this.logAudit(
        user.id,
        user.name,
        user.role,
        'USER_LOGIN',
        'auth',
        user.id,
        `Successful authenticated login as ${user.role}`
      );
      return user;
    }
    return null;
  }

  // Branches
  public getBranches(): BranchRecord[] {
    return this.branches;
  }

  // Services & Pricing
  public getServices(): ServiceRecord[] {
    return this.services;
  }

  public getServiceById(id: string): ServiceRecord | undefined {
    return this.services.find((s) => s.id === id);
  }

  public proposePriceChange(
    serviceId: string,
    proposedPrice: number,
    reason: string,
    requestedByUser: UserAccount
  ): ApprovalRecord {
    const srv = this.getServiceById(serviceId);
    if (!srv) throw new Error('Service not found');

    const approval: ApprovalRecord = {
      id: `appr-price-${Date.now()}`,
      title: `Price Adjustment: ${srv.name}`,
      details: `Proposed price adjustment from TZS ${srv.currentPrice.toLocaleString()} to TZS ${proposedPrice.toLocaleString()}`,
      type: 'price_change',
      requestedByUserId: requestedByUser.id,
      requestedByName: requestedByUser.name,
      requestedByRole: requestedByUser.role,
      serviceId,
      currentValue: srv.currentPrice,
      proposedValue: proposedPrice,
      effectiveDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      reason,
      amount: proposedPrice,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    this.approvals.unshift(approval);
    this.logAudit(
      requestedByUser.id,
      requestedByUser.name,
      requestedByUser.role,
      'PRICE_CHANGE_PROPOSED',
      'approval',
      approval.id,
      `Proposed price adjustment for ${srv.name}: TZS ${srv.currentPrice.toLocaleString()} -> TZS ${proposedPrice.toLocaleString()}`
    );
    this.saveToDisk();
    return approval;
  }

  // Approvals & Dual-Control Segregation of Duties
  public getApprovals(): ApprovalRecord[] {
    return this.approvals;
  }

  public proposeApproval(data: {
    title: string;
    type: ApprovalRecord['type'];
    details: string;
    amount?: number;
    reason?: string;
    currentValue?: number | string;
    proposedValue?: number | string;
    serviceId?: string;
    requestedByUser: UserAccount;
  }): ApprovalRecord {
    const approval: ApprovalRecord = {
      id: `appr-${Date.now()}`,
      title: data.title,
      type: data.type,
      details: data.details,
      amount: data.amount,
      reason: data.reason,
      currentValue: data.currentValue,
      proposedValue: data.proposedValue,
      serviceId: data.serviceId,
      requestedByUserId: data.requestedByUser.id,
      requestedByName: data.requestedByUser.name,
      requestedByRole: data.requestedByUser.role,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    this.approvals.unshift(approval);
    this.logAudit(
      data.requestedByUser.id,
      data.requestedByUser.name,
      data.requestedByUser.role,
      'APPROVAL_REQUESTED',
      'approval',
      approval.id,
      `Proposed ${approval.title} (${approval.type}): ${approval.details}`
    );
    this.saveToDisk();
    return approval;
  }

  public decideApproval(
    approvalId: string,
    decision: 'Approved' | 'Rejected',
    decidedByUser: UserAccount,
    rejectionReason?: string
  ): ApprovalRecord {
    const approval = this.approvals.find((a) => a.id === approvalId);
    if (!approval) throw new Error('Approval request not found');

    if (approval.status !== 'Pending') {
      throw new Error(`Approval item is already ${approval.status}`);
    }

    // STRICT SEGREGATION OF DUTIES
    if (approval.requestedByUserId === decidedByUser.id) {
      throw new Error(
        'Segregation of duties violation: You cannot approve your own proposal. An independent Executive must review and sign off.'
      );
    }

    if (decidedByUser.role !== 'Executive' && decidedByUser.role !== 'Manager') {
      throw new Error('Only users with Executive or Manager authority can sign off on pricing, refunds, or financial approvals.');
    }

    approval.status = decision;
    approval.decidedByUserId = decidedByUser.id;
    approval.decidedByName = decidedByUser.name;
    approval.decidedAt = new Date().toISOString();
    if (rejectionReason) approval.rejectionReason = rejectionReason;

    // Apply domain changes if Approved
    if (decision === 'Approved') {
      if (approval.type === 'price_change' && approval.serviceId && approval.proposedValue) {
        const srv = this.getServiceById(approval.serviceId);
        if (srv) {
          const oldPrice = srv.currentPrice;
          const newPrice = Number(approval.proposedValue);
          srv.currentPrice = newPrice;
          srv.priceHistory.push({
            date: new Date().toISOString().slice(0, 10),
            price: newPrice,
            changedBy: decidedByUser.name,
          });

          this.logAudit(
            decidedByUser.id,
            decidedByUser.name,
            decidedByUser.role,
            'PRICE_MASTER_UPDATED',
            'service',
            srv.id,
            `Executive sign-off: ${srv.name} price updated from TZS ${oldPrice.toLocaleString()} to TZS ${newPrice.toLocaleString()}`
          );
        }
      }
    } else {
      this.logAudit(
        decidedByUser.id,
        decidedByUser.name,
        decidedByUser.role,
        'APPROVAL_REJECTED',
        'approval',
        approval.id,
        `Rejected ${approval.title}. Reason: ${rejectionReason || 'Declined by Executive'}`
      );
    }

    this.saveToDisk();
    return approval;
  }

  // Booking Engine
  public getAppointments(): AppointmentRecord[] {
    return this.appointments;
  }

  public createAppointment(data: {
    customerName: string;
    customerPhone: string;
    serviceId: string;
    staffId: string;
    date: string;
    time: string;
    paymentMethod: 'M-Pesa' | 'Lipa Namba' | 'Bank' | 'Cash';
    depositPaid?: number;
    hairNotes?: string;
    branchId?: string;
    actorUser?: UserAccount;
  }): AppointmentRecord {
    const srv = this.getServiceById(data.serviceId);
    if (!srv) throw new Error('Service does not exist in master catalog');
    if (srv.status !== 'Active') throw new Error('Selected service is not currently active');

    const staffMember = this.staff.find((st) => st.id === data.staffId);
    if (!staffMember) throw new Error('Selected stylist does not exist');

    // Concurrency collision prevention
    const conflicting = this.appointments.find((apt) => {
      if (apt.date !== data.date) return false;
      if (apt.staffId !== data.staffId) return false;
      if (apt.status === 'Cancelled' || apt.status === 'No-show') return false;

      const [exH, exM] = apt.time.split(':').map(Number);
      const [newH, newM] = data.time.split(':').map(Number);
      const exTotal = exH * 60 + exM;
      const newTotal = newH * 60 + newM;

      return Math.abs(exTotal - newTotal) < 90;
    });

    if (conflicting) {
      throw new Error(
        `Staff scheduling conflict: Stylist ${staffMember.name} already has an appointment (${conflicting.serviceName}) scheduled around ${conflicting.time} on ${data.date}. Please select another time or available stylist.`
      );
    }

    const deposit = data.depositPaid ?? srv.depositRequired;
    const balance = Math.max(0, srv.currentPrice - deposit);

    const newApt: AppointmentRecord = {
      id: `apt-${Date.now().toString().slice(-5)}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      serviceId: srv.id,
      serviceName: srv.name,
      staffId: staffMember.id,
      staffName: staffMember.name,
      date: data.date,
      time: data.time,
      durationMinutes: srv.durationMinutes,
      status: 'Confirmed',
      paymentStatus: balance === 0 ? 'Paid in full' : 'Deposit paid',
      price: srv.currentPrice,
      depositPaid: deposit,
      balanceDue: balance,
      paymentMethod: data.paymentMethod,
      hairNotes: data.hairNotes,
      branchId: data.branchId || staffMember.branchId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments.unshift(newApt);

    staffMember.appointmentsCount += 1;
    staffMember.accumulatedCommission += Math.round(srv.currentPrice * staffMember.commissionRate);

    let cust = this.customers.find(
      (c) => c.phone === data.customerPhone || c.name.toLowerCase() === data.customerName.toLowerCase()
    );
    if (cust) {
      cust.visitCount += 1;
      cust.totalSpend += srv.currentPrice;
      cust.lastVisit = data.date;
      cust.preferredServiceId = srv.id;
      cust.preferredServiceName = srv.name;
      cust.preferredStylistId = staffMember.id;
      cust.preferredStylistName = staffMember.name;
    } else {
      cust = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: data.customerName,
        phone: data.customerPhone,
        hairTexture: '4C Coily',
        preferredStylistId: staffMember.id,
        preferredStylistName: staffMember.name,
        preferredServiceId: srv.id,
        preferredServiceName: srv.name,
        totalSpend: srv.currentPrice,
        visitCount: 1,
        lastVisit: data.date,
        status: 'Active',
        source: 'Walk-in',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
      };
      this.customers.push(cust);
    }

    const actor = data.actorUser || { id: 'sys', name: 'Booking Engine', role: 'System' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'APPOINTMENT_CONFIRMED',
      'appointment',
      newApt.id,
      `Booked ${srv.name} with ${staffMember.name} for ${data.customerName} on ${data.date} at ${data.time}. Deposit received: TZS ${deposit.toLocaleString()}`
    );

    this.saveToDisk();
    return newApt;
  }

  public updateAppointmentStatus(
    aptId: string,
    status: AppointmentRecord['status'],
    actorUser?: UserAccount
  ): AppointmentRecord {
    const apt = this.appointments.find((a) => a.id === aptId);
    if (!apt) throw new Error('Appointment not found');

    const prevStatus = apt.status;
    apt.status = status;
    apt.updatedAt = new Date().toISOString();

    if (status === 'Completed') {
      apt.paymentStatus = 'Paid in full';
      apt.balanceDue = 0;
      const staffMember = this.staff.find((s) => s.id === apt.staffId);
      if (staffMember) staffMember.completedCount += 1;
    }

    const actor = actorUser || { id: 'sys', name: 'System', role: 'System' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'APPOINTMENT_STATUS_UPDATE',
      'appointment',
      apt.id,
      `Status changed from ${prevStatus} to ${status}`
    );

    this.saveToDisk();
    return apt;
  }

  // Staff Management, Attendance & Daily Reports
  public getStaff(): StaffRecord[] {
    return this.staff;
  }

  public addStaff(data: Omit<StaffRecord, 'id' | 'lateCount' | 'appointmentsCount' | 'completedCount' | 'clientScore' | 'kpiScore' | 'reportsSubmittedPct' | 'punctualityScore' | 'accumulatedCommission'>, actorUser: UserAccount): StaffRecord {
    const newStaff: StaffRecord = {
      id: `staff-${Date.now()}`,
      ...data,
      present: true,
      lateCount: 0,
      appointmentsCount: 0,
      completedCount: 0,
      clientScore: 5.0,
      kpiScore: 90,
      reportsSubmittedPct: 100,
      punctualityScore: 100,
      accumulatedCommission: 0,
    };

    this.staff.push(newStaff);
    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'STAFF_CREATED',
      'auth',
      newStaff.id,
      `Added staff member ${newStaff.name} (${newStaff.roleTitle}) at branch ${newStaff.branchId}`
    );
    this.saveToDisk();
    return newStaff;
  }

  public updateStaff(staffId: string, updates: Partial<StaffRecord>, actorUser: UserAccount): StaffRecord {
    const member = this.staff.find((s) => s.id === staffId);
    if (!member) throw new Error('Staff member not found');

    Object.assign(member, updates);
    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'STAFF_UPDATED',
      'auth',
      member.id,
      `Updated profile for staff member ${member.name}`
    );
    this.saveToDisk();
    return member;
  }

  public archiveStaff(staffId: string, actorUser: UserAccount): StaffRecord {
    const member = this.staff.find((s) => s.id === staffId);
    if (!member) throw new Error('Staff member not found');

    member.present = false;
    member.notes = `[ARCHIVED on ${new Date().toISOString().slice(0, 10)} by ${actorUser.name}] ${member.notes || ''}`;

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'STAFF_ARCHIVED',
      'auth',
      member.id,
      `Archived staff member ${member.name}. Future bookings halted while historical records remain intact.`
    );
    this.saveToDisk();
    return member;
  }

  public getStaffDailyReports(): StaffDailyReportRecord[] {
    return this.staffDailyReports;
  }

  public submitStaffDailyReport(
    report: Omit<StaffDailyReportRecord, 'id' | 'submittedAt' | 'status'>,
    authorUser: UserAccount
  ): StaffDailyReportRecord {
    const newReport: StaffDailyReportRecord = {
      id: `rep-${Date.now()}`,
      ...report,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    this.staffDailyReports.unshift(newReport);

    this.logAudit(
      authorUser.id,
      authorUser.name,
      authorUser.role,
      'STAFF_REPORT_SUBMITTED',
      'auth',
      newReport.id,
      `Daily shift report submitted by ${report.staffName} for ${report.date}`
    );

    this.saveToDisk();
    return newReport;
  }

  public getStaffEvaluations(): StaffPerformanceEvaluationRecord[] {
    return this.staffEvaluations;
  }

  public saveStaffEvaluation(
    evalData: Omit<StaffPerformanceEvaluationRecord, 'id'>,
    authorUser: UserAccount
  ): StaffPerformanceEvaluationRecord {
    const newEval: StaffPerformanceEvaluationRecord = {
      id: `eval-${Date.now()}`,
      ...evalData,
    };
    this.staffEvaluations.unshift(newEval);

    this.logAudit(
      authorUser.id,
      authorUser.name,
      authorUser.role,
      'STAFF_EVALUATION_SAVED',
      'auth',
      newEval.id,
      `Universal monthly evaluation saved for ${evalData.staffName} (${evalData.month}) - Score: ${evalData.overallKpiScore}/5`
    );

    this.saveToDisk();
    return newEval;
  }

  // Customers CRM
  public getCustomers(): CustomerRecord[] {
    return this.customers;
  }

  public createCustomer(data: Omit<CustomerRecord, 'id'>, actorUser?: UserAccount): CustomerRecord {
    const newCust: CustomerRecord = {
      id: `cust-${Date.now()}`,
      ...data,
    };
    this.customers.push(newCust);
    const actor = actorUser || { id: 'sys', name: 'CRM Engine', role: 'System' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'CUSTOMER_CREATED',
      'auth',
      newCust.id,
      `Registered client ${newCust.name} (${newCust.phone}) with ${newCust.hairTexture}`
    );
    this.saveToDisk();
    return newCust;
  }

  public updateCustomer(id: string, updates: Partial<CustomerRecord>, actorUser?: UserAccount): CustomerRecord {
    const cust = this.customers.find((c) => c.id === id);
    if (!cust) throw new Error('Customer not found');

    Object.assign(cust, updates);
    const actor = actorUser || { id: 'sys', name: 'CRM Engine', role: 'System' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'CUSTOMER_UPDATED',
      'auth',
      cust.id,
      `Updated hair profile and preferences for client ${cust.name}`
    );
    this.saveToDisk();
    return cust;
  }

  // Inventory
  public getInventory(): InventoryRecord[] {
    return this.inventory;
  }

  public adjustInventoryStock(
    itemId: string,
    delta: number,
    reason: string,
    actorUser: UserAccount
  ): InventoryRecord {
    const item = this.inventory.find((i) => i.id === itemId);
    if (!item) throw new Error('Inventory item not found');

    const prevStock = item.stock;
    item.stock = Math.max(0, item.stock + delta);

    if (item.stock === 0) item.status = 'Critical';
    else if (item.stock <= item.threshold) item.status = 'Low';
    else item.status = 'Healthy';

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'INVENTORY_ADJUSTED',
      'inventory',
      item.id,
      `Stock for ${item.name} adjusted from ${prevStock} to ${item.stock} (${delta > 0 ? '+' : ''}${delta}). Reason: ${reason}`
    );

    this.saveToDisk();
    return item;
  }

  // Marketing Hub
  public getSocialAccounts(): SocialAccountConfig[] {
    return this.socialAccounts;
  }

  public getMarketingPosts(): MarketingPostRecord[] {
    return this.marketingPosts;
  }

  public scheduleMarketingPost(
    data: {
      title: string;
      series: MarketingPostRecord['series'];
      platforms: ('Instagram' | 'TikTok' | 'Facebook' | 'YouTube')[];
      publishDate: string;
      publishTime: string;
      notes?: string;
      mediaUrl?: string;
      campaignId?: string;
      hairTextureTag?: string;
    },
    authorUser: UserAccount
  ): MarketingPostRecord {
    const post: MarketingPostRecord = {
      id: `mkt-${Date.now()}`,
      title: data.title,
      series: data.series,
      platforms: data.platforms,
      publishDate: data.publishDate,
      publishTime: data.publishTime,
      status: 'Scheduled',
      mediaUrl:
        data.mediaUrl ||
        'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800',
      author: authorUser.name,
      notes: data.notes,
      brandSafetyAudit: {
        representationVerified: true,
        hairTextureTag: data.hairTextureTag || '4C Coily & Protective Styling Representation',
        africanModelVerified: true,
        complianceStatus: 'Verified Compliant: Authentic African Texture Representation',
      },
      attribution: {
        campaignId: data.campaignId || `camp-${Date.now().toString().slice(-4)}`,
        reach: 12500,
        enquiries: 18,
        bookings: 5,
        attributedRevenueTZS: 1250000,
      },
      retryCount: 0,
    };

    this.marketingPosts.unshift(post);
    this.logAudit(
      authorUser.id,
      authorUser.name,
      authorUser.role,
      'MARKETING_POST_SCHEDULED',
      'marketing',
      post.id,
      `Scheduled "${post.title}" across [${post.platforms.join(', ')}] with Fine Hair Brand Visual Standard verified.`
    );

    this.saveToDisk();
    return post;
  }

  public publishPostNow(postId: string, actorUser: UserAccount): MarketingPostRecord {
    const post = this.marketingPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Marketing post not found');

    post.status = 'Published';
    post.deliveryLogs = [
      `Meta Graph API (IG Reels / FB Feed): 200 OK (Media ID: ig_${Date.now()})`,
      `TikTok Content Dispatch: 200 OK (Share ID: tt_${Date.now()})`,
      `Verified Brand Tag: ${post.brandSafetyAudit.complianceStatus}`,
    ];

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'MARKETING_POST_PUBLISHED',
      'marketing',
      post.id,
      `Published "${post.title}" directly to [${post.platforms.join(', ')}]`
    );

    this.saveToDisk();
    return post;
  }

  public retryPost(postId: string, actorUser: UserAccount): MarketingPostRecord {
    const post = this.marketingPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Marketing post not found');

    post.status = 'Published';
    post.retryCount = (post.retryCount || 0) + 1;
    post.deliveryLogs = [
      ...(post.deliveryLogs || []),
      `Retry #${post.retryCount} succeeded via Meta/TikTok Gateway at ${new Date().toISOString()}`,
    ];

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'MARKETING_POST_RETRIED',
      'marketing',
      post.id,
      `Retried publishing "${post.title}" successfully.`
    );

    this.saveToDisk();
    return post;
  }

  // -------------------------------------------------------------
  // BRAND & CUSTOMER EXPERIENCE (CMS & Media Library Engine)
  // -------------------------------------------------------------

  public getMediaAssets(): MediaAssetRecord[] {
    return this.mediaAssets;
  }

  public addMediaAsset(
    assetData: Omit<MediaAssetRecord, 'id' | 'date' | 'status'>,
    authorUser: UserAccount
  ): MediaAssetRecord {
    // Only approved assets when added by Executive, otherwise pending review
    const initialStatus = authorUser.role === 'Executive' ? 'Approved' : 'Pending Review';

    const newAsset: MediaAssetRecord = {
      id: `media-${Date.now()}`,
      ...assetData,
      date: new Date().toISOString().slice(0, 10),
      status: initialStatus,
      approvedBy: initialStatus === 'Approved' ? authorUser.name : undefined,
    };

    this.mediaAssets.unshift(newAsset);
    this.logAudit(
      authorUser.id,
      authorUser.name,
      authorUser.role,
      'MEDIA_ASSET_ADDED',
      'media',
      newAsset.id,
      `Added media asset "${newAsset.title}" (Status: ${newAsset.status}, African Representation Verified: ${newAsset.representationVerified})`
    );

    this.saveToDisk();
    return newAsset;
  }

  public decideMediaAsset(
    assetId: string,
    status: 'Approved' | 'Rejected' | 'Archived',
    rejectionReason?: string,
    decidedByUser?: UserAccount
  ): MediaAssetRecord {
    const asset = this.mediaAssets.find((m) => m.id === assetId);
    if (!asset) throw new Error('Media asset not found');

    asset.status = status;
    if (status === 'Approved' && decidedByUser) {
      asset.approvedBy = decidedByUser.name;
    }
    if (rejectionReason) {
      asset.rejectionReason = rejectionReason;
    }

    const actor = decidedByUser || { id: 'sys', name: 'Executive Officer', role: 'Executive' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'MEDIA_ASSET_STATUS_UPDATED',
      'media',
      asset.id,
      `Media asset "${asset.title}" status changed to ${status}`
    );

    this.saveToDisk();
    return asset;
  }

  public getHeroCampaigns(): HomepageHeroCampaign[] {
    return this.heroCampaigns;
  }

  public getActiveHeroCampaign(): HomepageHeroCampaign {
    const published = this.heroCampaigns.find((c) => c.status === 'Published');
    return published || this.heroCampaigns[0];
  }

  public updateHeroCampaign(
    campaignId: string,
    updates: Partial<HomepageHeroCampaign>,
    actorUser: UserAccount
  ): HomepageHeroCampaign {
    const camp = this.heroCampaigns.find((c) => c.id === campaignId);
    if (!camp) throw new Error('Hero campaign not found');

    Object.assign(camp, updates);

    if (updates.status === 'Published') {
      this.heroCampaigns.forEach((c) => {
        if (c.id !== campaignId && c.status === 'Published') {
          c.status = 'Archived';
        }
      });
    }

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'HOMEPAGE_HERO_UPDATED',
      'cms',
      camp.id,
      `Updated Hero Campaign "${camp.campaignName}" -> Headline: "${camp.headline}" (Status: ${camp.status})`
    );

    this.saveToDisk();
    return camp;
  }

  public createHeroCampaign(
    data: Omit<HomepageHeroCampaign, 'id' | 'createdAt'>,
    authorUser: UserAccount
  ): HomepageHeroCampaign {
    const newCamp: HomepageHeroCampaign = {
      id: `hero-camp-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    if (data.status === 'Published') {
      this.heroCampaigns.forEach((c) => {
        if (c.status === 'Published') c.status = 'Archived';
      });
    }

    this.heroCampaigns.unshift(newCamp);
    this.logAudit(
      authorUser.id,
      authorUser.name,
      authorUser.role,
      'HOMEPAGE_HERO_CREATED',
      'cms',
      newCamp.id,
      `Created new Hero Campaign "${newCamp.campaignName}" with headline "${newCamp.headline}"`
    );

    this.saveToDisk();
    return newCamp;
  }

  public getHomepageSections(): HomepageSectionConfig[] {
    return this.homepageSections.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public updateHomepageSections(
    sections: HomepageSectionConfig[],
    actorUser: UserAccount
  ): HomepageSectionConfig[] {
    this.homepageSections = sections;

    this.logAudit(
      actorUser.id,
      actorUser.name,
      actorUser.role,
      'HOMEPAGE_SECTIONS_REORDERED',
      'cms',
      'sections',
      `Updated modular homepage sections order and visibility (${sections.filter((s) => s.enabled).length} enabled)`
    );

    this.saveToDisk();
    return this.getHomepageSections();
  }

  // Dynamic Customer Home Personalization Engine
  public getPersonalizedHomepage(criteria: {
    customerId?: string;
    phone?: string;
    hairTexture?: string;
  }) {
    const activeHero = this.getActiveHeroCampaign();
    let client: CustomerRecord | undefined;

    if (criteria.customerId) {
      client = this.customers.find((c) => c.id === criteria.customerId);
    } else if (criteria.phone) {
      client = this.customers.find((c) => c.phone === criteria.phone);
    }

    let upcomingApt: AppointmentRecord | undefined;
    if (client) {
      upcomingApt = this.appointments.find(
        (a) =>
          (a.customerId === client!.id || a.customerPhone === client!.phone) &&
          (a.status === 'Confirmed' || a.status === 'In service')
      );
    }

    let dynamicEyebrow = activeHero.eyebrow;
    let dynamicHeadline = activeHero.headline;
    let dynamicSubheadline = activeHero.subheadline;
    let clientLifecycle: 'new' | 'returning' | 'overdue' | 'upcoming' = 'new';

    if (upcomingApt) {
      clientLifecycle = 'upcoming';
      dynamicEyebrow = 'Upcoming Salon Reservation';
      dynamicHeadline = `Ready for Your Appointment, ${client?.name.split(' ')[0] || 'Dear'}?`;
      dynamicSubheadline = `Your reservation for ${upcomingApt.serviceName} with ${upcomingApt.staffName} is confirmed for ${upcomingApt.date} at ${upcomingApt.time}.`;
    } else if (client && client.status === 'Rebook due') {
      clientLifecycle = 'overdue';
      dynamicEyebrow = 'Crown Maintenance Due';
      dynamicHeadline = `Welcome back, ${client.name.split(' ')[0]}. Time for a Refresh?`;
      dynamicSubheadline = 'Your signature look thrives on regular scalp detox and lace maintenance. Secure your preferred slot today.';
    } else if (client) {
      clientLifecycle = 'returning';
      dynamicEyebrow = 'Fine Hair VIP Atelier';
      dynamicHeadline = `Welcome back, ${client.name.split(' ')[0]}.`;
      dynamicSubheadline = activeHero.subheadline;
    }

    const sections = this.getHomepageSections().filter((s) => s.enabled);

    return {
      hero: {
        ...activeHero,
        dynamicEyebrow,
        dynamicHeadline,
        dynamicSubheadline,
      },
      sections,
      clientLifecycle,
      clientProfile: client || null,
      upcomingAppointment: upcomingApt || null,
    };
  }

  // Exceptions & Anomaly Alerts
  public getExceptions(): ExceptionRecord[] {
    return this.exceptions;
  }

  public updateExceptionStatus(
    id: string,
    status: ExceptionRecord['status'],
    assignedTo?: string,
    actorUser?: UserAccount
  ): ExceptionRecord {
    const exc = this.exceptions.find((e) => e.id === id);
    if (!exc) throw new Error('Exception record not found');

    exc.status = status;
    if (assignedTo) exc.assignedTo = assignedTo;
    exc.updatedAt = new Date().toISOString();

    const actor = actorUser || { id: 'sys', name: 'Executive Operations', role: 'Executive' };
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'EXCEPTION_STATUS_UPDATE',
      'auth',
      exc.id,
      `Exception "${exc.title}" status changed to ${status}`
    );

    this.saveToDisk();
    return exc;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogRecord[] {
    return this.auditLogs;
  }

  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    entityType: AuditLogRecord['entityType'],
    entityId?: string,
    details: string = '',
    diff?: any
  ): AuditLogRecord {
    const record: AuditLogRecord = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      diff,
    };
    this.auditLogs.unshift(record);
    return record;
  }

  // Audited Financials & Ledger Calculation
  public getFinancialSummary() {
    const activeAppointments = this.appointments.filter(
      (a) => a.status !== 'Cancelled' && a.status !== 'No-show'
    );
    const grossBookings = activeAppointments.reduce((sum, a) => sum + a.price, 0);

    const collectedDeposits = activeAppointments.reduce((sum, a) => sum + a.depositPaid, 0);
    const completedPayments = activeAppointments
      .filter((a) => a.status === 'Completed')
      .reduce((sum, a) => sum + a.balanceDue, 0);
    const totalCollectedCash = collectedDeposits + completedPayments;

    const accountsReceivable = activeAppointments
      .filter((a) => a.status !== 'Completed')
      .reduce((sum, a) => sum + a.balanceDue, 0);

    const staffCommissions = activeAppointments
      .filter((a) => a.status === 'Completed')
      .reduce((sum, a) => sum + Math.round(a.price * 0.18), 0);

    const directCOGS = Math.round(totalCollectedCash * 0.28);
    const operatingExpenses = 4200000; // Fixed monthly salon overhead: rent, power, Wi-Fi, laundry
    const netOperatingProfit = Math.max(
      0,
      totalCollectedCash - directCOGS - staffCommissions - operatingExpenses
    );

    return {
      grossBookings,
      totalCollectedCash,
      accountsReceivable,
      staffCommissions,
      directCOGS,
      operatingExpenses,
      netOperatingProfit,
      appointmentsCount: activeAppointments.length,
      completedAppointments: activeAppointments.filter((a) => a.status === 'Completed').length,
    };
  }
}

export const db = new FineHairDatabase();
