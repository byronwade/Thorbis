-- Add Stripe billing fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add Stripe billing fields to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT CHECK (stripe_subscription_status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid', 'paused')),
ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription_id ON companies(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON companies(stripe_subscription_status);

-- Add comment explaining multi-org billing
COMMENT ON COLUMN companies.stripe_subscription_id IS 'Each company has its own subscription. First org is base plan, additional orgs add $100/month fee.';
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for the user. One customer can have multiple subscriptions (one per company).';
