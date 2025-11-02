-- Add payment methods table to store customer payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL UNIQUE,

  -- Payment method details
  type TEXT NOT NULL CHECK (type IN ('card', 'apple_pay', 'google_pay', 'paypal', 'amazon_pay', 'klarna', 'link')),
  brand TEXT, -- For cards: 'visa', 'mastercard', etc.
  last4 TEXT, -- Last 4 digits for cards
  exp_month INTEGER, -- Expiration month for cards
  exp_year INTEGER, -- Expiration year for cards
  wallet_type TEXT, -- For wallets: 'apple_pay', 'google_pay', etc.

  -- Display information
  display_name TEXT, -- User-friendly name (e.g., "Visa •••• 4242")

  -- Default payment method flags
  is_default BOOLEAN DEFAULT FALSE,
  is_default_for_subscription BOOLEAN DEFAULT FALSE,

  -- Metadata
  billing_details JSONB, -- Name, email, phone, address
  allow_redisplay TEXT CHECK (allow_redisplay IN ('always', 'limited', 'unspecified')) DEFAULT 'limited',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_id ON payment_methods(stripe_payment_method_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(user_id, is_default) WHERE is_default = TRUE;
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);

-- Ensure only one default payment method per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_methods_one_default_per_user
ON payment_methods(user_id)
WHERE is_default = TRUE;

-- Ensure only one default subscription payment method per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_methods_one_default_subscription_per_user
ON payment_methods(user_id)
WHERE is_default_for_subscription = TRUE;

-- Add RLS policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment methods
CREATE POLICY "Users can view own payment methods"
ON payment_methods
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own payment methods
CREATE POLICY "Users can insert own payment methods"
ON payment_methods
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment methods
CREATE POLICY "Users can update own payment methods"
ON payment_methods
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own payment methods
CREATE POLICY "Users can delete own payment methods"
ON payment_methods
FOR DELETE
USING (auth.uid() = user_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_payment_methods_updated_at();

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_one_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a new default, unset all others for this user
  IF NEW.is_default = TRUE THEN
    UPDATE payment_methods
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = TRUE;
  END IF;

  -- If setting a new default for subscriptions, unset all others for this user
  IF NEW.is_default_for_subscription = TRUE THEN
    UPDATE payment_methods
    SET is_default_for_subscription = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default_for_subscription = TRUE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure only one default per user
CREATE TRIGGER ensure_one_default_payment_method
BEFORE INSERT OR UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION ensure_one_default_payment_method();

-- Add comments
COMMENT ON TABLE payment_methods IS 'Stores customer payment methods (cards, Apple Pay, Google Pay, etc.) with default preferences';
COMMENT ON COLUMN payment_methods.is_default IS 'Default payment method for one-time payments';
COMMENT ON COLUMN payment_methods.is_default_for_subscription IS 'Default payment method for subscription payments';
COMMENT ON COLUMN payment_methods.allow_redisplay IS 'Controls whether payment method can be shown to customer for future purchases. "always" = can prefill, "limited" = saved but not prefilled, "unspecified" = merchant decides';
