// src/db/schema.ts - Comprehensive Production Relational Schema for Fine Hair Business OS
import { pgTable, serial, text, integer, timestamp, boolean, jsonb, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -------------------------------------------------------------
// 1. IDENTITY & USERS (Enterprise IAM)
// -------------------------------------------------------------
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull().default('Customer'), // Executive, Manager, Reception, Staff, Marketing, Finance, Customer, System Admin
  status: text('status').notNull().default('Active'), // Active, Pending Invitation, Suspended, Locked, Archived
  passwordHash: text('password_hash'),
  passwordSalt: text('password_salt'),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  mfaSecret: text('mfa_secret'),
  failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
  branchId: text('branch_id').default('branch-mikocheni'),
  department: text('department').default('Salon Atelier'),
  staffId: text('staff_id'),
  avatar: text('avatar'),
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  lastLoginIp: text('last_login_ip'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userRole: text('user_role').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  mfaVerified: boolean('mfa_verified').default(false).notNull(),
  revoked: boolean('revoked').default(false).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  lastActivityAt: timestamp('last_activity_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const otpChallenges = pgTable('otp_challenges', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(), // phone or email
  otpHash: text('otp_hash').notNull(),
  purpose: text('purpose').notNull(), // customer_auth, mfa_stepup, password_reset
  attempts: integer('attempts').default(0).notNull(),
  maxAttempts: integer('max_attempts').default(3).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').default(false).notNull(),
  resendCooldownUntil: timestamp('resend_cooldown_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const securityEvents = pgTable('security_events', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  userEmail: text('user_email'),
  userRole: text('user_role'),
  eventType: text('event_type').notNull(), // LOGIN_SUCCESS, LOGIN_FAILURE, MFA_REQUIRED, MFA_VERIFIED, LOGOUT, SESSION_REVOKED, STAFF_ARCHIVED, STAFF_INVITED, PERMISSION_CHANGED, BRUTE_FORCE_LOCK, STEPUP_AUTH
  severity: text('severity').default('info').notNull(), // info, warning, critical
  ipAddress: text('ip_address'),
  details: text('details').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  branchId: text('branch_id').notNull(),
  department: text('department').notNull(),
  token: text('token').notNull().unique(),
  invitedBy: text('invited_by').notNull(),
  status: text('status').default('Pending').notNull(), // Pending, Accepted, Expired, Revoked
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 2. BRANCHES & LOCATIONS
// -------------------------------------------------------------
export const branches = pgTable('branches', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  managerId: text('manager_id'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 3. CRM & CUSTOMERS
// -------------------------------------------------------------
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  hairTexture: text('hair_texture').notNull().default('4C'), // 4C, 4B, 3C, Raw Straight
  preferredStylist: text('preferred_stylist'),
  totalSpend: decimal('total_spend', { precision: 12, scale: 2 }).default('0').notNull(),
  totalVisits: integer('total_visits').default(0).notNull(),
  vipStatus: text('vip_status').default('Standard').notNull(), // Standard, VIP, Black Tier, At Risk
  notes: text('notes'),
  lastVisit: text('last_visit'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 4. SERVICE MASTER & PRICING
// -------------------------------------------------------------
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // Wigs & Custom Units, Natural Hair & Silk Press, Atelier Salon Services, Braids & Locs, Hair Treatments
  durationMinutes: integer('duration_minutes').notNull(),
  currentPrice: decimal('current_price', { precision: 12, scale: 2 }).notNull(),
  depositRequired: decimal('deposit_required', { precision: 12, scale: 2 }).notNull(),
  description: text('description').notNull(),
  swahiliDescription: text('swahili_description'),
  image: text('image'),
  popular: boolean('popular').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 5. APPOINTMENTS & SCHEDULES
// -------------------------------------------------------------
export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  hairTexture: text('hair_texture').default('4C'),
  serviceId: text('service_id').references(() => services.id),
  serviceName: text('service_name').notNull(),
  staffId: text('staff_id').notNull(),
  staffName: text('staff_name').notNull(),
  branchId: text('branch_id').default('branch-mikocheni').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  status: text('status').notNull().default('Confirmed'), // Confirmed, In Progress, Completed, Cancelled, No-Show
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  depositPaid: decimal('deposit_paid', { precision: 12, scale: 2 }).default('0').notNull(),
  balanceDue: decimal('balance_due', { precision: 12, scale: 2 }).default('0').notNull(),
  notes: text('notes'),
  source: text('source').default('Customer App'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 6. STAFF & PERFORMANCE
// -------------------------------------------------------------
export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  roleTitle: text('role_title').notNull(),
  specialties: jsonb('specialties'), // string[]
  branchId: text('branch_id').default('branch-mikocheni').notNull(),
  avatar: text('avatar'),
  present: boolean('present').default(true).notNull(),
  clientScore: decimal('client_score', { precision: 3, scale: 2 }).default('5.0'),
  kpiScore: integer('kpi_score').default(90),
  accumulatedCommission: decimal('accumulated_commission', { precision: 12, scale: 2 }).default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const staffDailyReports = pgTable('staff_daily_reports', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull(),
  staffName: text('staff_name').notNull(),
  date: text('date').notNull(),
  appointmentsCompleted: integer('appointments_completed').default(0).notNull(),
  serviceRevenueGenerated: decimal('service_revenue_generated', { precision: 12, scale: 2 }).default('0').notNull(),
  keyWins: text('key_wins'),
  challengesFaced: text('challenges_faced'),
  inventoryUsedNotes: text('inventory_used_notes'),
  clientFeedbackNotes: text('client_feedback_notes'),
  aiVoiceSummary: text('ai_voice_summary'),
  managerReviewStatus: text('manager_review_status').default('Reviewed').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const staffEvaluations = pgTable('staff_evaluations', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull(),
  staffName: text('staff_name').notNull(),
  roleTitle: text('role_title').notNull(),
  month: text('month').notNull(),
  overallKpiScore: decimal('overall_kpi_score', { precision: 3, scale: 2 }).notNull(),
  attendanceScore: integer('attendance_score').notNull(),
  qualityCraftsmanshipScore: integer('quality_craftsmanship_score').notNull(),
  clientCareScore: integer('client_care_score').notNull(),
  teamworkScore: integer('teamwork_score').notNull(),
  policyComplianceScore: integer('policy_compliance_score').notNull(),
  managerComments: text('manager_comments'),
  actionPlan: text('action_plan'),
  evaluatedBy: text('evaluated_by').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 7. INVENTORY & STOCK
// -------------------------------------------------------------
export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  stock: integer('stock').notNull().default(0),
  minThreshold: integer('min_threshold').notNull().default(5),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }).notNull(),
  retailPrice: decimal('retail_price', { precision: 12, scale: 2 }).notNull(),
  branchId: text('branch_id').default('branch-mikocheni').notNull(),
  lastRestocked: text('last_restocked'),
  status: text('status').notNull().default('In Stock'), // In Stock, Low Stock, Out of Stock
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 8. APPROVALS & GOVERNANCE
// -------------------------------------------------------------
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // Price Change, Refund, Discount Override, Marketing Campaign, Stock Write-off
  details: text('details').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }),
  currentValue: text('current_value'),
  proposedValue: text('proposed_value'),
  serviceId: text('service_id'),
  reason: text('reason'),
  requestedByUserId: text('requested_by_user_id').notNull(),
  requestedByName: text('requested_by_name').notNull(),
  requestedByRole: text('requested_by_role').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull().default('Pending'), // Pending, Approved, Rejected
  decidedByUserId: text('decided_by_user_id'),
  decidedByName: text('decided_by_name'),
  decidedAt: timestamp('decided_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 9. MARKETING & SOCIAL MEDIA HUB
// -------------------------------------------------------------
export const socialAccounts = pgTable('social_accounts', {
  id: text('id').primaryKey(),
  platform: text('platform').notNull(), // Instagram, Facebook, TikTok, YouTube Shorts
  handle: text('handle').notNull(),
  accountName: text('account_name').notNull(),
  connected: boolean('connected').default(true).notNull(),
  followersCount: integer('followers_count').default(0).notNull(),
  lastSyncTime: text('last_sync_time'),
  tokenStatus: text('token_status').default('Active').notNull(),
  profilePicture: text('profile_picture'),
});

export const marketingPosts = pgTable('marketing_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  pillar: text('pillar').notNull(),
  series: text('series'),
  objective: text('objective').notNull(),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').default('image').notNull(),
  caption: text('caption').notNull(),
  cta: text('cta').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  platforms: jsonb('platforms').notNull(), // string[]
  status: text('status').notNull().default('Draft'), // Draft, In Review, Approved, Scheduled, Published, Failed
  reach: integer('reach').default(0).notNull(),
  enquiriesAttributed: integer('enquiries_attributed').default(0).notNull(),
  revenueAttributed: decimal('revenue_attributed', { precision: 12, scale: 2 }).default('0').notNull(),
  representationVerified: boolean('representation_verified').default(true).notNull(),
  retryCount: integer('retry_count').default(0),
  deliveryLogs: jsonb('delivery_logs'), // string[]
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 10. HOMEPAGE CMS & BRAND MEDIA GOVERNANCE
// -------------------------------------------------------------
export const mediaAssets = pgTable('media_assets', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  url: text('url').notNull(),
  representationVerified: boolean('representation_verified').default(true).notNull(),
  status: text('status').default('Approved').notNull(), // Draft, Pending Review, Approved, Rejected
  uploadedBy: text('uploaded_by').notNull(),
  approvedBy: text('approved_by'),
  tags: jsonb('tags'), // string[]
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const heroCampaigns = pgTable('hero_campaigns', {
  id: text('id').primaryKey(),
  campaignName: text('campaign_name').notNull(),
  eyebrow: text('eyebrow').notNull(),
  headline: text('headline').notNull(),
  subheadline: text('subheadline').notNull(),
  heroImageUrl: text('hero_image_url').notNull(),
  mobileHeroImageUrl: text('mobile_hero_image_url'),
  primaryCtaLabel: text('primary_cta_label').notNull(),
  primaryCtaAction: text('primary_cta_action').notNull(),
  secondaryCtaLabel: text('secondary_cta_label').notNull(),
  secondaryCtaAction: text('secondary_cta_action').notNull(),
  status: text('status').default('Published').notNull(), // Draft, Scheduled, Published, Expired
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  targetAudience: text('target_audience').default('All'),
  approvedBy: text('approved_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const homepageSections = pgTable('homepage_sections', {
  id: text('id').primaryKey(),
  sectionKey: text('section_key').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  enabled: boolean('enabled').default(true).notNull(),
  sortOrder: integer('sort_order').notNull(),
  audience: text('audience').default('all'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 11. EVENTS, AUDIT & EXCEPTIONS
// -------------------------------------------------------------
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userRole: text('user_role').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  details: text('details').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const exceptions = pgTable('exceptions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  severity: text('severity').notNull(), // High, Medium, Low
  category: text('category').notNull(),
  assignedTo: text('assigned_to').notNull(),
  status: text('status').default('Open').notNull(), // Open, In Progress, Resolved
  detectedAt: text('detected_at').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// 12. COMPLAINTS, STOCK MOVEMENTS, INVOICES & PRICE VERSIONS
// -------------------------------------------------------------
export const complaints = pgTable('complaints', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  staffId: text('staff_id'),
  staffName: text('staff_name'),
  serviceId: text('service_id'),
  title: text('title').notNull(),
  details: text('details').notNull(),
  severity: text('severity').default('Medium').notNull(), // Critical, High, Medium, Low
  status: text('status').default('Open').notNull(), // Open, Assigned, In Progress, Resolved, Closed
  assignedTo: text('assigned_to').notNull(),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stockMovements = pgTable('stock_movements', {
  id: text('id').primaryKey(),
  inventoryId: text('inventory_id').notNull(),
  sku: text('sku').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // opening, purchase, transfer, sale, service_consumption, adjustment, damage, loss
  quantityChange: integer('quantity_change').notNull(),
  previousStock: integer('previous_stock').notNull(),
  newStock: integer('new_stock').notNull(),
  reason: text('reason').notNull(),
  actorName: text('actor_name').notNull(),
  branchId: text('branch_id').default('branch-mikocheni').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const servicePriceVersions = pgTable('service_price_versions', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  effectiveDate: text('effective_date').notNull(),
  changedByUserId: text('changed_by_user_id').notNull(),
  changedByName: text('changed_by_name').notNull(),
  reason: text('reason').notNull(),
  approvalId: text('approval_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  appointmentId: text('appointment_id'),
  orderId: text('order_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0').notNull(),
  depositPaid: decimal('deposit_paid', { precision: 12, scale: 2 }).default('0').notNull(),
  totalDue: decimal('total_due', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').default('Paid').notNull(), // Paid, Partially Paid, Refunded, Pending
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// RELATIONS
// -------------------------------------------------------------
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));
