export type AppPerspective = 'customer' | 'staff' | 'management' | 'learn';
export type EcosystemPerspective = 'customer' | 'book' | 'profile' | 'admin' | 'staff' | 'management' | 'education';
export type Language = 'en' | 'sw';

// Product Taxonomy & Families
export type ProductFamily =
  | 'Afro & Coily Family'
  | 'Straight Family'
  | 'Yaki Family'
  | 'Curly Family'
  | 'Braids & Twists'
  | 'Micro Twists & Boho Braids'
  | 'Weave & Installations'
  | 'Hair Styles & Install Formats'
  | 'Wigs Collection'
  | 'Hair Care & Maintenance'
  | 'Tools & Melt Kits';

export type HairTextureType =
  | '4C2'
  | '4C'
  | '4B (AKC)'
  | '4A (CAKC)'
  | '3B'
  | '4A YYE'
  | 'Straight'
  | 'Kinky Straight'
  | 'Kinky Curls'
  | 'Body Wave'
  | 'Relaxed Yaki'
  | 'Straight Yaki'
  | 'Pixie'
  | 'Deep Curly'
  | 'Deep Wave'
  | 'Kinky Curly'
  | 'Kinky Coily (4C)'
  | 'Bone Straight';

export type UnitType = 'Full bundle' | 'Half bundle (Nusu)' | 'Piece' | 'Unit' | 'Pack' | 'Wig';

export type StockStatus = 'OUT OF STOCK' | 'LOW STOCK' | 'RESTOCK SOON' | 'NORMAL' | 'HIGH STOCK';

export interface ProductVariant {
  length: string; // e.g. "14 inch", "18 inch", "24 inch", "30 inch"
  weight?: string; // e.g. "100g", "50g", "150g"
  price: number; // in TZS
  salePrice?: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  productFamily: ProductFamily;
  category: 'wigs' | 'bundles' | 'closures_frontals' | 'braided_wigs' | 'hair_care' | 'installation_tools' | 'raw_hair';
  hairType: '100% Raw Virgin' | 'Cambodian Human Hair' | 'Natural Afro 4C/4B' | 'Raw Donor Unprocessed' | 'Glueless Synthetic Blend';
  texture: HairTextureType | string;
  style?: string; // e.g. "Wefty", "Single Wefty", "Closure Wig", "Bang Wig", "U Part", "Clip-Ins", "I-Tips", "6D", "Bulk Hair", "Taping Hair"
  length?: string;
  weight?: string;
  unitType: UnitType;
  color: string;
  basePrice: number; // TZS
  salePrice?: number;
  availableQuantity: number;
  reservedQuantity: number;
  availableToSellQuantity: number;
  soldQuantity?: number;
  variants: ProductVariant[];
  images: string[];
  description: string;
  swahiliDescription?: string;
  careInstructions: string[];
  relatedProductIds?: string[];
  recommendedServiceIds?: string[];
  isActive: boolean;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  isBackorderAllowed?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  matchingProductIds?: string[];
  matchingServiceId?: string;
}

// FineTouch Services
export type ServiceCategory =
  | 'finetouch_priority'
  | 'braids_twists'
  | 'weave_installation'
  | 'hair_care'
  | 'other_styling'
  | 'wigs_maintenance'
  | 'installation'
  | 'treatment'
  | 'braiding'
  | 'spa';

export type BraidSize = 'Extra Small' | 'Small' | 'Medium' | 'Medium-Large' | 'Large';

export interface ServiceSizeOption {
  size: BraidSize;
  price: number; // TZS
  durationMinutes: number;
}

export interface Service {
  id: string;
  name: string;
  swahiliName: string;
  category: ServiceCategory;
  price: number; // TZS base
  durationMinutes: number;
  depositRequired: number; // TZS
  isPriorityProfitable?: boolean; // Management-only indicator: No Leave Out, Traditional Knots, Coloring, Braids, Weaving
  qualifiedStaffIds?: string[];
  isBookingAvailable: boolean;
  description: string;
  swahiliDescription: string;
  preparationInstructions: string[];
  aftercare: string[];
  image: string;
  sizeOptions?: ServiceSizeOption[];
  popularAddons?: { name: string; price: number }[];
  suitableFor: string[];
  recommendedProductIds?: string[];
  isActive: boolean;
}

// Bundles: Product + Service Combos
export interface ProductServiceBundle {
  id: string;
  name: string;
  swahiliName: string;
  bundleType: 'PRODUCT + INSTALLATION' | 'PRODUCT + MAINTENANCE' | 'WIG + INSTALLATION' | 'WIG + REVAMP' | 'BRAIDS + MAINTENANCE';
  productId: string;
  productName: string;
  serviceId: string;
  serviceName: string;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  description: string;
  swahiliDescription: string;
  image: string;
  isPopular?: boolean;
}

// Staff & Operations
export interface StaffMember {
  id: string;
  name: string;
  role: 'Master Wig Stylist' | 'Senior Colorist & Braider' | 'HD Lace Specialist' | 'Salon Manager' | 'Beauty Technician';
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  isAvailableToday: boolean;
  status: 'Available' | 'Booked' | 'Break' | 'Off' | 'Leave' | 'Blocked';
  reportingStreakDays: number;
  attendanceScore: number; // 0-100%
  completedAppointmentsCount: number;
  monthlyRevenueGenerated: number; // TZS
  complaintsCount: number;
  managementNotes?: string;
}

export interface StaffTask {
  id: string;
  staffId: string;
  appointmentId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  time: string;
  date: string;
  notes?: string;
  status: 'Upcoming' | 'Customer Arrived' | 'In Progress' | 'Completed' | 'No Show' | 'Cancelled';
}

export interface StaffDailyReport {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  clientsServed: number; // 0, 1, 2, 3, 4, 5+
  workCategories: string[]; // Wig, Installation, Wash, Braids, Treatment, Sales, Stock, Other
  problemCategory: 'Hakuna' | 'Stock' | 'Customer' | 'Equipment' | 'Payment' | 'Other';
  problemDetails: string;
  needsForTomorrow: string;
  voiceNoteUrl?: string;
  voiceTranscript?: string; // Natural Swahili speech: "Leo nimehudumia wateja watatu..."
  summaryNote: string;
  submittedAt: string;
  verifiedByManager?: boolean;
}

// Inventory Control, Audit Trail, Reconciliation & Exceptions
export type InventoryAction = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'CANCELLED' | 'RETURNED' | 'ADJUSTED';

export interface InventoryAuditItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  action: InventoryAction;
  quantityChange: number;
  previousAvailable: number;
  newAvailable: number;
  reason: string;
  staffName: string;
  timestamp: string;
  referenceId?: string;
}

export interface StockReconciliationItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unitType: UnitType;
  physicalCount: number;
  systemQuantity: number;
  difference: number;
  reason: string;
  staffResponsible: string;
  date: string;
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export type StockExceptionStatus =
  | 'Needs Review'
  | 'Confirmed Sale'
  | 'Internal Use'
  | 'Damaged'
  | 'Adjustment Approved'
  | 'Error Corrected';

export interface StockExceptionItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitType: UnitType;
  location: string;
  status: StockExceptionStatus;
  flaggedReason: string;
  reportedBy: string;
  date: string;
  resolutionNotes?: string;
}

// Appointments & Orders
export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  location: 'Fine Hair Salon (Mikocheni B, Ussagara Street)' | 'VIP Home / Hotel Glam';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  totalPrice: number;
  depositPaid: number;
  paymentMethod: 'M-Pesa' | 'Lipa Namba' | 'Tigo Pesa' | 'Airtel Money' | 'Card' | 'Cash at Salon';
  hairTexture?: string;
  selectedBraidSize?: BraidSize;
  notes?: string;
  createdAt: string;
  reviewRequested?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  variantLength: string;
  unitType?: UnitType;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: 'Mikocheni B Salon Pickup' | 'Dar es Salaam Same-Day Express' | 'Regional Courier (Arusha/Mwanza/Dodoma/Zanzibar)';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed';
  paymentMethod: 'M-Pesa' | 'Lipa Namba' | 'Tigo Pesa' | 'Airtel Money' | 'Card' | 'Cash on Delivery';
  paymentStatus: 'paid' | 'pending_verification' | 'pay_on_pickup';
  orderDate: string;
}

// Customer Profile & CRM
export interface CustomerHairProfile {
  name: string;
  phone: string;
  email?: string;
  isLoggedIn?: boolean;
  address?: string;
  naturalHairTexture: '4C' | '4B' | '4A' | '4C2' | '4B (AKC)' | '4A (CAKC)' | '3B' | '4A YYE' | 'Relaxed' | 'Locs';
  preferredWigStyles: string[];
  preferredLengths: string[];
  preferredDensities: string[];
  scalpSensitivity: 'Normal' | 'Sensitive to Glue' | 'Dry Scalp';
  capSize: 'Small (21.5")' | 'Medium (22.5")' | 'Large (23.5")';
  preferredStylistId?: string;
  loyaltyPoints: number;
  loyaltyTier: 'Silver Member' | 'Gold VIP' | 'Diamond Elite';
  purchasesCount?: number;
  appointmentsCount?: number;
  totalSpent?: number;
  notes?: string;
}

// Financial Management
export type FinancialTransactionType =
  | 'revenue'
  | 'expense'
  | 'stock_purchase'
  | 'staff_advance'
  | 'internal_transfer'
  | 'discount'
  | 'other_receipt';

export type PaymentMethodType = 'M-Pesa' | 'Lipa Namba' | 'Bank' | 'Cash' | 'Other';

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: FinancialTransactionType;
  paymentMethod: PaymentMethodType;
  reference: string;
  partyName: string; // Customer, Staff, Vendor, Branch
  categoryTag: string;
  notes?: string;
  status: 'completed' | 'pending' | 'reconciled';
}

export interface ManagementFinancials {
  productSalesRevenue: number;
  serviceRevenue: number;
  totalRevenue: number;
  operatingExpenses: number;
  procurementCost: number;
  staffAdvances: number;
  internalBranchTransfers: number;
  netOperatingProfit: number;
  paymentBreakdown: {
    mpesa: number;
    lipaNamba: number;
    card: number;
    cash: number;
  };
}

// Reviews, Learn & Academy
export interface Review {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  date: string;
  category: 'product' | 'service';
  targetTitle: string; // Product name or Service name
  text: string;
  categoriesBreakdown?: {
    quality: number;
    service: number;
    professionalism: number;
    timeliness: number;
  };
  verifiedPurchase: boolean;
  avatar?: string;
}

export interface AcademyTutorial {
  id: string;
  title: string;
  swahiliTitle: string;
  category: 'Wig Care' | 'Installation Guide' | 'Maintenance' | 'Lace Melting' | 'Styling Masterclass' | 'Natural 4C Hair';
  duration: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Masterclass';
  summary: string;
  swahiliSummary: string;
  steps: { title: string; detail: string }[];
  recommendedProductIds: string[];
  recommendedServiceId?: string;
  expertStylistName: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  swahiliTitle?: string;
  category: 'wig_care' | 'lace_techniques' | 'hair_textures' | 'natural_hair_care' | string;
  readTimeMinutes: number;
  coverImage: string;
  author: string;
  summary: string;
  content: string;
  tags?: string[];
  recommendedProductIds?: string[];
  recommendedServiceIds?: string[];
}
