/**
 * Email System Cascade Constraints
 *
 * Ensures proper cascade behavior when companies or team members are deleted.
 * Prevents orphaned records and maintains data integrity.
 *
 * CRITICAL: Review existing foreign keys before running this migration!
 *
 * Cascade Behavior:
 * - Company deleted → Delete all related email data
 * - Team member deleted → Delete tokens/accounts, nullify communications
 * - Email account deleted → Delete tokens
 */

-- ============================================================================
-- VERIFY EXISTING CONSTRAINTS
-- ============================================================================

-- Check existing foreign keys
DO $$
BEGIN
	RAISE NOTICE 'Checking existing foreign key constraints...';
END $$;

-- List all foreign keys for our tables
SELECT
	tc.table_name,
	kcu.column_name,
	ccu.table_name AS foreign_table_name,
	ccu.column_name AS foreign_column_name,
	rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
	ON tc.constraint_name = kcu.constraint_name
	AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
	ON ccu.constraint_name = tc.constraint_name
	AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
	ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
	AND tc.table_name IN (
		'user_email_accounts',
		'user_gmail_tokens',
		'user_workspace_tokens',
		'email_permissions'
	)
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- UPDATE user_email_accounts CONSTRAINTS
-- ============================================================================

-- Drop existing foreign keys if they exist
ALTER TABLE IF EXISTS user_email_accounts
	DROP CONSTRAINT IF EXISTS user_email_accounts_company_id_fkey,
	DROP CONSTRAINT IF EXISTS user_email_accounts_user_id_fkey;

-- Add foreign keys with proper cascade rules
ALTER TABLE user_email_accounts
	ADD CONSTRAINT user_email_accounts_company_id_fkey
		FOREIGN KEY (company_id)
		REFERENCES companies(id)
		ON DELETE CASCADE, -- Delete accounts when company deleted

	ADD CONSTRAINT user_email_accounts_user_id_fkey
		FOREIGN KEY (user_id)
		REFERENCES team_members(id)
		ON DELETE CASCADE; -- Delete accounts when team member deleted

-- ============================================================================
-- UPDATE user_gmail_tokens CONSTRAINTS
-- ============================================================================

-- Drop existing foreign keys
ALTER TABLE IF EXISTS user_gmail_tokens
	DROP CONSTRAINT IF EXISTS user_gmail_tokens_user_email_account_id_fkey,
	DROP CONSTRAINT IF EXISTS user_gmail_tokens_team_member_id_fkey;

-- Add foreign keys with proper cascade rules
ALTER TABLE user_gmail_tokens
	ADD CONSTRAINT user_gmail_tokens_user_email_account_id_fkey
		FOREIGN KEY (user_email_account_id)
		REFERENCES user_email_accounts(id)
		ON DELETE CASCADE, -- Delete tokens when email account deleted

	ADD CONSTRAINT user_gmail_tokens_team_member_id_fkey
		FOREIGN KEY (team_member_id)
		REFERENCES team_members(id)
		ON DELETE CASCADE; -- Delete tokens when team member deleted

-- ============================================================================
-- UPDATE user_workspace_tokens CONSTRAINTS
-- ============================================================================

-- Drop existing foreign keys
ALTER TABLE IF EXISTS user_workspace_tokens
	DROP CONSTRAINT IF EXISTS user_workspace_tokens_company_id_fkey;

-- Add foreign keys with proper cascade rules
ALTER TABLE user_workspace_tokens
	ADD CONSTRAINT user_workspace_tokens_company_id_fkey
		FOREIGN KEY (company_id)
		REFERENCES companies(id)
		ON DELETE CASCADE; -- Delete workspace tokens when company deleted

-- ============================================================================
-- UPDATE email_permissions CONSTRAINTS
-- ============================================================================

-- Drop existing foreign keys
ALTER TABLE IF EXISTS email_permissions
	DROP CONSTRAINT IF EXISTS email_permissions_company_id_fkey,
	DROP CONSTRAINT IF EXISTS email_permissions_team_member_id_fkey;

-- Add foreign keys with proper cascade rules
ALTER TABLE email_permissions
	ADD CONSTRAINT email_permissions_company_id_fkey
		FOREIGN KEY (company_id)
		REFERENCES companies(id)
		ON DELETE CASCADE, -- Delete permissions when company deleted

	ADD CONSTRAINT email_permissions_team_member_id_fkey
		FOREIGN KEY (team_member_id)
		REFERENCES team_members(id)
		ON DELETE CASCADE; -- Delete permissions when team member deleted

-- ============================================================================
-- UPDATE communications TABLE
-- ============================================================================

-- Drop existing foreign keys for new columns
ALTER TABLE IF EXISTS communications
	DROP CONSTRAINT IF EXISTS communications_mailbox_owner_id_fkey,
	DROP CONSTRAINT IF EXISTS communications_email_account_id_fkey;

-- Add foreign keys with proper nullify rules
ALTER TABLE communications
	ADD CONSTRAINT communications_mailbox_owner_id_fkey
		FOREIGN KEY (mailbox_owner_id)
		REFERENCES team_members(id)
		ON DELETE SET NULL, -- Nullify when mailbox owner deleted (keep email for records)

	ADD CONSTRAINT communications_email_account_id_fkey
		FOREIGN KEY (email_account_id)
		REFERENCES user_email_accounts(id)
		ON DELETE SET NULL; -- Nullify when email account deleted (keep email for records)

-- ============================================================================
-- ADD INDEXES FOR FOREIGN KEYS
-- ============================================================================

-- Indexes for user_email_accounts
CREATE INDEX IF NOT EXISTS idx_user_email_accounts_company_id
	ON user_email_accounts(company_id);

CREATE INDEX IF NOT EXISTS idx_user_email_accounts_user_id
	ON user_email_accounts(user_id);

-- Indexes for user_gmail_tokens
CREATE INDEX IF NOT EXISTS idx_user_gmail_tokens_team_member_id
	ON user_gmail_tokens(team_member_id);

CREATE INDEX IF NOT EXISTS idx_user_gmail_tokens_user_email_account_id
	ON user_gmail_tokens(user_email_account_id);

-- Indexes for user_workspace_tokens
CREATE INDEX IF NOT EXISTS idx_user_workspace_tokens_company_id
	ON user_workspace_tokens(company_id);

-- Indexes for email_permissions
CREATE INDEX IF NOT EXISTS idx_email_permissions_company_id
	ON email_permissions(company_id);

CREATE INDEX IF NOT EXISTS idx_email_permissions_team_member_id
	ON email_permissions(team_member_id);

CREATE INDEX IF NOT EXISTS idx_email_permissions_category
	ON email_permissions(email_category);

-- Indexes for communications
CREATE INDEX IF NOT EXISTS idx_communications_mailbox_owner_id
	ON communications(mailbox_owner_id)
	WHERE mailbox_owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_communications_email_account_id
	ON communications(email_account_id)
	WHERE email_account_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_communications_visibility_scope
	ON communications(visibility_scope)
	WHERE visibility_scope IS NOT NULL;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all constraints are in place
DO $$
DECLARE
	constraint_count INTEGER;
BEGIN
	SELECT COUNT(*)
	INTO constraint_count
	FROM information_schema.table_constraints
	WHERE constraint_type = 'FOREIGN KEY'
		AND table_name IN (
			'user_email_accounts',
			'user_gmail_tokens',
			'user_workspace_tokens',
			'email_permissions',
			'communications'
		);

	RAISE NOTICE 'Total foreign key constraints: %', constraint_count;

	IF constraint_count < 9 THEN
		RAISE WARNING 'Expected at least 9 foreign key constraints, found %', constraint_count;
	ELSE
		RAISE NOTICE 'All foreign key constraints verified';
	END IF;
END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

/*
Cascade Rules Summary:

Company Deletion:
✓ user_email_accounts → CASCADE (deleted)
✓ user_gmail_tokens → CASCADE (deleted via email_accounts)
✓ user_workspace_tokens → CASCADE (deleted)
✓ email_permissions → CASCADE (deleted)
✓ communications → No cascade (kept for records)

Team Member Deletion:
✓ user_email_accounts → CASCADE (deleted)
✓ user_gmail_tokens → CASCADE (deleted)
✓ email_permissions → CASCADE (deleted)
✓ communications.mailbox_owner_id → SET NULL (kept, orphaned)
✓ communications.email_account_id → SET NULL (kept, orphaned)

Email Account Deletion:
✓ user_gmail_tokens → CASCADE (deleted)
✓ communications.email_account_id → SET NULL (kept, orphaned)

This ensures:
1. No orphaned tokens or permissions
2. Communications preserved for audit trail
3. Clean cascade on company deletion
4. Proper cleanup on team member deletion
*/
