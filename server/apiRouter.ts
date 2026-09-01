import { Router, Request, Response, NextFunction } from 'express';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { db, UserAccount, SessionRecord } from './db.ts';

export const apiRouter = Router();

// Lazy initialization of GoogleGenAI
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Session authentication extractor
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
    permissions: ['service.read', 'appointment.read', 'appointment.write', 'customer.read', 'customer.write'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function requireRole(allowedRoles: Array<UserAccount['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctx = getAuthenticatedContext(req);
    if (!ctx) {
      return res.status(401).json({ error: 'Authentication required. Active session token missing or expired.' });
    }
    const user = ctx.user;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden: Role '${user.role}' lacks sufficient authorization for this privileged operation. Required: [${allowedRoles.join(', ')}].`,
      });
    }
    (req as any).user = user;
    (req as any).session = ctx.session;
    next();
  };
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & MFA ENDPOINTS
// -------------------------------------------------------------

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      return res.status(400).json({ error: 'Login identifier and password are required.' });
    }
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Browser';
    const result = db.authenticateStaff(loginId, password, ip, userAgent);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

apiRouter.post('/auth/mfa/verify', (req: Request, res: Response) => {
  try {
    const { challengeId, code } = req.body;
    if (!challengeId || !code) {
      return res.status(400).json({ error: 'Challenge ID and 6-digit MFA verification code required.' });
    }
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Browser';
    const result = db.verifyMfa(challengeId, code, ip, userAgent);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const ctx = getAuthenticatedContext(req);
  if (!ctx) {
    return res.json({ authenticated: false, user: null, session: null });
  }
  res.json({ authenticated: true, user: ctx.user, session: ctx.session });
});

apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const session = (req as any).session;
  const user = (req as any).user;
  db.revokeSession(session.id, user);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// -------------------------------------------------------------
// 2. ORGANIZATION SETTINGS & BOOTSTRAP
// -------------------------------------------------------------

apiRouter.get('/settings', (req: Request, res: Response) => {
  res.json({
    settings: db.getCompanySettings(),
    branches: db.branches,
    decisionAuthorities: db.getCompanySettings().decisionAuthorities,
    paymentMethods: db.getCompanySettings().paymentMethods,
    communicationMethods: db.getCompanySettings().communicationMethods,
    socialPlatforms: db.getCompanySettings().socialPlatforms,
  });
});

apiRouter.post('/settings', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const updated = db.updateCompanySettings(req.body, user);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

apiRouter.post('/bootstrap', (req: Request, res: Response) => {
  try {
    const result = db.bootstrapOrganization(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. STAFF LIFECYCLE & ELIGIBILITY MATRIX
// -------------------------------------------------------------

apiRouter.get('/staff', (req: Request, res: Response) => {
  res.json(db.getStaff());
});

apiRouter.post('/staff', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const created = db.createStaff(req.body, user);
    res.json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/archive', requireRole(['Executive']), (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const archived = db.archiveStaff(req.params.id, user, req.body.reason || 'Management Action');
    res.json(archived);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/suspend', requireRole(['Executive', 'Manager']), (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const suspended = db.suspendStaff(req.params.id, user, req.body.reason || 'Temporary Suspension');
    res.json(suspended);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/staff/:id/reactivate', requireRole(['Executive']), (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const reactivated = db.reactivateStaff(req.params.id, user);
    res.json(reactivated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. SERVICES & CENTRALIZED PRICING GOVERNANCE
// -------------------------------------------------------------

apiRouter.get('/services', (req: Request, res: Response) => {
  res.json(db.getServices());
});

apiRouter.post('/services/propose-price', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const proposal = db.proposeServicePriceChange(req.body, user);
    res.json(proposal);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/approvals', requireAuth, (req: Request, res: Response) => {
  res.json(db.approvals);
});

apiRouter.post('/approvals/:id/decision', requireRole(['Executive']), (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { action } = req.body;
    if (action === 'Approve') {
      const updatedSrv = db.approveServicePriceChange(req.params.id, user);
      res.json({ success: true, service: updatedSrv });
    } else {
      const appr = db.approvals.find((a) => a.id === req.params.id);
      if (appr) {
        appr.status = 'Rejected';
        appr.decisionByUserId = user.id;
        appr.decisionByName = user.name;
        appr.decisionAt = new Date().toISOString();
        db.saveToDisk();
      }
      res.json({ success: true, message: 'Approval rejected.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. APPOINTMENTS & SCHEDULING
// -------------------------------------------------------------

apiRouter.get('/appointments', (req: Request, res: Response) => {
  res.json(db.getAppointments());
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  try {
    const apt = db.createAppointment(req.body);
    res.json(apt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/appointments/:id/status', requireAuth, (req: Request, res: Response) => {
  try {
    const apt = db.appointments.find((a) => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });
    const { status, paymentStatus } = req.body;
    if (status) apt.status = status;
    if (paymentStatus) apt.paymentStatus = paymentStatus;
    apt.updatedAt = new Date().toISOString();
    db.saveToDisk();
    res.json(apt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. CUSTOMERS CRM & INVENTORY
// -------------------------------------------------------------

apiRouter.get('/customers', (req: Request, res: Response) => {
  res.json(db.customers);
});

apiRouter.get('/inventory', (req: Request, res: Response) => {
  res.json(db.inventory);
});

// -------------------------------------------------------------
// 7. HOMEPAGE EDITORIAL CMS & SOCIAL ACCOUNTS
// -------------------------------------------------------------

apiRouter.get('/cms/hero', (req: Request, res: Response) => {
  res.json(db.getActiveHeroCampaign());
});

apiRouter.post('/cms/hero', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const updated = db.updateHomepageHero(req.body, user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/cms/sections', (req: Request, res: Response) => {
  res.json(db.homepageSections);
});

apiRouter.get('/social/accounts', (req: Request, res: Response) => {
  res.json(db.getSocialAccounts());
});

// -------------------------------------------------------------
// 8. FINANCIAL & REPORTING HUD
// -------------------------------------------------------------

apiRouter.get('/financial/summary', requireAuth, (req: Request, res: Response) => {
  res.json(db.getFinancialSummary());
});

apiRouter.get('/audit-logs', requireAuth, (req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

apiRouter.get('/security/events', requireAuth, (req: Request, res: Response) => {
  res.json(db.getSecurityEvents());
});

// -------------------------------------------------------------
// 9. AUTOMATED SECURITY & INTEGRATION TEST SUITE (PART 55)
// -------------------------------------------------------------

apiRouter.get('/security/test-suite', async (req: Request, res: Response) => {
  try {
    const report = await db.runSecurityTests();
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 10. REAL SERVER-SIDE GEMINI CONCIERGE & TOOL CALLING
// -------------------------------------------------------------

const getActiveServicesDecl: FunctionDeclaration = {
  name: 'getActiveServices',
  description: 'Returns the authoritative list of available salon services, textures, and current prices at FineHair Textures.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: 'Optional category filter' },
    },
  },
};

const getServicePriceDecl: FunctionDeclaration = {
  name: 'getServicePrice',
  description: 'Returns the authoritative pricing, deposit requirement, and price configuration status for a specific service ID or name.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      serviceNameOrId: { type: Type.STRING, description: 'Name or ID of the service' },
    },
    required: ['serviceNameOrId'],
  },
};

const getStylistAvailabilityDecl: FunctionDeclaration = {
  name: 'getStylistAvailability',
  description: 'Returns verified available stylists and appointments schedule for a service and date.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      serviceId: { type: Type.STRING, description: 'Service identifier' },
      date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
    },
    required: ['serviceId', 'date'],
  },
};

const getSalonBusinessInfoDecl: FunctionDeclaration = {
  name: 'getSalonBusinessInfo',
  description: 'Returns verified salon location, opening hours, contact numbers, payment methods, and decision authorities.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

apiRouter.post('/ai/concierge', async (req: Request, res: Response) => {
  try {
    const { prompt, hairGoal, customerProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback if no API key is set
      return res.json({
        content: `Welcome to FineHair Textures! Located at Mikocheni B, Usagara Street, Tanzania. Open Tuesday to Sunday 09:00 AM – 07:00 PM. Contact us at +255 742 023 057. We specialize in Revier Blow Drying, Knots, Silk Press, V Light, and Tension-Free Braids.`,
        sourcesUsed: ['FineHair Verified Database'],
      });
    }

    const systemInstruction = `You are the FineHair Textures AI Concierge for the flagship atelier in Mikocheni B, Usagara Street, Tanzania.
You provide helpful, authoritative hair care advice, service recommendations, and salon details.
CRITICAL RULES:
1. Ground all answers strictly in verified FineHair Textures data.
2. The salon is located at Mikocheni B, Usagara Street, Tanzania. Phone: +255 742 023 057. Hours: 09:00 AM – 07:00 PM.
3. Currency is TZS.
4. Decision Authorities are CFO Lilian, CFO Collins, Manager Razaq.
5. If a service has no configured price, clearly say "Pricing is pending CFO configuration".
6. Recommend only verified staff matching their capability matrix.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt || `Recommend salon services for hair goal: ${hairGoal || 'healthy natural hair'}`,
      config: {
        systemInstruction,
        temperature: 0.3,
        tools: [{
          functionDeclarations: [
            getActiveServicesDecl,
            getServicePriceDecl,
            getStylistAvailabilityDecl,
            getSalonBusinessInfoDecl,
          ],
        }],
      },
    });

    // Check for tool calls or direct text
    const candidate = response.candidates?.[0];
    let finalAnswer = '';

    if (candidate?.content?.parts) {
      const functionCalls = candidate.content.parts.filter((p) => p.functionCall);
      if (functionCalls.length > 0) {
        // Execute tool calls against authoritative db
        const toolOutputs: any[] = [];
        for (const call of functionCalls) {
          const fn = call.functionCall;
          if (fn?.name === 'getActiveServices') {
            toolOutputs.push({
              functionResponse: {
                name: 'getActiveServices',
                response: {
                  services: db.getServices().map((s) => ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    price: s.currentPrice ? `TZS ${s.currentPrice.toLocaleString()}` : 'PRICE NOT CONFIGURED',
                    duration: s.durationLabel,
                  })),
                },
              },
            });
          } else if (fn?.name === 'getSalonBusinessInfo') {
            toolOutputs.push({
              functionResponse: {
                name: 'getSalonBusinessInfo',
                response: db.getCompanySettings(),
              },
            });
          } else if (fn?.name === 'getServicePrice') {
            const query = (fn.args as any)?.serviceNameOrId?.toLowerCase() || '';
            const srv = db.services.find((s) => s.id === query || s.name.toLowerCase().includes(query));
            toolOutputs.push({
              functionResponse: {
                name: 'getServicePrice',
                response: srv
                  ? { name: srv.name, price: srv.currentPrice, deposit: srv.depositRequired, configured: !srv.priceNotConfigured }
                  : { error: 'Service not found' },
              },
            });
          } else if (fn?.name === 'getStylistAvailability') {
            const srvId = (fn.args as any)?.serviceId;
            const eligibleStaff = db.staffList.filter((s) => s.status === 'Active' && (!s.eligibleServiceIds || s.eligibleServiceIds.includes(srvId)));
            toolOutputs.push({
              functionResponse: {
                name: 'getStylistAvailability',
                response: { availableStaff: eligibleStaff.map((s) => ({ id: s.id, name: s.name, role: s.roleTitle, rating: s.clientScore })) },
              },
            });
          }
        }

        // Second turn with tool outputs
        const followUp = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt || `Recommend services for ${hairGoal}` }] },
            { role: 'model', parts: candidate.content.parts },
            { role: 'user', parts: toolOutputs.map((to) => ({ functionResponse: to.functionResponse })) },
          ],
          config: { systemInstruction },
        });

        finalAnswer = followUp.text || '';
      } else {
        finalAnswer = response.text || '';
      }
    }

    res.json({
      content: finalAnswer || 'FineHair Textures is ready to welcome you at Mikocheni B, Usagara Street, Tanzania.',
      sourcesUsed: ['FineHair Textures Authoritative Database'],
    });
  } catch (err: any) {
    res.json({
      content: `Welcome to FineHair Textures, Mikocheni B, Usagara Street, Tanzania. We offer bespoke services including Revier Blow Drying, Knots, Silk Press, and Luxury Frontal Installations. Please call +255 742 023 057 to book your appointment.`,
      error: err.message,
    });
  }
});
