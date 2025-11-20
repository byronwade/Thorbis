# Complete Email Templates List for Stratos Platform

**Service Business Management Platform - All Email Templates**

---

## Overview

This document lists ALL email templates needed for the Stratos platform, organized by category and email system (Thorbis vs Company).

**Legend**:
- ✅ = Template exists and ready
- 🔧 = Template exists but needs CompanyLayout migration
- 📝 = Template needed (not yet created)
- 🎨 = Template created (new)

---

## 1. AUTHENTICATION & ACCOUNT (Platform Emails - Thorbis)

**Sender**: `noreply@thorbis.com`
**Layout**: BaseLayout (Thorbis branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Email Verification | ✅ | `/auth/email-verification.tsx` | Verify email with code |
| Magic Link Login | ✅ | `/auth/magic-link.tsx` | Passwordless login |
| Password Reset | ✅ | `/auth/password-reset.tsx` | Reset forgotten password |
| Password Changed | ✅ | `/auth/password-changed.tsx` | Confirm password change |
| Welcome to Platform | ✅ | `/auth/welcome.tsx` | Welcome new user |
| Account Suspended | 📝 | `/auth/account-suspended.tsx` | Account suspended notice |
| Account Reactivated | 📝 | `/auth/account-reactivated.tsx` | Account reactivated |
| Two-Factor Enabled | 📝 | `/auth/two-factor-enabled.tsx` | 2FA activated |
| Two-Factor Disabled | 📝 | `/auth/two-factor-disabled.tsx` | 2FA deactivated |
| Login from New Device | 📝 | `/auth/new-device-login.tsx` | Security alert |

---

## 2. TEAM MANAGEMENT (Platform Emails - Thorbis)

**Sender**: `team@thorbis.com`
**Layout**: BaseLayout (Thorbis branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Team Invitation | ✅ | `/team/invitation.tsx` | Invite team member |
| Invitation Accepted | 📝 | `/team/invitation-accepted.tsx` | Notify when accepted |
| Invitation Expired | 📝 | `/team/invitation-expired.tsx` | Invitation expired notice |
| Role Changed | 📝 | `/team/role-changed.tsx` | Role update notification |
| Team Member Removed | 📝 | `/team/member-removed.tsx` | Removed from team |
| Team Member Left | 📝 | `/team/member-left.tsx` | Member left notification |

---

## 3. ONBOARDING & SETUP (Platform Emails - Thorbis)

**Sender**: `onboarding@thorbis.com`
**Layout**: BaseLayout (Thorbis branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Verification Submitted | ✅ | `/onboarding/verification-submitted.tsx` | 10DLC submitted |
| Verification Complete | ✅ | `/onboarding/verification-complete.tsx` | 10DLC approved |
| Onboarding Step 1 Complete | 📝 | `/onboarding/step1-complete.tsx` | Company info done |
| Onboarding Step 2 Complete | 📝 | `/onboarding/step2-complete.tsx` | Team setup done |
| Onboarding Step 3 Complete | 📝 | `/onboarding/step3-complete.tsx` | Payment setup done |
| Onboarding Reminder | 📝 | `/onboarding/onboarding-reminder.tsx` | Complete setup |
| Email Domain Setup Required | 📝 | `/onboarding/email-domain-required.tsx` | Setup email domain |
| Email Domain Verified | 📝 | `/onboarding/email-domain-verified.tsx` | Domain verified |

---

## 4. CUSTOMER COMMUNICATIONS (Company Emails)

**Sender**: `notifications@mail.company.com`
**Layout**: CompanyLayout (Company branding)

### 4A. Appointments & Scheduling

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Appointment Confirmed | 🎨 | `/customer/appointment-confirmed.tsx` | Booking confirmed |
| Appointment Reminder (24hr) | 🔧 | `/customer/appointment-reminder.tsx` | Reminder 24hrs before |
| Appointment Rescheduled | 📝 | `/customer/appointment-rescheduled.tsx` | Appointment moved |
| Appointment Cancelled | 📝 | `/customer/appointment-cancelled.tsx` | Cancellation notice |
| Tech En Route | 🔧 | `/jobs/tech-en-route.tsx` | Tech on the way |
| Tech Arrived | 📝 | `/customer/tech-arrived.tsx` | Tech has arrived |
| Running Late | 📝 | `/customer/running-late.tsx` | Delayed arrival |

### 4B. Estimates & Quotes

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Quote Ready | 🎨 | `/customer/quote-ready.tsx` | Estimate ready to view |
| Estimate Sent | 🔧 | `/billing/estimate-sent.tsx` | Estimate delivered |
| Estimate Notification | 🔧 | `/customer/estimate-notification.tsx` | Estimate available |
| Quote Accepted | 📝 | `/customer/quote-accepted.tsx` | Quote approved |
| Quote Declined | 📝 | `/customer/quote-declined.tsx` | Quote rejected |
| Quote Expiring Soon | 📝 | `/customer/quote-expiring.tsx` | Quote expires soon |
| Revised Quote | 📝 | `/customer/revised-quote.tsx` | Updated estimate |

### 4C. Invoicing & Payments

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Invoice Sent | 🔧 | `/billing/invoice-sent.tsx` | New invoice |
| Invoice Notification | 🔧 | `/customer/invoice-notification.tsx` | Invoice ready |
| Payment Received | ✅ | `/billing/payment-received.tsx` | Payment confirmed |
| Payment Reminder | 🔧 | `/billing/payment-reminder.tsx` | Overdue notice |
| Payment Failed | 📝 | `/billing/payment-failed.tsx` | Failed payment |
| Payment Scheduled | 📝 | `/billing/payment-scheduled.tsx` | Auto-pay scheduled |
| Refund Processed | 📝 | `/billing/refund-processed.tsx` | Refund issued |
| Receipt | 📝 | `/billing/receipt.tsx` | Payment receipt |

### 4D. Job Updates

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Job Confirmation | 🔧 | `/jobs/job-confirmation.tsx` | Job scheduled |
| Job Started | 📝 | `/jobs/job-started.tsx` | Work begun |
| Job Complete | 🔧 | `/jobs/job-complete.tsx` | Work finished |
| Job On Hold | 📝 | `/jobs/job-on-hold.tsx` | Job paused |
| Job Cancelled | 📝 | `/jobs/job-cancelled.tsx` | Job cancelled |
| Additional Work Needed | 📝 | `/jobs/additional-work.tsx` | Extra work required |
| Parts on Order | 📝 | `/jobs/parts-on-order.tsx` | Waiting for parts |
| Parts Arrived | 📝 | `/jobs/parts-arrived.tsx` | Parts ready |

### 4E. Customer Engagement

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Welcome Customer | 🔧 | `/customer/welcome-customer.tsx` | First-time customer |
| Portal Invitation | 🔧 | `/customer/portal-invitation.tsx` | Access customer portal |
| Review Request | 🔧 | `/customer/review-request.tsx` | Request review |
| Service Reminder | 🔧 | `/customer/service-reminder.tsx` | Maintenance due |
| Thank You | 📝 | `/customer/thank-you.tsx` | Thank you for business |
| Birthday/Anniversary | 📝 | `/customer/birthday.tsx` | Special occasion |
| Loyalty Reward | 📝 | `/customer/loyalty-reward.tsx` | Loyalty program |
| Referral Reward | 📝 | `/customer/referral-reward.tsx` | Referral bonus |

### 4F. Service Plans & Maintenance

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Maintenance Plan Enrolled | 📝 | `/maintenance/plan-enrolled.tsx` | Plan activated |
| Maintenance Due | 📝 | `/maintenance/maintenance-due.tsx` | Scheduled maintenance |
| Plan Renewal | 📝 | `/maintenance/plan-renewal.tsx` | Plan expiring |
| Plan Cancelled | 📝 | `/maintenance/plan-cancelled.tsx` | Plan ended |
| Seasonal Service Reminder | 📝 | `/maintenance/seasonal-reminder.tsx` | Seasonal checkup |

---

## 5. INTERNAL NOTIFICATIONS (Platform Emails - Thorbis)

**Sender**: `notifications@thorbis.com`
**Layout**: BaseLayout (Thorbis branding)

### 5A. Billing & Subscription

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Subscription Started | 📝 | `/billing/subscription-started.tsx` | New subscription |
| Subscription Cancelled | 📝 | `/billing/subscription-cancelled.tsx` | Subscription ended |
| Payment Method Added | 📝 | `/billing/payment-method-added.tsx` | Card added |
| Payment Method Expiring | 📝 | `/billing/card-expiring.tsx` | Update card |
| Trial Ending Soon | 📝 | `/billing/trial-ending.tsx` | Trial expires soon |
| Invoice (Platform) | 📝 | `/billing/platform-invoice.tsx` | Thorbis invoice |
| Failed Payment (Platform) | 📝 | `/billing/platform-payment-failed.tsx` | Thorbis payment failed |

### 5B. System Notifications

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Data Export Ready | 📝 | `/system/data-export-ready.tsx` | Export complete |
| Import Complete | 📝 | `/system/import-complete.tsx` | Import finished |
| Integration Connected | 📝 | `/system/integration-connected.tsx` | New integration |
| Integration Failed | 📝 | `/system/integration-failed.tsx` | Integration error |
| Scheduled Report | 📝 | `/system/scheduled-report.tsx` | Weekly/monthly report |
| Storage Limit Warning | 📝 | `/system/storage-warning.tsx` | Storage nearly full |
| API Key Created | 📝 | `/system/api-key-created.tsx` | New API key |
| Webhook Failed | 📝 | `/system/webhook-failed.tsx` | Webhook error |

---

## 6. EMERGENCY & ALERTS (Company Emails)

**Sender**: `alerts@mail.company.com`
**Layout**: CompanyLayout (Company branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Emergency Service Request | 📝 | `/emergency/emergency-request.tsx` | Emergency call |
| After Hours Request | 📝 | `/emergency/after-hours.tsx` | Off-hours service |
| Equipment Failure Alert | 📝 | `/emergency/equipment-failure.tsx` | Critical failure |
| Service Outage | 📝 | `/emergency/service-outage.tsx` | System down |

---

## 7. MARKETING & PROMOTIONS (Company Emails)

**Sender**: `marketing@mail.company.com`
**Layout**: CompanyLayout (Company branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Newsletter | 📝 | `/marketing/newsletter.tsx` | Monthly newsletter |
| Seasonal Promotion | 📝 | `/marketing/seasonal-promotion.tsx` | Holiday deals |
| New Service Announcement | 📝 | `/marketing/new-service.tsx` | New offering |
| Special Offer | 📝 | `/marketing/special-offer.tsx` | Limited time deal |
| Flash Sale | 📝 | `/marketing/flash-sale.tsx` | Urgent promotion |
| Customer Reactivation | 📝 | `/marketing/win-back.tsx` | Win back customers |

---

## 8. COMPLIANCE & LEGAL (Platform Emails - Thorbis)

**Sender**: `legal@thorbis.com`
**Layout**: BaseLayout (Thorbis branding)

| Template | Status | File | Purpose |
|----------|--------|------|---------|
| Terms Updated | 📝 | `/legal/terms-updated.tsx` | TOS changed |
| Privacy Policy Updated | 📝 | `/legal/privacy-updated.tsx` | Privacy changed |
| GDPR Data Request | 📝 | `/legal/data-request.tsx` | Data export request |
| Account Deletion Request | 📝 | `/legal/deletion-request.tsx` | Delete account |
| Compliance Notice | 📝 | `/legal/compliance-notice.tsx` | Legal notice |

---

## Summary Statistics

| Category | Total | Exists | Needs Creation | Needs Migration |
|----------|-------|--------|----------------|-----------------|
| Authentication & Account | 10 | 5 | 5 | 0 |
| Team Management | 6 | 1 | 5 | 0 |
| Onboarding & Setup | 8 | 2 | 6 | 0 |
| Customer Communications | 48 | 13 | 24 | 11 |
| Internal Notifications | 15 | 0 | 15 | 0 |
| Emergency & Alerts | 4 | 0 | 4 | 0 |
| Marketing & Promotions | 6 | 0 | 6 | 0 |
| Compliance & Legal | 5 | 0 | 5 | 0 |
| **TOTAL** | **102** | **21** | **70** | **11** |

---

## Priority Roadmap

### Phase 1: Critical (Week 1-2)
**Fix existing templates + core customer flows**

1. ✅ Migrate all existing templates to correct layout (11 templates)
2. 📝 Create critical customer emails:
   - Appointment confirmed
   - Quote ready
   - Payment failed
   - Job started/complete
   - Emergency service

### Phase 2: High Priority (Week 3-4)
**Complete customer journey**

1. Service plan emails (enrollment, renewal, cancellation)
2. Additional job status emails
3. Customer engagement (thank you, referrals)
4. Revised quotes and estimates

### Phase 3: Medium Priority (Month 2)
**Platform features + internal**

1. System notifications (exports, imports, reports)
2. Additional authentication emails (2FA, security)
3. Team management completion
4. Billing & subscription (platform)

### Phase 4: Nice to Have (Month 3)
**Marketing + compliance**

1. Marketing templates (newsletters, promotions)
2. Emergency alerts
3. Compliance notices
4. Advanced features

---

## Template Naming Convention

**Format**: `{category}-{action}.tsx`

**Examples**:
- `appointment-confirmed.tsx` - Clear action
- `quote-ready.tsx` - Customer-facing name
- `tech-en-route.tsx` - Specific status
- `payment-failed.tsx` - Error state

**Categories**:
- `auth` - Authentication
- `team` - Team management
- `onboarding` - Onboarding flow
- `customer` - Customer communications
- `jobs` - Job updates
- `billing` - Invoices & payments
- `maintenance` - Service plans
- `marketing` - Promotions
- `emergency` - Alerts
- `system` - Internal notifications
- `legal` - Compliance

---

## Next Steps

1. **Migrate Existing Templates** (11 templates)
   - Update to use CompanyLayout where needed
   - Add company prop
   - Fix branding

2. **Create Phase 1 Critical Templates** (5-10 templates)
   - Focus on most-used customer flows
   - Test with real data

3. **Build Email Builder UI** (Future)
   - Allow companies to customize templates
   - Drag-and-drop editor
   - Preview system

4. **Add Email Analytics** (Future)
   - Track open rates
   - Click tracking
   - A/B testing

---

**Last Updated**: 2025-11-18
**Next Review**: After Phase 1 completion
