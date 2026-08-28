import { Router, Request, Response } from 'express';
import { db, UserAccount } from './db.js';

export const apiRouter = Router();

// Helper to extract or fallback current user from header or session
function getCurrentUser(req: Request): UserAccount {
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    const found = db.findUserById(userId);
    if (found) return found;
  }
  // Default to Executive for frictionless initial load
  return db.getUsers()[0];
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & USERS
// -------------------------------------------------------------

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, pin } = req.body;
  if (!email || !pin) {
    return res.status(400).json({ error: 'Email and PIN are required' });
  }

  const user = db.authenticate(email, pin);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or PIN. Hint: Master PIN is 9900 or finehair2026' });
  }

  res.json({ success: true, user });
});

apiRouter.get('/auth/users', (_req: Request, res: Response) => {
  res.json({ users: db.getUsers() });
});

// -------------------------------------------------------------
// 2. SERVICES & PRICING MASTER
// -------------------------------------------------------------

apiRouter.get('/services', (_req: Request, res: Response) => {
  res.json({ services: db.getServices() });
});

apiRouter.post('/services/:id/propose-price', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { proposedPrice, reason } = req.body;

  if (!proposedPrice || isNaN(Number(proposedPrice))) {
    return res.status(400).json({ error: 'Valid proposedPrice is required' });
  }

  try {
    const approval = db.proposePriceChange(
      req.params.id,
      Number(proposedPrice),
      reason || 'Routine margin adjustment',
      currentUser
    );
    res.json({ success: true, approval });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. APPOINTMENTS & BOOKING ENGINE
// -------------------------------------------------------------

apiRouter.get('/appointments', (_req: Request, res: Response) => {
  res.json({ appointments: db.getAppointments() });
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { customerName, customerPhone, serviceId, staffId, date, time, paymentMethod, depositPaid, hairNotes } =
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
      actorUser: currentUser,
    });
    res.status(201).json({ success: true, appointment });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

apiRouter.patch('/appointments/:id/status', (req: Request, res: Response) => {
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
// 4. STAFF & ATTENDANCE
// -------------------------------------------------------------

apiRouter.get('/staff', (_req: Request, res: Response) => {
  res.json({ staff: db.getStaff() });
});

apiRouter.patch('/staff/:id/attendance', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { present } = req.body;

  try {
    const updated = db.updateStaffAttendance(req.params.id, Boolean(present), currentUser);
    res.json({ success: true, staff: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. CUSTOMERS CRM
// -------------------------------------------------------------

apiRouter.get('/customers', (_req: Request, res: Response) => {
  res.json({ customers: db.getCustomers() });
});

// -------------------------------------------------------------
// 6. INVENTORY
// -------------------------------------------------------------

apiRouter.get('/inventory', (_req: Request, res: Response) => {
  res.json({ inventory: db.getInventory() });
});

apiRouter.post('/inventory/:id/adjust', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { delta, reason } = req.body;

  try {
    const updated = db.adjustInventoryStock(req.params.id, Number(delta), reason || 'Inventory cycle count', currentUser);
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. APPROVALS & SEGREGATION OF DUTIES
// -------------------------------------------------------------

apiRouter.get('/approvals', (_req: Request, res: Response) => {
  res.json({ approvals: db.getApprovals() });
});

apiRouter.post('/approvals/:id/decide', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const { decision, rejectionReason } = req.body;

  if (!decision || (decision !== 'Approved' && decision !== 'Rejected')) {
    return res.status(400).json({ error: 'Decision must be "Approved" or "Rejected"' });
  }

  try {
    const decided = db.decideApproval(req.params.id, decision, currentUser, rejectionReason);
    res.json({ success: true, approval: decided });
  } catch (err: any) {
    // 403 Forbidden for Segregation of Duties or authorization failures
    res.status(403).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. MARKETING HUB & SOCIAL INTEGRATIONS
// -------------------------------------------------------------

apiRouter.get('/marketing/accounts', (_req: Request, res: Response) => {
  res.json({ accounts: db.getSocialAccounts() });
});

apiRouter.get('/marketing/posts', (_req: Request, res: Response) => {
  res.json({ posts: db.getMarketingPosts() });
});

apiRouter.post('/marketing/posts', (req: Request, res: Response) => {
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

apiRouter.post('/marketing/posts/:id/publish-now', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const post = db.publishPostNow(req.params.id, currentUser);
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/marketing/posts/:id/retry', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const post = db.retryFailedPost(req.params.id, currentUser);
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. AUDIT LOGS & FINANCIAL SUMMARY
// -------------------------------------------------------------

apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});

apiRouter.get('/financials', (_req: Request, res: Response) => {
  res.json({ financials: db.getFinancialSummary() });
});
