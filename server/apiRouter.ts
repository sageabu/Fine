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
    return res.status(401).json({ error: 'Invalid email or PIN. Master PIN is 9900, 2024, or finehair2026' });
  }

  res.json({ success: true, user });
});

apiRouter.get('/auth/users', (_req: Request, res: Response) => {
  res.json({ users: db.getUsers() });
});

// -------------------------------------------------------------
// 2. BRANCHES
// -------------------------------------------------------------

apiRouter.get('/branches', (_req: Request, res: Response) => {
  res.json({ branches: db.getBranches() });
});

// -------------------------------------------------------------
// 3. SERVICES & PRICING MASTER
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
// 4. APPOINTMENTS & BOOKING ENGINE
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
// 5. STAFF, DAILY REPORTS & EVALUATIONS
// -------------------------------------------------------------

apiRouter.get('/staff', (_req: Request, res: Response) => {
  res.json({ staff: db.getStaff() });
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

apiRouter.post('/staff/evaluations', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const evaluation = db.saveStaffEvaluation(req.body, currentUser);
    res.status(201).json({ success: true, evaluation });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. CUSTOMERS CRM
// -------------------------------------------------------------

apiRouter.get('/customers', (_req: Request, res: Response) => {
  res.json({ customers: db.getCustomers() });
});

// -------------------------------------------------------------
// 7. INVENTORY
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
// 8. APPROVALS & DUAL-CONTROL SEGREGATION OF DUTIES
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
    res.status(403).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. BRAND & CUSTOMER EXPERIENCE (CMS & Media Library)
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

apiRouter.patch('/brand-experience/media-library/:id/status', (req: Request, res: Response) => {
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

apiRouter.post('/brand-experience/hero-campaigns', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const campaign = db.createHeroCampaign(req.body, currentUser);
    res.status(201).json({ success: true, campaign });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/brand-experience/hero-campaigns/:id', (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  try {
    const campaign = db.updateHeroCampaign(req.params.id, req.body, currentUser);
    res.json({ success: true, campaign });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/brand-experience/sections', (_req: Request, res: Response) => {
  res.json({ sections: db.getHomepageSections() });
});

apiRouter.put('/brand-experience/sections', (req: Request, res: Response) => {
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
// 10. MARKETING HUB & SOCIALS
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

// -------------------------------------------------------------
// 11. EXCEPTIONS & ANOMALIES
// -------------------------------------------------------------

apiRouter.get('/exceptions', (_req: Request, res: Response) => {
  res.json({ exceptions: db.getExceptions() });
});

apiRouter.patch('/exceptions/:id', (req: Request, res: Response) => {
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
// 12. AUDIT LOGS & FINANCIAL SUMMARY
// -------------------------------------------------------------

apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});

apiRouter.get('/financials', (_req: Request, res: Response) => {
  res.json({ financials: db.getFinancialSummary() });
});
