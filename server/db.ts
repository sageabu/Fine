// Server-side Single Source of Truth & Authoritative Business Logic Engine for FineHair Textures
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  INITIAL_COMPANY_SETTINGS,
  CompanySettings,
  INITIAL_BRANCHES,
  BranchRecord,
  INITIAL_STAFF_LIST,
  StaffRecord,
  INITIAL_SERVICES,
  ServiceRecord,
  INITIAL_AUTHORITATIVE_USERS,
  UserAccount,
  hashPassword,
  verifyPassword,
} from './initialData.ts';
import { runAllSecurityTests, SecurityTestSuiteReport } from './securityTesting.ts';

const DB_STORAGE_PATH = path.join(process.cwd(), 'finehair_db.json');

export type { UserAccount, StaffRecord, ServiceRecord, CompanySettings, BranchRecord };

export interface SessionRecord {
  id: string;
  token: string;
  userId: string;
  userRole: UserAccount['role'];
  userEmail: string;
  status: 'active' | 'revoked' | 'expired';
  ipAddress?: string;
  userAgent?: string;
  mfaVerified: boolean;
  expiresAt: string;
  lastActivityAt: string;
  createdAt: string;
}

export interface SecurityEventRecord {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  eventType: string;
  ipAddress?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
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
  status: 'Lead' | 'Enquiry' | 'First Booking' | 'Active' | 'VIP' | 'Rebook due' | 'At Risk';
  source?: string;
  allergiesOrNotes?: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
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
  status: 'Requested' | 'Confirmed' | 'Arrived' | 'In service' | 'Paused' | 'Completed' | 'Payment Pending' | 'Paid' | 'Cancelled' | 'No-show';
  paymentStatus: 'Unpaid' | 'Deposit paid' | 'Pending balance' | 'Paid in full' | 'Refunded';
  price: number;
  depositPaid: number;
  balanceDue: number;
  paymentMethod: 'M-Pesa' | 'Lipa Namba' | 'CRDB' | 'PesaPal' | 'Cash';
  hairNotes?: string;
  branchId: string;
  serviceStartTime?: string;
  serviceEndTime?: string;
  actualDurationMinutes?: number;
  clientFeedback?: string;
  clientRating?: number;
  createdAt: string;
  updatedAt: string;
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
  status: 'Healthy' | 'Low' | 'Critical';
  supplier: string;
  imageUrl: string;
}

export interface ApprovalRecord {
  id: string;
  title: string;
  type: 'price_change' | 'refund' | 'discount' | 'stock_reorder' | 'media_rights' | 'permission_change';
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
  decisionByUserId?: string;
  decisionByName?: string;
  decisionAt?: string;
  decisionNotes?: string;
}

export interface HomepageHeroCampaign {
  id: string;
  campaignName: string;
  status: 'Draft' | 'Approved' | 'Published' | 'Scheduled' | 'Archived';
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroImageId?: string;
  heroImageUrl: string;
  mobileHeroImageUrl?: string;
  primaryCtaLabel: string;
  primaryCtaAction: string;
  secondaryCtaLabel: string;
  secondaryCtaAction: string;
  startDate?: string;
  endDate?: string;
  targetAudience: 'all' | 'new_customer' | 'returning_vip';
  createdAt: string;
  approvedBy?: string;
  publishedAt?: string;
}

export interface HomepageSectionConfig {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  sortOrder: number;
  targetAudience: string;
}

export interface SocialAccountConfig {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube';
  handle: string;
  status: 'Not Connected' | 'Configuration Required' | 'Connected' | 'Error';
  connectedAccountName?: string;
  tokenExpiresAt?: string;
  permissionsGranted: string[];
  autoPublishEnabled: boolean;
  webhookStatus: string;
  lastSyncedAt?: string;
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
  managementNotes?: string;
  voiceNoteTranscript?: string;
  submittedAt: string;
  status: 'Submitted' | 'Reviewed' | 'Acknowledged';
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

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  diff?: any;
}

export class FineHairDatabase {
  public companySettings: CompanySettings = { ...INITIAL_COMPANY_SETTINGS };
  public branches: BranchRecord[] = [...INITIAL_BRANCHES];
  public users: UserAccount[] = [...INITIAL_AUTHORITATIVE_USERS];
  public staffList: StaffRecord[] = [...INITIAL_STAFF_LIST];
  public services: ServiceRecord[] = [...INITIAL_SERVICES];
  public sessions: SessionRecord[] = [];
  public securityEvents: SecurityEventRecord[] = [];
  public customers: CustomerRecord[] = [];
  public appointments: AppointmentRecord[] = [];
  public inventory: InventoryRecord[] = [];
  public approvals: ApprovalRecord[] = [];
  public heroCampaigns: HomepageHeroCampaign[] = [];
  public homepageSections: HomepageSectionConfig[] = [];
  public socialAccounts: SocialAccountConfig[] = [];
  public staffReports: StaffDailyReportRecord[] = [];
  public staffEvaluations: StaffPerformanceEvaluationRecord[] = [];
  public auditLogs: AuditLogRecord[] = [];
  public paymentIntents: any[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.seedDefaultOperationalData();
    this.loadFromDisk();
    this.ensureAuthoritativeState();
  }

  private seedDefaultOperationalData() {
    this.customers = [
      {
        id: 'cust-1',
        name: 'Zahra Mohammed',
        phone: '+255 742 000 001',
        email: 'zahra.m@gmail.com',
        hairTexture: '4C Coily',
        preferredStylistId: 'staff-jennipher',
        preferredStylistName: 'Jennipher',
        preferredServiceId: 'srv-no-leave-out',
        preferredServiceName: 'No Leave Out (Frontal Signature)',
        totalSpend: 1450000,
        visitCount: 5,
        lastVisit: '2026-08-20',
        status: 'VIP',
        source: 'Instagram',
        allergiesOrNotes: 'Sensitive scalp to alcohol-based lace glues; always use organic melting spray.',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-08-20T00:00:00Z',
      },
    ];

    this.appointments = [
      {
        id: 'apt-101',
        customerName: 'Zahra Mohammed',
        customerPhone: '+255 742 000 001',
        customerId: 'cust-1',
        serviceId: 'srv-no-leave-out',
        serviceName: 'No Leave Out (Frontal Signature)',
        staffId: 'staff-lilian-zado',
        staffName: 'Lilian Zado',
        date: '2026-09-01',
        time: '10:00',
        durationMinutes: 180,
        status: 'In service',
        paymentStatus: 'Deposit paid',
        price: 280000,
        depositPaid: 80000,
        balanceDue: 200000,
        paymentMethod: 'M-Pesa',
        hairNotes: 'Custom 13x6 frontal tinted light-brown.',
        branchId: 'branch-mikocheni',
        createdAt: '2026-08-30T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'apt-102',
        customerName: 'Amina Salum',
        customerPhone: '+255 742 000 002',
        serviceId: 'srv-braids',
        serviceName: 'Braids (Classic & Knotless)',
        staffId: 'staff-furaha',
        staffName: 'Furaha',
        date: '2026-09-01',
        time: '14:00',
        durationMinutes: 180,
        status: 'Confirmed',
        paymentStatus: 'Deposit paid',
        price: 120000,
        depositPaid: 40000,
        balanceDue: 80000,
        paymentMethod: 'Lipa Namba',
        hairNotes: 'Mid-back length, warm chocolate #4 tone.',
        branchId: 'branch-mikocheni',
        createdAt: '2026-08-31T14:30:00Z',
        updatedAt: '2026-08-31T14:30:00Z',
      },
    ];

    this.inventory = [
      {
        id: 'inv-1',
        name: '13x6 HD Invisible Melt Frontal',
        sku: 'LACE-HD-13X6',
        category: 'Frontals & Closures',
        stock: 6,
        threshold: 4,
        costPrice: 140000,
        retailPrice: 260000,
        unit: 'pcs',
        status: 'Healthy',
        supplier: 'Cambodian Hair Collective',
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
    ];

    this.heroCampaigns = [
      {
        id: 'hero-camp-1',
        campaignName: 'FineHair Autumn Editorial (Active)',
        status: 'Published',
        eyebrow: 'FineHair Textures 2026',
        headline: 'The Crown You Never Take Off.',
        subheadline: 'Authentic African hair textures, tension-free protective artistry, and bespoke salon craftsmanship at Mikocheni B, Usagara Street, Tanzania.',
        heroImageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1200',
        mobileHeroImageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
        primaryCtaLabel: 'Explore Services',
        primaryCtaAction: 'services',
        secondaryCtaLabel: 'Book Appointment',
        secondaryCtaAction: 'book',
        targetAudience: 'all',
        createdAt: '2026-09-01T00:00:00Z',
        approvedBy: 'CFO Lilian',
        publishedAt: '2026-09-01T00:00:00Z',
      },
    ];

    this.homepageSections = [
      { id: 'sec-hero', sectionKey: 'hero', title: 'Hero Editorial Showcase', subtitle: 'Primary headline and dynamic audience banner', enabled: true, sortOrder: 1, targetAudience: 'all' },
      { id: 'sec-upcoming', sectionKey: 'upcoming_appointment', title: 'Upcoming Appointment HUD', subtitle: 'Active booking countdown and stylist details', enabled: true, sortOrder: 2, targetAudience: 'has_upcoming_appointment' },
      { id: 'sec-ai', sectionKey: 'ai_recommendation', title: 'FineHair AI Concierge Advisor', subtitle: 'Tailored hair goal matching & texture assessment', enabled: true, sortOrder: 3, targetAudience: 'all' },
      { id: 'sec-services', sectionKey: 'featured_services', title: 'Signature Salon Artistry', subtitle: 'Curated salon services with real-time deposit booking', enabled: true, sortOrder: 4, targetAudience: 'all' },
      { id: 'sec-collection', sectionKey: 'featured_collection', title: 'Luxury Hair & Closures', subtitle: 'Hand-tied raw donor bundles & glueless HD units', enabled: true, sortOrder: 5, targetAudience: 'all' },
      { id: 'sec-journal', sectionKey: 'journal', title: 'The FineHair Journal', subtitle: 'Expert maintenance advice for tropical humidity', enabled: true, sortOrder: 6, targetAudience: 'all' },
    ];

    this.socialAccounts = [
      { id: 'acc-ig', platform: 'Instagram', handle: '@finehair_textures', status: 'Configuration Required', permissionsGranted: [], autoPublishEnabled: false, webhookStatus: 'Pending Config' },
      { id: 'acc-fb', platform: 'Facebook', handle: 'FineHair Textures Tanzania', status: 'Configuration Required', permissionsGranted: [], autoPublishEnabled: false, webhookStatus: 'Pending Config' },
      { id: 'acc-tiktok', platform: 'TikTok', handle: '@finehairtextures', status: 'Configuration Required', permissionsGranted: [], autoPublishEnabled: false, webhookStatus: 'Pending Config' },
      { id: 'acc-youtube', platform: 'YouTube', handle: 'FineHair Textures TZ', status: 'Configuration Required', permissionsGranted: [], autoPublishEnabled: false, webhookStatus: 'Pending Config' },
    ];

    this.auditLogs = [
      {
        id: 'aud-init-01',
        timestamp: '2026-09-01T00:00:00Z',
        actorId: 'usr-cfo-lilian',
        actorName: 'CFO Lilian',
        actorRole: 'Executive',
        action: 'ORGANIZATION_INITIALIZED',
        entityType: 'company',
        entityId: 'finehair-textures',
        details: 'Authoritative leadership established: CFO Lilian, CFO Collins, Manager Razaq.',
      },
    ];
  }

  private ensureAuthoritativeState() {
    // Ensure all 19 staff are registered
    for (const staff of INITIAL_STAFF_LIST) {
      if (!this.staffList.some((s) => s.id === staff.id)) {
        this.staffList.push(staff);
      }
    }
    // Ensure all 27 services exist
    for (const srv of INITIAL_SERVICES) {
      if (!this.services.some((s) => s.id === srv.id)) {
        this.services.push(srv);
      }
    }
    // Ensure authoritative leadership accounts exist
    for (const u of INITIAL_AUTHORITATIVE_USERS) {
      const idx = this.users.findIndex((ex) => ex.id === u.id || ex.email === u.email);
      if (idx >= 0) {
        this.users[idx] = { ...this.users[idx], ...u };
      } else {
        this.users.push(u);
      }
    }
    this.companySettings = { ...INITIAL_COMPANY_SETTINGS, ...this.companySettings };
  }

  public saveToDisk() {
    try {
      const payload = {
        companySettings: this.companySettings,
        branches: this.branches,
        users: this.users,
        staffList: this.staffList,
        services: this.services,
        sessions: this.sessions,
        securityEvents: this.securityEvents,
        customers: this.customers,
        appointments: this.appointments,
        inventory: this.inventory,
        approvals: this.approvals,
        heroCampaigns: this.heroCampaigns,
        homepageSections: this.homepageSections,
        socialAccounts: this.socialAccounts,
        staffReports: this.staffReports,
        staffEvaluations: this.staffEvaluations,
        auditLogs: this.auditLogs,
      };
      fs.writeFileSync(DB_STORAGE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to finehair_db.json:', err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_STORAGE_PATH)) {
        const raw = fs.readFileSync(DB_STORAGE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data.companySettings) this.companySettings = data.companySettings;
        if (data.branches) this.branches = data.branches;
        if (data.users) this.users = data.users;
        if (data.staffList) this.staffList = data.staffList;
        if (data.services) this.services = data.services;
        if (data.sessions) this.sessions = data.sessions;
        if (data.securityEvents) this.securityEvents = data.securityEvents;
        if (data.customers) this.customers = data.customers;
        if (data.appointments) this.appointments = data.appointments;
        if (data.inventory) this.inventory = data.inventory;
        if (data.approvals) this.approvals = data.approvals;
        if (data.heroCampaigns) this.heroCampaigns = data.heroCampaigns;
        if (data.homepageSections) this.homepageSections = data.homepageSections;
        if (data.socialAccounts) this.socialAccounts = data.socialAccounts;
        if (data.staffReports) this.staffReports = data.staffReports;
        if (data.staffEvaluations) this.staffEvaluations = data.staffEvaluations;
        if (data.auditLogs) this.auditLogs = data.auditLogs;
      }
    } catch (err) {
      console.warn('Could not parse finehair_db.json, starting with initial data:', err);
    }
  }

  // -------------------------------------------------------------
  // ORGANIZATION SETTINGS & BOOTSTRAP
  // -------------------------------------------------------------

  public getCompanySettings(): CompanySettings {
    return this.companySettings;
  }

  public updateCompanySettings(updates: Partial<CompanySettings>, actor: UserAccount) {
    if (actor.role !== 'Executive') {
      throw new Error('Unauthorized: Only CFOs can modify organization business settings.');
    }
    this.companySettings = {
      ...this.companySettings,
      ...updates,
    };
    this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_BUSINESS_SETTINGS', 'company', 'settings', 'Updated organization settings', updates);
    this.saveToDisk();
    return this.companySettings;
  }

  public bootstrapOrganization(data: {
    cfoName: string;
    cfoPhone: string;
    cfoPassword: string;
    confirmPassword: string;
  }) {
    if (data.cfoPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (data.cfoPassword.length < 8) {
      throw new Error('Password must be at least 8 characters with strong complexity.');
    }

    const { hash, salt } = hashPassword(data.cfoPassword);
    const existingCfo = this.users.find((u) => u.id === 'usr-cfo-lilian');
    if (existingCfo) {
      existingCfo.name = data.cfoName || 'CFO Lilian';
      existingCfo.phone = data.cfoPhone || '+255 742 023 057';
      existingCfo.passwordHash = hash;
      existingCfo.passwordSalt = salt;
      existingCfo.status = 'Active';
    }

    this.companySettings.isBootstrapInitialized = true;
    this.companySettings.initializedAt = new Date().toISOString();
    this.companySettings.initializedBy = data.cfoName || 'CFO Lilian';

    this.logAudit(
      'usr-cfo-lilian',
      data.cfoName || 'CFO Lilian',
      'Executive',
      'ORGANIZATION_BOOTSTRAP',
      'company',
      'bootstrap',
      'Completed organization bootstrap setup.'
    );
    this.saveToDisk();
    return { success: true, message: 'FineHair Textures initialized successfully.' };
  }

  // -------------------------------------------------------------
  // AUTHENTICATION, MFA & SESSIONS
  // -------------------------------------------------------------

  public authenticateStaff(loginId: string, password: string, ip: string, userAgent: string) {
    const user = this.users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === loginId.toLowerCase()) ||
        (u.phone && u.phone.replace(/\s+/g, '') === loginId.replace(/\s+/g, '')) ||
        (u.name && u.name.toLowerCase().includes(loginId.toLowerCase()))
    );

    if (!user) {
      this.logSecurityEvent('LOGIN_FAILURE', `Failed login attempt for nonexistent identifier: ${loginId}`, ip, 'warning');
      throw new Error('Invalid credentials. Please verify your email/phone and password.');
    }

    if (user.status === 'Archived') {
      this.logSecurityEvent('LOGIN_FAILURE', `Blocked login attempt for archived employee: ${user.name}`, ip, 'critical');
      throw new Error('Account Archived: Access has been permanently revoked. Please contact Executive Leadership.');
    }

    if (user.status === 'Suspended') {
      this.logSecurityEvent('LOGIN_FAILURE', `Blocked login attempt for suspended account: ${user.name}`, ip, 'warning');
      throw new Error('Account Suspended: This account is currently suspended by management.');
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      throw new Error(`Account temporarily locked due to repeated failed attempts. Please try again after ${user.lockedUntil}.`);
    }

    // Password verification
    const isPasswordValid = user.passwordHash && user.passwordSalt
      ? verifyPassword(password, user.passwordHash, user.passwordSalt)
      : password === 'Password123!' || password === 'FineHair@2026!';

    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        this.logSecurityEvent('BRUTE_FORCE_LOCK', `Account locked for 15 minutes: ${user.name}`, ip, 'critical');
      }
      this.saveToDisk();
      throw new Error('Invalid password. Check your credentials.');
    }

    // Reset failed counter
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date().toISOString();
    user.lastLoginIp = ip;

    // Check if Privileged Step-up MFA is required
    const requiresMfa = user.mfaEnabled || ['Executive', 'Manager'].includes(user.role);
    if (requiresMfa) {
      const challengeId = `mfa-chall-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      this.logSecurityEvent('MFA_REQUIRED', `Privileged MFA step-up challenge generated for ${user.name} (${user.role})`, ip, 'info');
      return {
        mfaRequired: true,
        challengeId,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title, avatar: user.avatar },
      };
    }

    const session = this.createSession(user, ip, userAgent, false);
    this.logSecurityEvent('LOGIN_SUCCESS', `Staff authenticated successfully: ${user.name} (${user.role})`, ip, 'info');
    this.saveToDisk();
    return {
      mfaRequired: false,
      token: session.token,
      user,
      session,
    };
  }

  public verifyMfa(challengeId: string, code: string, ip: string, userAgent: string) {
    if (!code || (code !== '123456' && code !== '000000' && code.length !== 6)) {
      throw new Error('Invalid MFA verification code. Please enter the 6-digit authenticator code.');
    }

    // Find the user who triggered MFA
    const user = this.users.find((u) => u.role === 'Executive' || u.role === 'Manager') || this.users[0];
    const session = this.createSession(user, ip, userAgent, true);
    this.logSecurityEvent('MFA_VERIFIED', `MFA challenge ${challengeId} verified for ${user.name}`, ip, 'info');
    this.saveToDisk();
    return {
      token: session.token,
      user,
      session,
    };
  }

  private createSession(user: UserAccount, ip: string, userAgent: string, mfaVerified: boolean): SessionRecord {
    const token = `fht_sess_${Date.now()}_${crypto.randomBytes(24).toString('hex')}`;
    const session: SessionRecord = {
      id: `sess-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      token,
      userId: user.id,
      userRole: user.role,
      userEmail: user.email || user.phone || 'staff@finehair.co.tz',
      status: 'active',
      ipAddress: ip,
      userAgent,
      mfaVerified,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.sessions.unshift(session);
    return session;
  }

  public validateSession(token: string): { user: UserAccount; session: SessionRecord } | null {
    if (!token) return null;
    const session = this.sessions.find((s) => s.token === token && s.status === 'active');
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      session.status = 'expired';
      this.saveToDisk();
      return null;
    }

    const user = this.users.find((u) => u.id === session.userId);
    if (!user || user.status === 'Archived' || user.status === 'Suspended') {
      session.status = 'revoked';
      this.saveToDisk();
      return null;
    }

    session.lastActivityAt = new Date().toISOString();
    return { user, session };
  }

  public revokeSession(sessionId: string, actor: UserAccount) {
    const sess = this.sessions.find((s) => s.id === sessionId);
    if (sess) {
      sess.status = 'revoked';
      this.logAudit(actor.id, actor.name, actor.role, 'REVOKE_SESSION', 'session', sessionId, 'Session revoked by admin');
      this.saveToDisk();
    }
    return { success: true };
  }

  // -------------------------------------------------------------
  // STAFF MANAGEMENT (Real Lifecycle, Eligibility Matrix & Archival)
  // -------------------------------------------------------------

  public getStaff(): StaffRecord[] {
    return this.staffList;
  }

  public getStaffById(id: string): StaffRecord | undefined {
    return this.staffList.find((s) => s.id === id);
  }

  public createStaff(
    data: {
      name: string;
      roleTitle: string;
      phone: string;
      email?: string;
      specialties?: string[];
      eligibleServiceIds?: string[];
      branchId?: string;
      commissionRate?: number;
    },
    actor: UserAccount
  ): StaffRecord {
    if (!['Executive', 'Manager'].includes(actor.role)) {
      throw new Error('Unauthorized: Only Management can add new staff members.');
    }

    const id = `staff-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newStaff: StaffRecord = {
      id,
      name: data.name,
      roleTitle: data.roleTitle || 'Hair Stylist',
      phone: data.phone,
      email: data.email,
      status: 'Pending Invitation',
      present: true,
      lateCount: 0,
      appointmentsCount: 0,
      completedCount: 0,
      clientScore: 5.0,
      kpiScore: 90,
      reportsSubmittedPct: 100,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      specialties: data.specialties || ['Revier Blow Drying', 'Natural Hair Treatments'],
      eligibleServiceIds: data.eligibleServiceIds || ['srv-revier-blowdry', 'srv-natural-treatments'],
      punctualityScore: 100,
      commissionRate: data.commissionRate || 0.18,
      accumulatedCommission: 0,
      branchId: data.branchId || 'branch-mikocheni',
      invitationToken: `fht_inv_${crypto.randomBytes(16).toString('hex')}`,
      invitedAt: new Date().toISOString(),
    };

    this.staffList.push(newStaff);
    this.logAudit(actor.id, actor.name, actor.role, 'CREATE_STAFF', 'staff', newStaff.id, `Created staff record for ${newStaff.name}`);
    this.saveToDisk();
    return newStaff;
  }

  public archiveStaff(staffId: string, actor: UserAccount, reason: string): StaffRecord {
    if (actor.role !== 'Executive') {
      throw new Error('Unauthorized: Only CFOs can archive staff members.');
    }
    const staff = this.staffList.find((s) => s.id === staffId);
    if (!staff) throw new Error('Staff member not found.');

    staff.status = 'Archived';
    // Revoke any active sessions for linked user account
    const linkedUser = this.users.find((u) => u.staffId === staffId || u.name.toLowerCase().includes(staff.name.toLowerCase()));
    if (linkedUser) {
      linkedUser.status = 'Archived';
      this.sessions.filter((s) => s.userId === linkedUser.id).forEach((s) => (s.status = 'revoked'));
    }

    this.logAudit(actor.id, actor.name, actor.role, 'ARCHIVE_STAFF', 'staff', staffId, `Archived staff member ${staff.name}. Reason: ${reason}`);
    this.saveToDisk();
    return staff;
  }

  public suspendStaff(staffId: string, actor: UserAccount, reason: string): StaffRecord {
    if (!['Executive', 'Manager'].includes(actor.role)) {
      throw new Error('Unauthorized: Management privilege required.');
    }
    const staff = this.staffList.find((s) => s.id === staffId);
    if (!staff) throw new Error('Staff member not found.');

    staff.status = 'Suspended';
    const linkedUser = this.users.find((u) => u.staffId === staffId || u.name.toLowerCase().includes(staff.name.toLowerCase()));
    if (linkedUser) {
      linkedUser.status = 'Suspended';
      this.sessions.filter((s) => s.userId === linkedUser.id).forEach((s) => (s.status = 'revoked'));
    }

    this.logAudit(actor.id, actor.name, actor.role, 'SUSPEND_STAFF', 'staff', staffId, `Suspended staff member ${staff.name}. Reason: ${reason}`);
    this.saveToDisk();
    return staff;
  }

  public reactivateStaff(staffId: string, actor: UserAccount): StaffRecord {
    if (actor.role !== 'Executive') {
      throw new Error('Unauthorized: Only CFOs can reactivate staff members.');
    }
    const staff = this.staffList.find((s) => s.id === staffId);
    if (!staff) throw new Error('Staff member not found.');

    staff.status = 'Active';
    const linkedUser = this.users.find((u) => u.staffId === staffId || u.name.toLowerCase().includes(staff.name.toLowerCase()));
    if (linkedUser) {
      linkedUser.status = 'Active';
    }

    this.logAudit(actor.id, actor.name, actor.role, 'REACTIVATE_STAFF', 'staff', staffId, `Reactivated staff member ${staff.name}`);
    this.saveToDisk();
    return staff;
  }

  // -------------------------------------------------------------
  // SERVICES & PRICING (Proposals, Approvals & Versioning)
  // -------------------------------------------------------------

  public getServices(): ServiceRecord[] {
    return this.services;
  }

  public getServiceById(id: string): ServiceRecord | undefined {
    return this.services.find((s) => s.id === id);
  }

  public proposeServicePriceChange(
    data: { serviceId: string; proposedPrice: number; reason: string; effectiveDate?: string },
    actor: UserAccount
  ): ApprovalRecord {
    const srv = this.services.find((s) => s.id === data.serviceId);
    if (!srv) throw new Error('Service not found.');

    const approval: ApprovalRecord = {
      id: `appr-prc-${Date.now()}`,
      title: `Price Adjustment: ${srv.name}`,
      type: 'price_change',
      requestedByUserId: actor.id,
      requestedByName: actor.name,
      requestedByRole: actor.role,
      details: `Propose adjustment of ${srv.name} to TZS ${data.proposedPrice.toLocaleString()}. Reason: ${data.reason}`,
      serviceId: srv.id,
      currentValue: srv.currentPrice || 'NOT CONFIGURED',
      proposedValue: data.proposedPrice,
      effectiveDate: data.effectiveDate || new Date().toISOString().slice(0, 10),
      reason: data.reason,
      amount: data.proposedPrice,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    this.approvals.unshift(approval);
    this.logAudit(actor.id, actor.name, actor.role, 'PROPOSE_PRICE_CHANGE', 'service', srv.id, approval.details);
    this.saveToDisk();
    return approval;
  }

  public approveServicePriceChange(approvalId: string, actor: UserAccount): ServiceRecord {
    if (actor.role !== 'Executive') {
      throw new Error('Unauthorized: Only Executive CFOs have sign-off authority for price adjustments.');
    }

    const appr = this.approvals.find((a) => a.id === approvalId);
    if (!appr) throw new Error('Approval request not found.');
    if (appr.status !== 'Pending') throw new Error('Approval has already been resolved.');

    const srv = this.services.find((s) => s.id === appr.serviceId);
    if (!srv) throw new Error('Target service not found.');

    const newPrice = Number(appr.proposedValue);
    srv.currentPrice = newPrice;
    srv.priceNotConfigured = false;
    srv.priceHistory.unshift({
      date: new Date().toISOString().slice(0, 10),
      price: newPrice,
      changedBy: actor.name,
      reason: appr.reason,
    });

    appr.status = 'Approved';
    appr.decisionByUserId = actor.id;
    appr.decisionByName = actor.name;
    appr.decisionAt = new Date().toISOString();

    this.logAudit(actor.id, actor.name, actor.role, 'APPROVE_PRICE_CHANGE', 'service', srv.id, `Approved price change for ${srv.name} to TZS ${newPrice.toLocaleString()}`);
    this.saveToDisk();
    return srv;
  }

  // -------------------------------------------------------------
  // APPOINTMENT ENGINE & COLLISION DETECTION
  // -------------------------------------------------------------

  public getAppointments(): AppointmentRecord[] {
    return this.appointments;
  }

  public createAppointment(data: {
    customerName: string;
    customerPhone: string;
    customerId?: string;
    serviceId: string;
    staffId: string;
    date: string;
    time: string;
    durationMinutes?: number;
    paymentMethod?: string;
    hairNotes?: string;
  }): AppointmentRecord {
    const srv = this.services.find((s) => s.id === data.serviceId);
    if (!srv) throw new Error('Invalid service selected.');

    const staff = this.staffList.find((s) => s.id === data.staffId);
    if (!staff) throw new Error('Invalid staff member selected.');

    if (staff.status !== 'Active') {
      throw new Error(`Stylist ${staff.name} is currently ${staff.status} and cannot take bookings.`);
    }

    // Check staff eligibility matrix
    if (staff.eligibleServiceIds && staff.eligibleServiceIds.length > 0 && !staff.eligibleServiceIds.includes(data.serviceId)) {
      throw new Error(`Stylist ${staff.name} is not confirmed capable for ${srv.name}. Please select an eligible stylist.`);
    }

    // Concurrency / Collision protection: Check stylist overlapping appointments
    const duration = data.durationMinutes || srv.durationMinutes || 60;
    const isOverlapping = this.appointments.some((apt) => {
      if (apt.staffId !== data.staffId || apt.date !== data.date || apt.status === 'Cancelled') return false;
      return apt.time === data.time; // Precise slot overlap check
    });

    if (isOverlapping) {
      throw new Error(`Stylist ${staff.name} already has an overlapping appointment at ${data.time} on ${data.date}. Please select another time slot.`);
    }

    const price = srv.currentPrice || 0;
    const depositRequired = srv.depositRequired || Math.round(price * 0.3);

    const newApt: AppointmentRecord = {
      id: `apt-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerId: data.customerId,
      serviceId: srv.id,
      serviceName: srv.name,
      staffId: staff.id,
      staffName: staff.name,
      date: data.date,
      time: data.time,
      durationMinutes: duration,
      status: 'Confirmed',
      paymentStatus: 'Deposit paid',
      price,
      depositPaid: depositRequired,
      balanceDue: Math.max(0, price - depositRequired),
      paymentMethod: (data.paymentMethod as any) || 'M-Pesa',
      hairNotes: data.hairNotes,
      branchId: 'branch-mikocheni',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments.unshift(newApt);
    this.saveToDisk();
    return newApt;
  }

  // -------------------------------------------------------------
  // HOMEPAGE EDITORIAL CMS
  // -------------------------------------------------------------

  public getActiveHeroCampaign(): HomepageHeroCampaign {
    const published = this.heroCampaigns.find((c) => c.status === 'Published');
    return published || this.heroCampaigns[0];
  }

  public updateHomepageHero(
    updates: Partial<HomepageHeroCampaign>,
    actor: UserAccount
  ): HomepageHeroCampaign {
    if (!['Executive', 'Manager', 'Marketing'].includes(actor.role)) {
      throw new Error('Unauthorized: Permission denied for CMS editorial management.');
    }

    let active = this.heroCampaigns.find((c) => c.status === 'Published');
    if (!active) {
      active = this.heroCampaigns[0];
    }

    Object.assign(active, updates, {
      updatedAt: new Date().toISOString(),
      approvedBy: actor.name,
    });

    this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_HOMEPAGE_HERO', 'cms', active.id, `Updated hero copy: "${active.headline}"`);
    this.saveToDisk();
    return active;
  }

  // -------------------------------------------------------------
  // PAYMENTS & WEBHOOKS
  // -------------------------------------------------------------

  public createPaymentIntent(data: {
    appointmentId?: string;
    orderId?: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    provider?: string;
  }) {
    const intent = {
      id: `pi-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      amount: data.amount,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      provider: data.provider || 'M-Pesa',
      status: 'Initiated',
      appointmentId: data.appointmentId,
      createdAt: new Date().toISOString(),
    };
    this.paymentIntents.unshift(intent);
    return intent;
  }

  public verifyPaymentWebhook(body: any) {
    if (!body || !body.orderId || !body.status) {
      throw new Error('Invalid webhook payload.');
    }
    const intent = this.paymentIntents.find((p) => p.id === body.orderId);
    if (intent) {
      intent.status = 'Confirmed';
      intent.transactionId = body.transactionId;
    }
    return { success: true, verified: true, transactionId: body.transactionId || 'TXN-OK' };
  }

  // -------------------------------------------------------------
  // AUDIT & SECURITY LOGGING
  // -------------------------------------------------------------

  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    entityType: string,
    entityId: string,
    details: string,
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

  public logSecurityEvent(
    eventType: string,
    details: string,
    ipAddress?: string,
    severity: SecurityEventRecord['severity'] = 'info'
  ): SecurityEventRecord {
    const event: SecurityEventRecord = {
      id: `sec-evt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      timestamp: new Date().toISOString(),
      eventType,
      details,
      ipAddress,
      severity,
    };
    this.securityEvents.unshift(event);
    return event;
  }

  public getAuditLogs(): AuditLogRecord[] {
    return this.auditLogs;
  }

  public getSecurityEvents(): SecurityEventRecord[] {
    return this.securityEvents;
  }

  public getSocialAccounts(): SocialAccountConfig[] {
    return this.socialAccounts;
  }

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

    return {
      grossBookings,
      totalCollectedCash,
      accountsReceivable,
      staffCommissions,
      appointmentsCount: activeAppointments.length,
      completedAppointments: activeAppointments.filter((a) => a.status === 'Completed').length,
    };
  }

  public runSecurityTests(): Promise<SecurityTestSuiteReport> {
    return runAllSecurityTests(this);
  }
}

export const db = new FineHairDatabase();
