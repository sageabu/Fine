import { Router, Request, Response, NextFunction } from 'express';
import { db, UserAccount, SessionRecord } from './db.js';

export const apiRouter = Router();

// Helper to extract verified user from authoritative session token
export function getAuthenticatedContext(req: Request): { user: UserAccount; session: SessionRecord } | null {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  if (!token) return null;

  return db.validateSession(token);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const ctx = getAuthenticatedContext(req);
  if (!ctx) {
    return res.status(401).json({
      error: 'Unauthorized: A valid, active enterprise session token is required. Please log in.',
    });
  }
  (req as any).user = ctx.user;
  (req as any).session = ctx.session;
  next();
}

function getCurrentUser(req: Request): UserAccount {
  const ctx = getAuthenticatedContext(req);
  if (ctx) return ctx.user;
  // If not authenticated in public routes, return a read-only guest customer
  return {
    id: 'usr-guest',
    name: 'Guest Visitor',
    email: 'guest@finehair.co.tz',
    role: 'Customer',
    status: 'Active',
    mfaEnabled: false,
    failedLoginAttempts: 0,
    branchId: 'branch-mikocheni',
    department: 'Client VIP Atelier',
    title: 'Guest Visitor',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    permissions: ['service.read', 'appointment.read', 'appointment.write', 'customer.read', 'customer.write', 'book_appointment', 'shop_products'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Server-side RBAC & Permission Enforcement Middleware
export function requireRole(allowedRoles: Array<UserAccount['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctx = getAuthenticatedContext(req);
    if (!ctx) {
      return res.status(401).json({ error: 'Authentication required. Active session token missing or expired.' });
    }
    const user = ctx.user;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role "${user.role}" does not have privilege for this operation. Required: ${allowedRoles.join(', ')}`,
      });
    }
    (req as any).user = user;
    (req as any).session = ctx.session;
    next();
  };
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctx = getAuthenticatedContext(req);
    if (!ctx) {
      return res.status(401).json({ error: 'Authentication required. Active session token missing or expired.' });
    }
    const user = ctx.user;
    const hasWildcard = user.permissions.includes('*');
    const hasExact = user.permissions.includes(permission);
    const hasCategory = user.permissions.some((p) => p.endsWith('.*') && permission.startsWith(p.slice(0, -2)));

    if (!hasWildcard && !hasExact && !hasCategory) {
      return res.status(403).json({
        error: `Permission Denied: Missing required permission "${permission}" for user ${user.name} (${user.role})`,
      });
    }
    (req as any).user = user;
    (req as any).session = ctx.session;
    next();
  };
}

// -------------------------------------------------------------
// 1. ENTERPRISE AUTHENTICATION, MFA & IAM
// -------------------------------------------------------------

// Staff/Management Login via Email/Phone + Secure Password
apiRouter.post('/auth/staff/login', (req: Request, res: Response) => {
  const { email, phone, identifier, password } = req.body;
  const loginId = identifier || email || phone;

  if (!loginId || !password) {
    return res.status(400).json({ error: 'Email/phone and secure password are required.' });
  }

  try {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Browser';
    const result = db.authenticateStaff(loginId, password, ip, userAgent);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// Staff MFA Step-Up Verification
apiRouter.post('/auth/staff/verify-mfa', (req: Request, res: Response) => {
  const { challengeId, code } = req.body;
  if (!challengeId || !code) {
    return res.status(400).json({ error: 'MFA challengeId and 6-digit verification code are required.' });
  }

  try {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Browser';
    const result = db.verifyMfaChallenge(challengeId, code, ip, userAgent);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// Customer Real Passwordless OTP Initiation (Phone / Email)
apiRouter.post('/auth/customer/send-otp', (req: Request, res: Response) => {
  const { identifier, phone, email, purpose } = req.body;
  const target = identifier || phone || email;

  if (!target) {
    return res.status(400).json({ error: 'Phone number or email is required to receive verification code.' });
  }

  try {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const result = db.sendCustomerOtp(target, purpose || 'customer_auth', ip);
    res.json(result);
  } catch (err: any) {
    res.status(429).json({ error: err.message });
  }
});

// Customer OTP Verification & Session Establishment
apiRouter.post('/auth/customer/verify-otp', (req: Request, res: Response) => {
  const { challengeId, code } = req.body;
  if (!challengeId || !code) {
    return res.status(400).json({ error: 'challengeId and 6-digit code are required.' });
  }

  try {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Customer App';
    const result = db.verifyCustomerOtp(challengeId, code, ip, userAgent);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Legacy / Direct Login Bridge (Supports both password and token)
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, pin } = req.body;
  const cred = password || pin;

  if (!email || !cred) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const ip = req.ip || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Browser';
    const result = db.authenticateStaff(email, cred, ip, userAgent);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const ctx = getAuthenticatedContext(req);
  if (!ctx) {
    return res.status(401).json({ error: 'Not authenticated or session expired' });
  }
  const { passwordHash, passwordSalt, mfaSecret, ...safeUser } = ctx.user;
  res.json({ success: true, user: safeUser, session: ctx.session });
});

apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const token = req.headers['authorization'] || '';
  const currentUser = (req as any).user;
  db.revokeSession(token, currentUser);
  res.json({ success: true, message: 'Successfully logged out and session revoked.' });
});

apiRouter.post('/auth/logout-all', requireAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const count = db.revokeAllUserSessions(currentUser.id, currentUser);
  res.json({ success: true, message: `Revoked all ${count} active sessions across devices.` });
});

apiRouter.post('/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { currentPassword, newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required.' });
  }

  try {
    db.changePassword(currentUser.id, currentPassword, newPassword, currentUser);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/auth/invite-staff', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { email, name, role, branchId, department, phone, specialties, commissionRate } = req.body;

  if (!email || !name || !role) {
    return res.status(400).json({ error: 'email, name, and role are required to invite staff.' });
  }

  try {
    const result = db.inviteStaffMember(
      { email, name, role, branchId: branchId || 'branch-mikocheni', department: department || 'Salon Atelier', phone, specialties, commissionRate },
      currentUser
    );
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/auth/accept-invitation', (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Invitation token and initial password are required.' });
  }

  try {
    const user = db.acceptStaffInvitation(token, password);
    const { passwordHash, passwordSalt, mfaSecret, ...safeUser } = user;
    res.json({ success: true, user: safeUser, message: 'Account activated successfully. You can now log in.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/auth/staff/:id/archive', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { reassignToStaffId, reason } = req.body;

  try {
    const result = db.archiveStaffMember(req.params.id, reassignToStaffId, reason, currentUser);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/auth/staff/:id/reactivate', requireRole(['Executive']), (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  try {
    const staff = db.reactivateStaffMember(req.params.id, currentUser);
    res.json({ success: true, staff });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/auth/users/:id/suspend', requireRole(['Executive']), (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { reason } = req.body;
  try {
    const user = db.suspendUser(req.params.id, reason || 'Administrative suspension', currentUser);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/auth/users/:id/access', requireRole(['Executive']), (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  try {
    const user = db.updateUserAccess(req.params.id, req.body, currentUser);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/auth/security-events', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  res.json({ events: db.getSecurityEvents(limit) });
});

apiRouter.get('/auth/users', requireRole(['Executive', 'Manager']), (_req: Request, res: Response) => {
  const safeUsers = db.getUsers().map((u) => {
    const { passwordHash, passwordSalt, mfaSecret, ...safe } = u;
    return safe;
  });
  res.json({ users: safeUsers });
});

// -------------------------------------------------------------
// 2. BRANCHES
// -------------------------------------------------------------

apiRouter.get('/branches', (_req: Request, res: Response) => {
  res.json({ branches: db.getBranches() });
});

// -------------------------------------------------------------
// 3. SERVICES & PRICING MASTER (With Versioning & RBAC)
// -------------------------------------------------------------

apiRouter.get('/services', (_req: Request, res: Response) => {
  res.json({ services: db.getServices() });
});

apiRouter.post('/services', requireRole(['Executive', 'Manager']), requirePermission('service.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const service = db.addService(req.body, currentUser);
    res.status(201).json({ success: true, service });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/services/:id', requireRole(['Executive', 'Manager']), requirePermission('service.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const updated = db.updateService(req.params.id, req.body, currentUser);
    res.json({ success: true, service: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/services/:id/archive', requireRole(['Executive', 'Manager']), requirePermission('service.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const archived = db.archiveService(req.params.id, currentUser);
    res.json({ success: true, service: archived });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/services/:id/reactivate', requireRole(['Executive', 'Manager']), requirePermission('service.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const reactivated = db.reactivateService(req.params.id, currentUser);
    res.json({ success: true, service: reactivated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/services/:id/propose-price', requirePermission('price.propose'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { proposedPrice, reason } = req.body;

  if (!proposedPrice || isNaN(Number(proposedPrice))) {
    return res.status(400).json({ error: 'Valid proposedPrice is required' });
  }

  try {
    const approval = db.proposePriceChange(
      req.params.id,
      Number(proposedPrice),
      reason || 'Routine market & inflation adjustment',
      currentUser
    );
    res.json({ success: true, approval });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. APPOINTMENTS & REAL TRANSACTIONAL BOOKING ENGINE
// -------------------------------------------------------------

apiRouter.get('/appointments', (_req: Request, res: Response) => {
  res.json({ appointments: db.getAppointments() });
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { customerName, customerPhone, serviceId, staffId, date, time, paymentMethod, depositPaid, hairNotes, branchId } =
    req.body;

  if (!customerName || !serviceId || !staffId || !date || !time) {
    return res.status(400).json({
      error: 'Missing required appointment fields: customerName, serviceId, staffId, date, time',
    });
  }

  try {
    const appointment = db.createAppointment({
      customerName,
      customerPhone: customerPhone || '+255 700 000 000',
      serviceId,
      staffId,
      date,
      time,
      paymentMethod: paymentMethod || 'M-Pesa',
      depositPaid: depositPaid ? Number(depositPaid) : undefined,
      hairNotes,
      branchId,
      actorUser: currentUser,
    });
    res.status(201).json({ success: true, appointment });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

apiRouter.patch('/appointments/:id/status', requirePermission('appointment.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'New status is required' });
  }

  try {
    const updated = db.updateAppointmentStatus(req.params.id, status, currentUser);
    res.json({ success: true, appointment: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. STAFF MASTER, DAILY SHIFT REPORTS & KPI EVALUATIONS
// -------------------------------------------------------------

apiRouter.get('/staff', (_req: Request, res: Response) => {
  res.json({ staff: db.getStaff() });
});

apiRouter.post('/staff', requireRole(['Executive', 'Manager']), requirePermission('staff.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const newStaff = db.addStaff(req.body, currentUser);
    res.status(201).json({ success: true, staff: newStaff });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/staff/:id', requireRole(['Executive', 'Manager']), requirePermission('staff.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const updated = db.updateStaff(req.params.id, req.body, currentUser);
    res.json({ success: true, staff: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/archive', requireRole(['Executive', 'Manager']), requirePermission('staff.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const archived = db.archiveStaff(req.params.id, currentUser);
    res.json({ success: true, staff: archived });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/reactivate', requireRole(['Executive', 'Manager']), requirePermission('staff.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const reactivated = db.reactivateStaff(req.params.id, currentUser);
    res.json({ success: true, staff: reactivated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/attendance', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { type } = req.body;
  try {
    const result = db.recordStaffAttendance(req.params.id, type === 'check_out' ? 'check_out' : 'check_in', currentUser);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/staff/daily-reports', (_req: Request, res: Response) => {
  res.json({ reports: db.getStaffDailyReports() });
});

apiRouter.post('/staff/daily-reports', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { staffId, staffName, date, branchId, appointmentsAssigned, completedCount, noShowCount, cancelledCount, totalServiceMinutes, complimentsCount, complaintsCount, additionalServicesCount, revenueHandled, wentWell, challenges, managementNotes, voiceNoteTranscript } = req.body;

  if (!staffId || !staffName || !date) {
    return res.status(400).json({ error: 'staffId, staffName, and date are required' });
  }

  try {
    const report = db.submitStaffDailyReport(
      {
        staffId,
        staffName,
        date,
        branchId: branchId || 'branch-mikocheni',
        appointmentsAssigned: Number(appointmentsAssigned || 0),
        completedCount: Number(completedCount || 0),
        noShowCount: Number(noShowCount || 0),
        cancelledCount: Number(cancelledCount || 0),
        totalServiceMinutes: Number(totalServiceMinutes || 0),
        complimentsCount: Number(complimentsCount || 0),
        complaintsCount: Number(complaintsCount || 0),
        additionalServicesCount: Number(additionalServicesCount || 0),
        revenueHandled: Number(revenueHandled || 0),
        wentWell: wentWell || 'Completed all scheduled services with high client satisfaction.',
        challenges: challenges || 'None reported.',
        managementNotes: managementNotes || '',
        voiceNoteTranscript,
      },
      currentUser
    );
    res.status(201).json({ success: true, report });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/staff/evaluations', (_req: Request, res: Response) => {
  res.json({ evaluations: db.getStaffEvaluations() });
});

apiRouter.post('/staff/evaluations', requireRole(['Executive', 'Manager']), requirePermission('performance.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const evaluation = db.saveStaffEvaluation(req.body, currentUser);
    res.status(201).json({ success: true, evaluation });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. CUSTOMERS CRM & COMPLAINT LIFECYCLE
// -------------------------------------------------------------

apiRouter.get('/customers', (_req: Request, res: Response) => {
  res.json({ customers: db.getCustomers() });
});

apiRouter.post('/customers', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const customer = db.createCustomer(req.body, currentUser);
    res.status(201).json({ success: true, customer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/customers/:id', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const customer = db.updateCustomer(req.params.id, req.body, currentUser);
    res.json({ success: true, customer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/customers/complaints', (_req: Request, res: Response) => {
  res.json({ complaints: db.getComplaints() });
});

apiRouter.post('/customers/complaints', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const complaint = db.createComplaint(req.body, currentUser);
    res.status(201).json({ success: true, complaint });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/customers/complaints/:id', requireRole(['Executive', 'Manager', 'Reception']), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { status, resolutionNotes } = req.body;
  try {
    const updated = db.updateComplaintStatus(req.params.id, status, resolutionNotes, currentUser);
    res.json({ success: true, complaint: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. INVENTORY & STOCK MOVEMENTS
// -------------------------------------------------------------

apiRouter.get('/inventory', (_req: Request, res: Response) => {
  res.json({ inventory: db.getInventory() });
});

apiRouter.post('/inventory/:id/adjust', requireRole(['Executive', 'Manager']), requirePermission('inventory.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { delta, reason } = req.body;

  try {
    const updated = db.adjustInventoryStock(req.params.id, Number(delta), reason || 'Inventory cycle count', currentUser);
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/inventory/movements', (_req: Request, res: Response) => {
  res.json({ movements: db.getStockMovements() });
});

apiRouter.post('/inventory/movement', requirePermission('inventory.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { inventoryId, type, quantityChange, reason } = req.body;
  try {
    const movement = db.recordStockMovement(inventoryId, type, Number(quantityChange), reason, currentUser);
    res.status(201).json({ success: true, movement });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. APPROVALS & DUAL-CONTROL SEGREGATION OF DUTIES
// -------------------------------------------------------------

apiRouter.get('/approvals', (_req: Request, res: Response) => {
  res.json({ approvals: db.getApprovals() });
});

apiRouter.post('/approvals/propose', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { title, type, details, amount, reason, currentValue, proposedValue, serviceId } = req.body;

  if (!title || !type || !details) {
    return res.status(400).json({ error: 'Title, type, and details are required' });
  }

  try {
    const approval = db.proposeApproval({
      title,
      type,
      details,
      amount: amount ? Number(amount) : undefined,
      reason,
      currentValue,
      proposedValue,
      serviceId,
      requestedByUser: currentUser,
    });
    res.status(201).json({ success: true, approval });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/approvals/:id/decide', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { decision, rejectionReason } = req.body;

  if (!decision || (decision !== 'Approved' && decision !== 'Rejected')) {
    return res.status(400).json({ error: 'Decision must be "Approved" or "Rejected"' });
  }

  try {
    const decided = db.decideApproval(req.params.id, decision, currentUser, rejectionReason);
    res.json({ success: true, approval: decided });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. BRAND & HOMEPAGE CMS (With Scheduling & Rollback)
// -------------------------------------------------------------

apiRouter.get('/brand-experience/media-library', (_req: Request, res: Response) => {
  res.json({ mediaAssets: db.getMediaAssets() });
});

apiRouter.post('/brand-experience/media-library', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { title, category, campaign, source, usageRightsVerified, representationVerified, hairTexture, url, thumbnailUrl } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  try {
    const asset = db.addMediaAsset(
      {
        title,
        category: category || 'Hero Banners',
        campaign: campaign || 'General Atelier Brand',
        source: source || 'Fine Hair Studio Shoot',
        usageRightsVerified: Boolean(usageRightsVerified ?? true),
        representationVerified: Boolean(representationVerified ?? true),
        hairTexture: hairTexture || '4C Coily Natural Texture',
        uploadedBy: currentUser.name,
        url,
        thumbnailUrl: thumbnailUrl || url,
      },
      currentUser
    );
    res.status(201).json({ success: true, asset });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/brand-experience/media-library/:id/status', requireRole(['Executive', 'Manager', 'Marketing']), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { status, rejectionReason } = req.body;

  try {
    const updated = db.decideMediaAsset(req.params.id, status, rejectionReason, currentUser);
    res.json({ success: true, asset: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/brand-experience/hero-campaigns', (_req: Request, res: Response) => {
  res.json({
    campaigns: db.getHeroCampaigns(),
    activeHero: db.getActiveHeroCampaign(),
  });
});

apiRouter.post('/brand-experience/hero-campaigns', requireRole(['Executive', 'Manager', 'Marketing']), requirePermission('homepage.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const campaign = db.createHeroCampaign(req.body, currentUser);
    res.status(201).json({ success: true, campaign });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/brand-experience/hero-campaigns/:id', requireRole(['Executive', 'Manager', 'Marketing']), requirePermission('homepage.publish'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const campaign = db.updateHeroCampaign(req.params.id, req.body, currentUser);
    res.json({ success: true, campaign });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/brand-experience/hero-campaigns/:id/rollback', requireRole(['Executive', 'Manager']), requirePermission('homepage.publish'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const campaign = db.rollbackHeroCampaign(req.params.id, currentUser);
    res.json({ success: true, campaign });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/brand-experience/sections', (_req: Request, res: Response) => {
  res.json({ sections: db.getHomepageSections() });
});

apiRouter.put('/brand-experience/sections', requireRole(['Executive', 'Manager', 'Marketing']), requirePermission('homepage.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { sections } = req.body;

  if (!sections || !Array.isArray(sections)) {
    return res.status(400).json({ error: 'Sections array is required' });
  }

  try {
    const updated = db.updateHomepageSections(sections, currentUser);
    res.json({ success: true, sections: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/brand-experience/personalize-home', (req: Request, res: Response) => {
  const { customerId, phone, hairTexture } = req.body;
  try {
    const personalized = db.getPersonalizedHomepage({ customerId, phone, hairTexture });
    res.json(personalized);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 10. MARKETING HUB & CROSS-PLATFORM SOCIALS
// -------------------------------------------------------------

apiRouter.get('/marketing/accounts', (_req: Request, res: Response) => {
  res.json({ accounts: db.getSocialAccounts() });
});

apiRouter.get('/marketing/posts', (_req: Request, res: Response) => {
  res.json({ posts: db.getMarketingPosts() });
});

apiRouter.post('/marketing/posts', requirePermission('marketing.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { title, series, platforms, publishDate, publishTime, notes, mediaUrl, campaignId, hairTextureTag } = req.body;

  if (!title || !platforms || !platforms.length) {
    return res.status(400).json({ error: 'Title and at least one target platform are required' });
  }

  try {
    const post = db.scheduleMarketingPost(
      {
        title,
        series: series || 'Fine Hair Fix',
        platforms,
        publishDate: publishDate || new Date().toISOString().slice(0, 10),
        publishTime: publishTime || '17:00',
        notes,
        mediaUrl,
        campaignId,
        hairTextureTag,
      },
      currentUser
    );
    res.status(201).json({ success: true, post });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/marketing/posts/:id/publish-now', requirePermission('publishing.approve'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const post = db.publishPostNow(req.params.id, currentUser);
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/marketing/posts/:id/retry', requirePermission('marketing.write'), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const post = db.retryPost(req.params.id, currentUser);
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 11. PAYMENTS, WEBHOOKS & REFUND GOVERNANCE
// -------------------------------------------------------------

apiRouter.post('/payments/intent', (req: Request, res: Response) => {
  const { appointmentId, orderId, amount, customerName, customerPhone, provider } = req.body;
  if (!amount || !customerName) {
    return res.status(400).json({ error: 'Amount and customer details are required' });
  }

  const intent = db.createPaymentIntent({
    appointmentId,
    orderId,
    amount: Number(amount),
    customerName,
    customerPhone: customerPhone || '+255 700 000 000',
    provider: provider || 'M-Pesa',
  });
  res.json({ success: true, paymentIntent: intent });
});

apiRouter.post('/payments/webhook', (req: Request, res: Response) => {
  try {
    const result = db.verifyPaymentWebhook(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 12. AI ASSISTANCE LAYER (Customer Concierge & Management Advisor)
// -------------------------------------------------------------

apiRouter.post('/ai/concierge', (req: Request, res: Response) => {
  const { query, hairTexture, budgetTZS } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required for AI Concierge' });
  }

  const recommendation = db.getAiConciergeRecommendation(query, hairTexture, budgetTZS ? Number(budgetTZS) : undefined);
  res.json({ success: true, recommendation });
});

apiRouter.get('/ai/management-advisor', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const insights = db.getAiManagementInsights();
  res.json({ success: true, insights });
});

// -------------------------------------------------------------
// 13. EXCEPTIONS & ANOMALIES
// -------------------------------------------------------------

apiRouter.get('/exceptions', (_req: Request, res: Response) => {
  res.json({ exceptions: db.getExceptions() });
});

apiRouter.patch('/exceptions/:id', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { status, assignedTo } = req.body;

  try {
    const updated = db.updateExceptionStatus(req.params.id, status, assignedTo, currentUser);
    res.json({ success: true, exception: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 14. AUDIT LOGS & FINANCIAL SUMMARY
// -------------------------------------------------------------

apiRouter.get('/audit-logs', requireRole(['Executive', 'Manager']), requirePermission('audit.read'), (_req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});

apiRouter.get('/financials', requireRole(['Executive', 'Manager']), requirePermission('finance.read'), (_req: Request, res: Response) => {
  res.json({ financials: db.getFinancialSummary() });
});
