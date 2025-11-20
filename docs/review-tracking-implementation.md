# Review Tracking Implementation

## Overview

Comprehensive customer review tracking system integrated into job details. Tracks the entire review funnel from request to submission, with full engagement metrics and multi-platform support.

## Database Schema

### New Fields Added to `jobs` Table

```sql
-- Request Tracking
review_request_sent_at timestamptz
review_request_method varchar(50)  -- email, sms, both, in_person, automatic

-- Engagement Tracking
review_link_clicked boolean DEFAULT false
review_link_clicked_at timestamptz

-- Submission Tracking
review_submitted boolean DEFAULT false
review_submitted_at timestamptz
review_platform varchar(50)  -- google, yelp, facebook, etc.
review_rating integer (1-5)
review_text text
review_url text

-- Follow-up Management
review_follow_up_sent boolean DEFAULT false
review_follow_up_sent_at timestamptz
review_reminder_count integer DEFAULT 0  -- Max 3 reminders
review_last_reminder_sent_at timestamptz

-- Opt-out Management
review_opt_out boolean DEFAULT false
review_notes text  -- Internal notes
```

### Indexes Created

```sql
-- Track all review requests
idx_jobs_review_tracking ON jobs(company_id, review_request_sent_at DESC)

-- Track submitted reviews
idx_jobs_review_submitted ON jobs(company_id, review_submitted, review_rating DESC)

-- Track pending reviews
idx_jobs_review_pending ON jobs(company_id, review_request_sent_at DESC)
  WHERE review_submitted = false AND review_opt_out = false
```

### Constraints

- **Rating Range**: 1-5 stars
- **Reminder Limit**: Max 5 reminders (recommended: 3)
- **Request Method**: email, sms, both, in_person, automatic
- **Review Platform**: google, yelp, facebook, thumbtack, angi, homeadvisor, bbb, nextdoor, trustpilot, other

## UI Component

### ReviewTrackingCard Features

1. **Customer Information Display**
   - Name, email, phone
   - Quick action buttons

2. **Review Funnel Visualization**
   - Request Sent → Link Clicked → Review Submitted
   - Color-coded progress indicators
   - Timestamps with "time ago" formatting

3. **Review Link Generation**
   - Unique tracking URL: `https://app.thorbis.com/r/{jobId}`
   - Copy to clipboard functionality
   - Redirects to appropriate review platform

4. **Request Management**
   - Send initial request (email/SMS/both)
   - Send reminders (max 3)
   - Track reminder count and timestamps

5. **Review Details**
   - Platform selection (10+ platforms supported)
   - Star rating (1-5)
   - Review text capture
   - Direct URL to published review

6. **Status Badges**
   - Not Requested (gray)
   - Request Sent (yellow)
   - Link Clicked (blue)
   - Review Submitted (green)
   - Opted Out (gray)

7. **Editable Fields**
   - All tracking data manually updatable
   - Internal notes section
   - Save/cancel functionality

## Review Funnel Metrics

### Key Performance Indicators

1. **Request Sent Rate**
   - % of completed jobs with review requests

2. **Click-Through Rate (CTR)**
   - % of requests where customer clicked link
   - Target: 30-40%

3. **Conversion Rate**
   - % of link clicks that result in submitted review
   - Target: 40-60%

4. **Overall Submission Rate**
   - % of requests that result in completed reviews
   - Target: 15-25%

5. **Average Star Rating**
   - Mean rating across all submitted reviews
   - Target: 4.5+ stars

6. **Reminder Effectiveness**
   - Conversion rate improvement from reminders
   - Optimal reminder timing

## Review Request Flow

### Automatic Flow (Recommended)

```
Job Completed
    ↓
Wait 24 hours (cooling period)
    ↓
Send review request (email + SMS)
    ↓
Track link click
    ↓
If no submission after 3 days → Send Reminder #1
    ↓
If no submission after 7 days → Send Reminder #2
    ↓
If no submission after 14 days → Send Reminder #3
    ↓
If no submission after 30 days → Mark as stale
```

### Manual Flow

1. CSR marks job as "Review Ready"
2. Select request method (email/SMS/both)
3. System generates tracking link
4. Request sent to customer
5. CSR can manually send reminders
6. CSR can manually record review details

## Supported Review Platforms

### Primary Platforms
- **Google Business Profile** - Most important for local SEO
- **Yelp** - High visibility for service businesses
- **Facebook** - Social proof and engagement
- **Better Business Bureau (BBB)** - Trust and credibility

### Secondary Platforms
- **Thumbtack** - Lead generation
- **Angi (Angie's List)** - Service marketplace
- **HomeAdvisor** - Home services directory
- **Nextdoor** - Neighborhood-level marketing
- **Trustpilot** - General review platform
- **Other** - Custom platforms

## Thorbis Review Link System

### How It Works

1. **Unique Link Generation**
   ```
   https://app.thorbis.com/r/{jobId}
   ```

2. **Link Destination Logic**
   - Check company's primary review platform preference
   - Redirect to appropriate platform review page
   - Track click timestamp
   - Log user agent and referrer

3. **Platform-Specific Redirects**
   - Google: Direct to Google Business review form
   - Yelp: Direct to business page with review prompt
   - Facebook: Direct to Facebook page reviews section
   - Others: Configurable redirect URLs

### Link Tracking Implementation

```typescript
// API Route: /api/r/[jobId]
GET /r/{jobId}
  ↓
1. Log click event (timestamp, IP, user agent)
2. Update job.review_link_clicked = true
3. Get company's review platform preference
4. Redirect to platform-specific URL
5. Return 302 redirect
```

## Database Queries

### Get Review Conversion Funnel

```sql
SELECT
  COUNT(*) FILTER (WHERE review_request_sent_at IS NOT NULL) as requests_sent,
  COUNT(*) FILTER (WHERE review_link_clicked = true) as clicks,
  COUNT(*) FILTER (WHERE review_submitted = true) as submissions,
  ROUND(
    COUNT(*) FILTER (WHERE review_link_clicked = true) * 100.0 /
    NULLIF(COUNT(*) FILTER (WHERE review_request_sent_at IS NOT NULL), 0),
    2
  ) as click_rate,
  ROUND(
    COUNT(*) FILTER (WHERE review_submitted = true) * 100.0 /
    NULLIF(COUNT(*) FILTER (WHERE review_link_clicked = true), 0),
    2
  ) as conversion_rate,
  ROUND(AVG(review_rating), 2) as avg_rating
FROM jobs
WHERE company_id = $1
  AND review_request_sent_at IS NOT NULL;
```

### Get Pending Reviews

```sql
SELECT
  j.id,
  j.job_number,
  c.first_name || ' ' || c.last_name as customer_name,
  c.email,
  c.phone,
  j.review_request_sent_at,
  j.review_reminder_count,
  j.review_last_reminder_sent_at
FROM jobs j
LEFT JOIN customers c ON j.customer_id = c.id
WHERE j.company_id = $1
  AND j.review_request_sent_at IS NOT NULL
  AND j.review_submitted = false
  AND j.review_opt_out = false
  AND (
    -- Never sent a reminder
    j.review_reminder_count = 0
    AND j.review_request_sent_at < NOW() - INTERVAL '3 days'
  ) OR (
    -- Last reminder was >7 days ago and <3 reminders sent
    j.review_reminder_count < 3
    AND j.review_last_reminder_sent_at < NOW() - INTERVAL '7 days'
  )
ORDER BY j.review_request_sent_at ASC
LIMIT 50;
```

### Get Top Reviews by Rating

```sql
SELECT
  j.id,
  j.job_number,
  c.first_name || ' ' || c.last_name as customer_name,
  j.review_rating,
  j.review_text,
  j.review_platform,
  j.review_url,
  j.review_submitted_at
FROM jobs j
LEFT JOIN customers c ON j.customer_id = c.id
WHERE j.company_id = $1
  AND j.review_submitted = true
  AND j.review_rating >= 4
ORDER BY j.review_rating DESC, j.review_submitted_at DESC
LIMIT 20;
```

## Next Steps (Post-MVP)

### Automation Features

1. **Auto-Send Review Requests**
   - Trigger: Job status = "Completed" + 24 hours
   - Condition: Customer has email or phone
   - Action: Send review request via preferred method

2. **Smart Reminder Scheduling**
   - Reminder #1: 3 days after request (if no click)
   - Reminder #2: 7 days after request (if clicked but not submitted)
   - Reminder #3: 14 days after request (final attempt)

3. **Review Response Automation**
   - Auto-reply to 5-star reviews (thank you)
   - Flag 1-3 star reviews for manual response
   - Send internal alerts for negative reviews

### Analytics Dashboard

1. **Review Funnel Dashboard**
   - Requests sent, clicks, submissions
   - Conversion rates by channel
   - Time-to-submission metrics

2. **Rating Trends**
   - Average rating over time
   - Rating distribution chart
   - Platform comparison

3. **Top Performers**
   - Technicians with highest ratings
   - Job types with best reviews
   - Time periods with most reviews

### Integration Features

1. **Email Templates**
   - Customizable review request emails
   - Company branding
   - Multi-language support

2. **SMS Templates**
   - Short, friendly review requests
   - Direct link to review page
   - Character limit optimization

3. **QR Code Generation**
   - Generate QR codes for in-person requests
   - Print on invoices, business cards
   - Track offline-to-online conversions

## Security & Privacy

### Data Protection

- Review data is company-scoped (RLS policies)
- Only company members can view review data
- Customer opt-outs are permanently respected
- Review link clicks are anonymized (no PII stored)

### Compliance

- TCPA compliance for SMS (opt-in required)
- CAN-SPAM compliance for email
- GDPR compliance (right to be forgotten)
- One-click unsubscribe from review requests

## Success Metrics

### Target KPIs (3 months post-implementation)

- **Request Rate**: 80%+ of completed jobs
- **Click Rate**: 35%+ of requests
- **Submission Rate**: 20%+ of requests
- **Average Rating**: 4.5+ stars
- **Response Time**: <24 hours for negative reviews

## Implementation Status

- [x] Database schema created
- [x] ReviewTrackingCard component built
- [x] Job detail page integration
- [x] RLS policies verified
- [ ] Review request API endpoint
- [ ] Review link redirect handler
- [ ] Email/SMS templates
- [ ] Automation workflows
- [ ] Analytics dashboard

---

**Document Version**: 1.0
**Last Updated**: 2025-01-19
**Status**: Database & UI Complete, Automation Pending
