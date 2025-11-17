# Jobs Actions Test Checklist

## Pre-Deployment Tests

### 1. updateJob() Tests

#### Core Fields Only
- [ ] Update title only
- [ ] Update description only
- [ ] Update status only
- [ ] Update priority only
- [ ] Update job_type only
- [ ] Update notes only
- [ ] Update scheduled_start/end only
- [ ] Update assigned_to only
- [ ] Update customer_id only
- [ ] Update property_id only
- [ ] Verify only jobs table updated

#### Financial Fields Only
- [ ] Update total_amount only
- [ ] Update paid_amount only
- [ ] Update deposit_amount only
- [ ] Update all financial fields
- [ ] Verify only job_financial table updated

#### Mixed Updates
- [ ] Update core + financial fields together
- [ ] Verify both tables updated correctly
- [ ] Verify atomic update (both succeed or both fail)

#### Error Handling
- [ ] Test with invalid job_id (should fail)
- [ ] Test with wrong company_id (should fail - forbidden)
- [ ] Test with completed job as non-admin (should fail)
- [ ] Test with cancelled job as non-admin (should fail)
- [ ] Test property-customer mismatch (should fail)
- [ ] Simulate job_financial update failure
- [ ] Verify no partial updates

---

### 2. startJob() Tests

#### Happy Path
- [ ] Start quoted job
- [ ] Start scheduled job
- [ ] Verify status changed to "in_progress"
- [ ] Verify actual_start timestamp set in job_time_tracking
- [ ] Verify timestamp is recent (within 1 second)

#### Error Cases
- [ ] Try starting completed job (should fail)
- [ ] Try starting cancelled job (should fail)
- [ ] Try starting in_progress job (should fail)
- [ ] Test with invalid job_id (should fail)
- [ ] Test with wrong company_id (should fail)
- [ ] Simulate job_time_tracking update failure

---

### 3. completeJob() Tests

#### Happy Path with Labor Hours
- [ ] Complete job that was started
- [ ] Verify status changed to "completed"
- [ ] Verify actual_end timestamp set
- [ ] Verify total_labor_hours calculated correctly
- [ ] Test 1 hour job (verify hours = 1.0)
- [ ] Test 30 minute job (verify hours = 0.5)
- [ ] Test multi-day job (verify hours > 24)

#### Without actual_start
- [ ] Complete job without actual_start
- [ ] Verify status changed to "completed"
- [ ] Verify actual_end set
- [ ] Verify total_labor_hours is null or 0

#### Error Cases
- [ ] Try completing quoted job (should fail)
- [ ] Try completing scheduled job (should fail)
- [ ] Try completing cancelled job (should fail)
- [ ] Test with invalid job_id (should fail)
- [ ] Test with wrong company_id (should fail)
- [ ] Simulate job_time_tracking update failure

---

### 4. archiveJob() Tests

#### Happy Path
- [ ] Archive quoted job
- [ ] Archive scheduled job
- [ ] Verify deleted_at set
- [ ] Verify archived_at set
- [ ] Verify status changed to "archived"
- [ ] Verify deleted_by set to current user
- [ ] Verify permanent_delete_scheduled_at set to 90 days from now

#### Business Rules
- [ ] Try archiving completed job (should fail)
- [ ] Try archiving invoiced job (should fail)

#### Error Cases
- [ ] Test with invalid job_id (should fail)
- [ ] Test with wrong company_id (should fail)
- [ ] Simulate job_multi_entity update failure

---

### 5. restoreJob() Tests

#### Happy Path
- [ ] Archive a job first
- [ ] Restore archived job
- [ ] Verify deleted_at cleared
- [ ] Verify archived_at cleared
- [ ] Verify deleted_by cleared
- [ ] Verify permanent_delete_scheduled_at cleared
- [ ] Verify status changed from "archived" to "scheduled"

#### Error Cases
- [ ] Try restoring non-archived job (should fail)
- [ ] Test with invalid job_id (should fail)
- [ ] Test with wrong company_id (should fail)
- [ ] Simulate job_multi_entity update failure

---

### 6. Full Lifecycle Tests

#### Create → Start → Complete → Archive → Restore
- [ ] Create new job
- [ ] Verify all 10 domain tables created
- [ ] Start the job
- [ ] Verify actual_start set
- [ ] Complete the job
- [ ] Verify actual_end and total_labor_hours set
- [ ] Archive the job
- [ ] Verify deleted_by and permanent_delete_scheduled_at set
- [ ] Restore the job
- [ ] Verify all archive metadata cleared
- [ ] Verify job is in "scheduled" status

#### Create → Update Financial → Archive
- [ ] Create new job
- [ ] Update total_amount
- [ ] Verify job_financial.total_amount updated
- [ ] Update paid_amount
- [ ] Verify job_financial.paid_amount updated
- [ ] Archive the job
- [ ] Verify all metadata set correctly

---

### 7. Error Handling & Atomicity Tests

#### Parallel Update Failures
- [ ] Mock jobs table update to fail
- [ ] Attempt updateJob() with financial fields
- [ ] Verify neither table updated (atomic rollback)

- [ ] Mock job_financial table update to fail
- [ ] Attempt updateJob() with financial fields
- [ ] Verify neither table updated (atomic rollback)

- [ ] Mock job_time_tracking table update to fail
- [ ] Attempt startJob()
- [ ] Verify status not changed (atomic rollback)

- [ ] Mock job_multi_entity table update to fail
- [ ] Attempt archiveJob()
- [ ] Verify jobs table not updated (atomic rollback)

#### Concurrent Updates
- [ ] Start two updateJob() requests simultaneously
- [ ] Verify both complete without conflict
- [ ] Verify last write wins (or both succeed)
- [ ] Check for data consistency

---

### 8. Permission & Security Tests

#### Company Isolation (RLS)
- [ ] User A (Company X) creates job
- [ ] User B (Company Y) tries to update job (should fail - forbidden)
- [ ] User B tries to start job (should fail - forbidden)
- [ ] User B tries to complete job (should fail - forbidden)
- [ ] User B tries to archive job (should fail - forbidden)

#### Role-Based Access
- [ ] Non-admin user tries to edit completed job (should fail)
- [ ] Admin user edits completed job (should succeed)
- [ ] Owner user edits completed job (should succeed)

---

### 9. Performance Tests

#### Single Job Operations
- [ ] Measure updateJob() latency (target: < 100ms)
- [ ] Measure startJob() latency (target: < 50ms)
- [ ] Measure completeJob() latency (target: < 100ms)
- [ ] Measure archiveJob() latency (target: < 100ms)
- [ ] Measure restoreJob() latency (target: < 100ms)

#### Batch Operations
- [ ] Update 10 jobs sequentially
- [ ] Measure total time
- [ ] Update 100 jobs sequentially
- [ ] Measure total time

#### Query Performance
- [ ] Measure getJob() with all domain data (target: < 50ms)
- [ ] Check database query plan
- [ ] Verify indexes used correctly
- [ ] Check for N+1 queries

---

### 10. Edge Cases

#### Null/Empty Values
- [ ] Update job with null customer_id
- [ ] Update job with null property_id
- [ ] Update job with null assigned_to
- [ ] Update job with empty string notes
- [ ] Update financial fields with 0 values

#### Large Values
- [ ] Update total_amount with very large number (> 1 million)
- [ ] Update notes with very long text (> 10,000 chars)
- [ ] Complete job after many days (> 30 days labor hours)

#### Missing Domain Records
- [ ] Create old-style job without domain records
- [ ] Attempt to update financial fields (should create or fail gracefully)
- [ ] Attempt to start job (should create or fail gracefully)

---

## Integration Tests

### Database Consistency
- [ ] Create job, verify all 10 domain tables have records
- [ ] Update job, verify only modified tables updated
- [ ] Delete job, verify CASCADE deletes all domain records

### Revalidation Paths
- [ ] updateJob() revalidates /dashboard/work
- [ ] updateJob() revalidates /dashboard/work/[id]
- [ ] startJob() revalidates correct paths
- [ ] completeJob() revalidates correct paths
- [ ] archiveJob() revalidates archive page
- [ ] restoreJob() revalidates all affected pages

### Notifications
- [ ] createJob() with assigned_to sends notification
- [ ] Verify notification includes correct job details

---

## Manual Testing Scenarios

### UI Testing
- [ ] Create job via form
- [ ] Edit job via form
- [ ] Update financial fields via invoice
- [ ] Start job via button click
- [ ] Complete job via button click
- [ ] Archive job via settings
- [ ] Restore job via archive page

### Real-World Workflows
- [ ] HVAC service call: create → assign → start → complete → invoice
- [ ] Recurring maintenance: create recurring → edit schedule → complete first instance
- [ ] Cancelled job: create → schedule → cancel with reason
- [ ] Emergency job: create with urgent priority → assign → start → complete

---

## Regression Tests

### Previously Working Features
- [ ] Job creation still works
- [ ] Job listing still works
- [ ] Job search still works
- [ ] Job assignment still works
- [ ] Job scheduling still works
- [ ] Job cancellation still works
- [ ] Team assignment removal still works

---

## Sign-Off

### Test Results
- [ ] All unit tests passed
- [ ] All integration tests passed
- [ ] All performance benchmarks met
- [ ] All security tests passed
- [ ] All edge cases handled
- [ ] No regressions detected

### Stakeholder Approval
- [ ] QA Engineer: _______________  Date: ________
- [ ] Backend Developer: _______________  Date: ________
- [ ] Product Owner: _______________  Date: ________

---

## Notes

### Known Issues
- None

### Deferred Tests
- None

### Test Environment
- Database: Supabase (staging)
- Branch: feature/jobs-domain-refactor
- Deployed: [Date]
- Tester: [Name]

---

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs for domain table issues
- [ ] Check database slow query log
- [ ] Verify no partial updates
- [ ] Monitor RLS policy performance
- [ ] Check revalidation working correctly

### First Week
- [ ] Review user feedback
- [ ] Check for edge cases in production
- [ ] Monitor database growth (domain tables)
- [ ] Verify CASCADE deletes working
- [ ] Performance trending analysis

---

**Status:** ⏳ Ready for testing
**Priority:** 🔴 High - Database schema change
**Risk Level:** 🟡 Medium - Backward compatible, but multi-table updates
