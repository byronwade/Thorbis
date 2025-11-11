-- Fix Team Access Issue
-- This script checks and repairs team_members records for users who should have company access

-- Step 1: Check current state
-- Run this first to see what your current team_members record looks like
SELECT
    tm.id,
    tm.user_id,
    tm.company_id,
    tm.status,
    u.email,
    u.name,
    c.name as company_name
FROM team_members tm
LEFT JOIN auth.users u ON tm.user_id = u.id
LEFT JOIN companies c ON tm.company_id = c.id
WHERE u.email = 'YOUR_EMAIL_HERE';  -- Replace with your actual email

-- Step 2: If you don't have a team_members record at all, you need to:
-- A) First check if you have a company
SELECT id, name, created_at FROM companies WHERE owner_id = auth.uid();

-- B) If you don't have a company, create one:
-- INSERT INTO companies (name, owner_id) VALUES ('Your Company Name', auth.uid());

-- C) Then create your team_members record:
-- INSERT INTO team_members (user_id, company_id, role_id, status, job_title)
-- SELECT
--     auth.uid(),
--     c.id,
--     '1'::uuid,  -- Owner role (you may need to adjust this)
--     'active',
--     'Owner'
-- FROM companies c WHERE c.owner_id = auth.uid();

-- Step 3: If you have a team_members record but company_id is NULL, fix it:
-- UPDATE team_members
-- SET company_id = (SELECT id FROM companies WHERE owner_id = auth.uid() LIMIT 1)
-- WHERE user_id = auth.uid() AND company_id IS NULL;

-- Step 4: If you have a team_members record but status is not 'active', fix it:
-- UPDATE team_members
-- SET status = 'active'
-- WHERE user_id = auth.uid();

-- Step 5: Verify the fix
SELECT
    tm.id,
    tm.user_id,
    tm.company_id,
    tm.status,
    tm.role_id,
    u.email,
    c.name as company_name
FROM team_members tm
JOIN auth.users u ON tm.user_id = u.id
LEFT JOIN companies c ON tm.company_id = c.id
WHERE u.email = 'YOUR_EMAIL_HERE';  -- Replace with your actual email
