-- ============================================================================
-- INVOICE PAYMENT TOKENS MIGRATION
-- ============================================================================
-- Migration: 20250113000001_add_invoice_payment_tokens
-- Description: Adds secure payment token system for customer invoice payments
-- Date: 2025-01-13
-- ============================================================================

-- ============================================================================
-- 1. PAYMENT TOKENS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoice_payment_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE, -- Secure random token
  
  -- Token metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Security tracking
  created_by_ip VARCHAR(45), -- IPv4 or IPv6
  used_by_ip VARCHAR(45),
  use_count INTEGER DEFAULT 0, -- Track multiple use attempts
  max_uses INTEGER DEFAULT 1, -- Usually 1, but can allow multiple for retry scenarios
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Index for fast token lookup
CREATE INDEX idx_invoice_payment_tokens_token ON invoice_payment_tokens(token) WHERE is_active = true;

-- Index for invoice lookups
CREATE INDEX idx_invoice_payment_tokens_invoice_id ON invoice_payment_tokens(invoice_id);

-- Index for cleanup of expired tokens
CREATE INDEX idx_invoice_payment_tokens_expires_at ON invoice_payment_tokens(expires_at) WHERE is_active = true;

-- ============================================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE invoice_payment_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read tokens (needed for public payment page)
-- Token validation happens in application logic
CREATE POLICY "Anyone can read active payment tokens"
ON invoice_payment_tokens FOR SELECT
USING (is_active = true AND expires_at > NOW());

-- Policy: Only authenticated users can create tokens
CREATE POLICY "Authenticated users can create payment tokens"
ON invoice_payment_tokens FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update tokens
CREATE POLICY "Authenticated users can update payment tokens"
ON invoice_payment_tokens FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 3. HELPER FUNCTIONS
-- ============================================================================

-- Function to generate a secure payment token
CREATE OR REPLACE FUNCTION generate_invoice_payment_token(
  p_invoice_id UUID,
  p_expiry_hours INTEGER DEFAULT 72, -- 3 days default
  p_max_uses INTEGER DEFAULT 1
)
RETURNS TABLE(token VARCHAR(64), expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token VARCHAR(64);
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Generate secure random token
  v_token := encode(gen_random_bytes(32), 'hex');
  v_expires_at := NOW() + (p_expiry_hours || ' hours')::INTERVAL;
  
  -- Deactivate any existing active tokens for this invoice
  UPDATE invoice_payment_tokens
  SET is_active = false
  WHERE invoice_id = p_invoice_id
    AND is_active = true;
  
  -- Insert new token
  INSERT INTO invoice_payment_tokens (
    invoice_id,
    token,
    expires_at,
    max_uses
  ) VALUES (
    p_invoice_id,
    v_token,
    v_expires_at,
    p_max_uses
  );
  
  RETURN QUERY SELECT v_token, v_expires_at;
END;
$$;

-- Function to validate and mark token as used
CREATE OR REPLACE FUNCTION validate_payment_token(
  p_token VARCHAR(64),
  p_ip_address VARCHAR(45) DEFAULT NULL
)
RETURNS TABLE(
  is_valid BOOLEAN,
  invoice_id UUID,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token_record RECORD;
BEGIN
  -- Find the token
  SELECT * INTO v_token_record
  FROM invoice_payment_tokens
  WHERE token = p_token;
  
  -- Token doesn't exist
  IF v_token_record IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Invalid payment token';
    RETURN;
  END IF;
  
  -- Token is expired
  IF v_token_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Payment link has expired';
    RETURN;
  END IF;
  
  -- Token is inactive
  IF NOT v_token_record.is_active THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Payment link is no longer active';
    RETURN;
  END IF;
  
  -- Token has been used too many times
  IF v_token_record.use_count >= v_token_record.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Payment link has already been used';
    RETURN;
  END IF;
  
  -- Token is valid - increment use count
  UPDATE invoice_payment_tokens
  SET 
    use_count = use_count + 1,
    used_at = CASE WHEN use_count = 0 THEN NOW() ELSE used_at END,
    used_by_ip = CASE WHEN p_ip_address IS NOT NULL THEN p_ip_address ELSE used_by_ip END
  WHERE token = p_token;
  
  RETURN QUERY SELECT true, v_token_record.invoice_id, 'Valid payment token';
END;
$$;

-- Function to cleanup expired tokens (run periodically via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_payment_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete tokens expired more than 7 days ago
  DELETE FROM invoice_payment_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days'
    AND is_active = false;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$;

-- ============================================================================
-- 4. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION generate_invoice_payment_token(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_payment_token(VARCHAR(64), VARCHAR(45)) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_payment_tokens() TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

