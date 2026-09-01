// server/pgSync.ts - Cloud SQL PostgreSQL Sync & Repository Adapter for Fine Hair OS
import { db } from '../src/db/index.ts';
import {
  users,
  sessions,
  otpChallenges,
  securityEvents,
  invitations,
  branches,
  customers,
  services,
  appointments,
  staff,
  inventory,
  approvals,
  socialAccounts,
  marketingPosts,
  auditLogs,
  mediaAssets,
  heroCampaigns,
  homepageSections,
  exceptions,
  staffDailyReports,
  staffEvaluations,
  complaints,
  stockMovements,
  servicePriceVersions,
  invoices,
} from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Asynchronously persists all entities to PostgreSQL for durable relational consistency.
 */
export async function syncEntityToPostgres(entity: string, data: any): Promise<void> {
  try {
    switch (entity) {
      case 'user':
        await db
          .insert(users)
          .values({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            role: data.role,
            status: data.status || 'Active',
            passwordHash: data.passwordHash || null,
            passwordSalt: data.passwordSalt || null,
            mfaEnabled: data.mfaEnabled || false,
            mfaSecret: data.mfaSecret || null,
            failedLoginAttempts: data.failedLoginAttempts || 0,
            lockedUntil: data.lockedUntil ? new Date(data.lockedUntil) : null,
            branchId: data.branchId || 'branch-mikocheni',
            department: data.department || 'Salon Atelier',
            staffId: data.staffId || null,
            avatar: data.avatar || null,
            permissions: data.permissions || [],
            lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : null,
            lastLoginIp: data.lastLoginIp || null,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              name: data.name,
              phone: data.phone || null,
              role: data.role,
              status: data.status || 'Active',
              passwordHash: data.passwordHash || null,
              passwordSalt: data.passwordSalt || null,
              mfaEnabled: data.mfaEnabled || false,
              mfaSecret: data.mfaSecret || null,
              failedLoginAttempts: data.failedLoginAttempts || 0,
              lockedUntil: data.lockedUntil ? new Date(data.lockedUntil) : null,
              branchId: data.branchId || 'branch-mikocheni',
              department: data.department || 'Salon Atelier',
              staffId: data.staffId || null,
              avatar: data.avatar || null,
              permissions: data.permissions || [],
              lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : null,
              lastLoginIp: data.lastLoginIp || null,
              updatedAt: new Date(),
            },
          });
        break;

      case 'session':
        await db
          .insert(sessions)
          .values({
            id: data.id,
            userId: data.userId,
            userRole: data.userRole,
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
            mfaVerified: data.mfaVerified || false,
            revoked: data.revoked || false,
            expiresAt: new Date(data.expiresAt),
            lastActivityAt: data.lastActivityAt ? new Date(data.lastActivityAt) : new Date(),
          })
          .onConflictDoUpdate({
            target: sessions.id,
            set: {
              mfaVerified: data.mfaVerified || false,
              revoked: data.revoked || false,
              lastActivityAt: data.lastActivityAt ? new Date(data.lastActivityAt) : new Date(),
            },
          });
        break;

      case 'security_event':
        await db.insert(securityEvents).values({
          id: data.id,
          userId: data.userId || null,
          userEmail: data.userEmail || null,
          userRole: data.userRole || null,
          eventType: data.eventType,
          severity: data.severity || 'info',
          ipAddress: data.ipAddress || null,
          details: data.details,
          metadata: data.metadata || null,
        });
        break;

      case 'otp_challenge':
        await db
          .insert(otpChallenges)
          .values({
            id: data.id,
            identifier: data.identifier,
            otpHash: data.otpHash,
            purpose: data.purpose,
            attempts: data.attempts || 0,
            maxAttempts: data.maxAttempts || 3,
            expiresAt: new Date(data.expiresAt),
            verified: data.verified || false,
            resendCooldownUntil: data.resendCooldownUntil ? new Date(data.resendCooldownUntil) : null,
          })
          .onConflictDoUpdate({
            target: otpChallenges.id,
            set: {
              attempts: data.attempts || 0,
              verified: data.verified || false,
              resendCooldownUntil: data.resendCooldownUntil ? new Date(data.resendCooldownUntil) : null,
            },
          });
        break;

      case 'invitation':
        await db
          .insert(invitations)
          .values({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            branchId: data.branchId,
            department: data.department,
            token: data.token,
            invitedBy: data.invitedBy,
            status: data.status || 'Pending',
            expiresAt: new Date(data.expiresAt),
          })
          .onConflictDoUpdate({
            target: invitations.id,
            set: {
              status: data.status || 'Pending',
            },
          });
        break;

      case 'appointment':
        await db
          .insert(appointments)
          .values({
            id: data.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || null,
            hairTexture: data.hairTexture || '4C',
            serviceId: data.serviceId,
            serviceName: data.serviceName,
            staffId: data.staffId,
            staffName: data.staffName,
            branchId: data.branchId || 'branch-mikocheni',
            location: data.location || 'Mikocheni Flagship Atelier',
            date: data.date,
            time: data.time,
            status: data.status,
            price: data.price.toString(),
            depositPaid: (data.depositPaid || 0).toString(),
            balanceDue: (data.balanceDue || 0).toString(),
            notes: data.notes || null,
            source: data.source || 'Customer App',
          })
          .onConflictDoUpdate({
            target: appointments.id,
            set: {
              status: data.status,
              price: data.price.toString(),
              depositPaid: (data.depositPaid || 0).toString(),
              balanceDue: (data.balanceDue || 0).toString(),
              notes: data.notes || null,
            },
          });
        break;

      case 'customer':
        await db
          .insert(customers)
          .values({
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            hairTexture: data.hairTexture || '4C',
            preferredStylist: data.preferredStylistName || null,
            totalSpend: (data.totalSpend || 0).toString(),
            totalVisits: data.visitCount || 0,
            vipStatus: data.status || 'Standard',
            notes: data.allergiesOrNotes || null,
            lastVisit: data.lastVisit || null,
          })
          .onConflictDoUpdate({
            target: customers.id,
            set: {
              name: data.name,
              phone: data.phone,
              email: data.email || null,
              hairTexture: data.hairTexture || '4C',
              totalSpend: (data.totalSpend || 0).toString(),
              totalVisits: data.visitCount || 0,
              vipStatus: data.status || 'Standard',
              notes: data.allergiesOrNotes || null,
              lastVisit: data.lastVisit || null,
            },
          });
        break;

      case 'staff':
        await db
          .insert(staff)
          .values({
            id: data.id,
            name: data.name,
            phone: data.phone,
            roleTitle: data.roleTitle,
            specialties: data.specialties || [],
            branchId: data.branchId || 'branch-mikocheni',
            avatar: data.avatar || null,
            present: data.present ?? true,
            clientScore: (data.clientScore || 5.0).toString(),
            kpiScore: data.kpiScore || 90,
            accumulatedCommission: (data.accumulatedCommission || 0).toString(),
            notes: data.notes || null,
          })
          .onConflictDoUpdate({
            target: staff.id,
            set: {
              name: data.name,
              phone: data.phone,
              roleTitle: data.roleTitle,
              specialties: data.specialties || [],
              present: data.present ?? true,
              clientScore: (data.clientScore || 5.0).toString(),
              kpiScore: data.kpiScore || 90,
              accumulatedCommission: (data.accumulatedCommission || 0).toString(),
              notes: data.notes || null,
            },
          });
        break;

      case 'inventory':
        await db
          .insert(inventory)
          .values({
            id: data.id,
            sku: data.sku,
            name: data.name,
            category: data.category,
            stock: data.stock,
            minThreshold: data.threshold || 5,
            unitCost: (data.costPrice || 0).toString(),
            retailPrice: (data.retailPrice || 0).toString(),
            branchId: 'branch-mikocheni',
            lastRestocked: new Date().toISOString().slice(0, 10),
            status: data.status === 'Healthy' ? 'In Stock' : 'Low Stock',
          })
          .onConflictDoUpdate({
            target: inventory.id,
            set: {
              stock: data.stock,
              unitCost: (data.costPrice || 0).toString(),
              retailPrice: (data.retailPrice || 0).toString(),
              status: data.status === 'Healthy' ? 'In Stock' : 'Low Stock',
            },
          });
        break;

      case 'approval':
        await db
          .insert(approvals)
          .values({
            id: data.id,
            title: data.title,
            type: data.type,
            details: data.details,
            amount: data.amount ? data.amount.toString() : null,
            currentValue: data.currentValue ? String(data.currentValue) : null,
            proposedValue: data.proposedValue ? String(data.proposedValue) : null,
            serviceId: data.serviceId || null,
            reason: data.reason || null,
            requestedByUserId: data.requestedByUserId,
            requestedByName: data.requestedByName,
            requestedByRole: data.requestedByRole,
            date: data.date,
            status: data.status,
            decidedByUserId: data.decidedByUserId || null,
            decidedByName: data.decidedByName || null,
            decidedAt: data.decidedAt ? new Date(data.decidedAt) : null,
            rejectionReason: data.rejectionReason || null,
          })
          .onConflictDoUpdate({
            target: approvals.id,
            set: {
              status: data.status,
              decidedByUserId: data.decidedByUserId || null,
              decidedByName: data.decidedByName || null,
              decidedAt: data.decidedAt ? new Date(data.decidedAt) : null,
              rejectionReason: data.rejectionReason || null,
            },
          });
        break;

      case 'audit_log':
        await db.insert(auditLogs).values({
          id: data.id,
          userId: data.actorId,
          userName: data.actorName,
          userRole: data.actorRole,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId || 'general',
          details: data.details,
        });
        break;

      case 'hero_campaign':
        await db
          .insert(heroCampaigns)
          .values({
            id: data.id,
            campaignName: data.campaignName,
            eyebrow: data.eyebrow,
            headline: data.headline,
            subheadline: data.subheadline,
            heroImageUrl: data.heroImageUrl,
            mobileHeroImageUrl: data.mobileHeroImageUrl || null,
            primaryCtaLabel: data.primaryCtaLabel,
            primaryCtaAction: data.primaryCtaAction,
            secondaryCtaLabel: data.secondaryCtaLabel,
            secondaryCtaAction: data.secondaryCtaAction,
            status: data.status,
            startDate: data.startDate,
            endDate: data.endDate,
            targetAudience: data.targetAudience || 'All',
            approvedBy: data.approvedBy || null,
          })
          .onConflictDoUpdate({
            target: heroCampaigns.id,
            set: {
              campaignName: data.campaignName,
              eyebrow: data.eyebrow,
              headline: data.headline,
              subheadline: data.subheadline,
              heroImageUrl: data.heroImageUrl,
              primaryCtaLabel: data.primaryCtaLabel,
              primaryCtaAction: data.primaryCtaAction,
              status: data.status,
            },
          });
        break;

      case 'homepage_section':
        await db
          .insert(homepageSections)
          .values({
            id: data.id,
            sectionKey: data.sectionKey,
            title: data.title,
            subtitle: data.subtitle || null,
            enabled: data.enabled,
            sortOrder: data.sortOrder,
            audience: data.audience || 'all',
          })
          .onConflictDoUpdate({
            target: homepageSections.id,
            set: {
              enabled: data.enabled,
              sortOrder: data.sortOrder,
            },
          });
        break;

      case 'media_asset':
        await db
          .insert(mediaAssets)
          .values({
            id: data.id,
            title: data.title,
            category: data.category,
            url: data.url,
            representationVerified: data.representationVerified ?? true,
            status: data.status || 'Approved',
            uploadedBy: data.uploadedBy,
            approvedBy: data.approvedBy || null,
            tags: data.tags || [],
          })
          .onConflictDoUpdate({
            target: mediaAssets.id,
            set: {
              status: data.status,
              approvedBy: data.approvedBy || null,
            },
          });
        break;

      case 'marketing_post':
        await db
          .insert(marketingPosts)
          .values({
            id: data.id,
            title: data.title,
            pillar: data.pillar,
            series: data.series || null,
            objective: data.objective,
            mediaUrl: data.mediaUrl,
            mediaType: data.mediaType || 'image',
            caption: data.caption,
            cta: data.cta,
            scheduledDate: data.scheduledDate,
            platforms: data.platforms || [],
            status: data.status,
            reach: data.reach || 0,
            enquiriesAttributed: data.enquiriesAttributed || 0,
            revenueAttributed: (data.revenueAttributed || 0).toString(),
            representationVerified: data.representationVerified ?? true,
            retryCount: data.retryCount || 0,
            deliveryLogs: data.deliveryLogs || [],
          })
          .onConflictDoUpdate({
            target: marketingPosts.id,
            set: {
              status: data.status,
              reach: data.reach || 0,
              enquiriesAttributed: data.enquiriesAttributed || 0,
              revenueAttributed: (data.revenueAttributed || 0).toString(),
              retryCount: data.retryCount || 0,
              deliveryLogs: data.deliveryLogs || [],
            },
          });
        break;

      case 'staff_report':
        await db
          .insert(staffDailyReports)
          .values({
            id: data.id,
            staffId: data.staffId,
            staffName: data.staffName,
            date: data.date,
            appointmentsCompleted: data.appointmentsCompleted || 0,
            serviceRevenueGenerated: (data.serviceRevenueGenerated || 0).toString(),
            keyWins: data.keyWins || null,
            challengesFaced: data.challengesFaced || null,
            inventoryUsedNotes: data.inventoryUsedNotes || null,
            clientFeedbackNotes: data.clientFeedbackNotes || null,
            aiVoiceSummary: data.aiVoiceSummary || null,
            managerReviewStatus: data.managerReviewStatus || 'Reviewed',
          })
          .onConflictDoUpdate({
            target: staffDailyReports.id,
            set: {
              appointmentsCompleted: data.appointmentsCompleted || 0,
              serviceRevenueGenerated: (data.serviceRevenueGenerated || 0).toString(),
              keyWins: data.keyWins || null,
              challengesFaced: data.challengesFaced || null,
              managerReviewStatus: data.managerReviewStatus || 'Reviewed',
            },
          });
        break;

      case 'staff_evaluation':
        await db
          .insert(staffEvaluations)
          .values({
            id: data.id,
            staffId: data.staffId,
            staffName: data.staffName,
            roleTitle: data.roleTitle,
            month: data.month,
            overallKpiScore: (data.overallKpiScore || 4.5).toString(),
            attendanceScore: data.attendanceScore || 95,
            qualityCraftsmanshipScore: data.qualityCraftsmanshipScore || 95,
            clientCareScore: data.clientCareScore || 95,
            teamworkScore: data.teamworkScore || 95,
            policyComplianceScore: data.policyComplianceScore || 95,
            managerComments: data.managerComments || null,
            actionPlan: data.actionPlan || null,
            evaluatedBy: data.evaluatedBy,
          })
          .onConflictDoUpdate({
            target: staffEvaluations.id,
            set: {
              overallKpiScore: (data.overallKpiScore || 4.5).toString(),
              managerComments: data.managerComments || null,
              actionPlan: data.actionPlan || null,
            },
          });
        break;

      case 'service':
        await db
          .insert(services)
          .values({
            id: data.id,
            name: data.name,
            category: data.category,
            durationMinutes: data.durationMinutes,
            currentPrice: data.currentPrice.toString(),
            depositRequired: data.depositRequired.toString(),
            description: data.description,
            swahiliDescription: data.swahiliDescription || null,
            image: data.imageUrl || null,
            popular: data.name.includes('Wig') || data.name.includes('Silk'),
            active: data.status === 'Active',
          })
          .onConflictDoUpdate({
            target: services.id,
            set: {
              currentPrice: data.currentPrice.toString(),
              depositRequired: data.depositRequired.toString(),
              active: data.status === 'Active',
            },
          });
        break;

      case 'complaint':
        await db
          .insert(complaints)
          .values({
            id: data.id,
            customerId: data.customerId,
            customerName: data.customerName,
            staffId: data.staffId || null,
            staffName: data.staffName || null,
            serviceId: data.serviceId || null,
            title: data.title,
            details: data.details,
            severity: data.severity || 'Medium',
            status: data.status || 'Open',
            assignedTo: data.assignedTo || 'Salon Director',
            resolutionNotes: data.resolutionNotes || null,
            resolvedAt: data.resolvedAt ? new Date(data.resolvedAt) : null,
          })
          .onConflictDoUpdate({
            target: complaints.id,
            set: {
              status: data.status,
              assignedTo: data.assignedTo,
              resolutionNotes: data.resolutionNotes || null,
              resolvedAt: data.resolvedAt ? new Date(data.resolvedAt) : null,
            },
          });
        break;

      case 'stock_movement':
        await db.insert(stockMovements).values({
          id: data.id,
          inventoryId: data.inventoryId,
          sku: data.sku,
          name: data.name,
          type: data.type,
          quantityChange: data.quantityChange,
          previousStock: data.previousStock,
          newStock: data.newStock,
          reason: data.reason,
          actorName: data.actorName,
          branchId: data.branchId || 'branch-mikocheni',
        });
        break;

      case 'service_price_version':
        await db.insert(servicePriceVersions).values({
          id: data.id,
          serviceId: data.serviceId,
          price: data.price.toString(),
          effectiveDate: data.effectiveDate,
          changedByUserId: data.changedByUserId,
          changedByName: data.changedByName,
          reason: data.reason,
          approvalId: data.approvalId || null,
        });
        break;

      case 'invoice':
        await db
          .insert(invoices)
          .values({
            id: data.id,
            appointmentId: data.appointmentId || null,
            orderId: data.orderId || null,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            subtotal: data.subtotal.toString(),
            discount: (data.discount || 0).toString(),
            depositPaid: (data.depositPaid || 0).toString(),
            totalDue: data.totalDue.toString(),
            paymentMethod: data.paymentMethod || 'M-Pesa',
            paymentStatus: data.paymentStatus || 'Paid',
          })
          .onConflictDoUpdate({
            target: invoices.id,
            set: {
              paymentStatus: data.paymentStatus || 'Paid',
              depositPaid: (data.depositPaid || 0).toString(),
              totalDue: data.totalDue.toString(),
            },
          });
        break;

      default:
        break;
    }
  } catch (err) {
    // Log asynchronously without blocking HTTP response
    console.error(`PostgreSQL sync error for ${entity}:`, err);
  }
}
