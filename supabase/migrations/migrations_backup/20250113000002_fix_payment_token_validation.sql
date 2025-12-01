-- ============================================================================
-- FIX PAYMENT TOKEN VALIDATION
-- ============================================================================
-- Migration: 20250113000002_fix_payment_token_validation
-- Description: Allow unlimited page views, only mark as used on actual payment
-- Date: 2025-01-13
-- ============================================================================

-- Drop the old validate function
DROP FUNCTION IF EXISTS validate_payment_token(VARCHAR(64), VARCHAR(45));

-- Create new function to CHECK token without incrementing use count
CREATE OR REPLACE FUNCTION check_payment_token(
  p_token VARCHAR(64)
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
  
  -- Token is expired (allow long expiry - like ServiceTitan)
  IF v_token_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Payment link has expired';
    RETURN;
  END IF;
  
  -- Token is inactive (payment already completed)
  IF NOT v_token_record.is_active THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Invoice has already been paid';
    RETURN;
  END IF;
  
  -- Token is valid - DO NOT increment use_count (just checking)
  RETURN QUERY SELECT true, v_token_record.invoice_id, 'Valid payment token';
END;
$$;

-- Create function to mark token as used (call this AFTER successful payment)
CREATE OR REPLACE FUNCTION mark_payment_token_used(
  p_token VARCHAR(64),
  p_ip_address VARCHAR(45) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark token as inactive (payment completed)
  UPDATE invoice_payment_tokens
  SET 
    use_count = use_count + 1,
    used_at = NOW(),
    used_by_ip = p_ip_address,
    is_active = false  -- Deactivate after payment
  WHERE token = p_token
    AND is_active = true;
  
  RETURN FOUND;
END;
$$;

-- Update generate function to create tokens with very long expiry and unlimited views
DROP FUNCTION IF EXISTS generate_invoice_payment_token(UUID, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION generate_invoice_payment_token(
  p_invoice_id UUID,
  p_expiry_hours INTEGER DEFAULT 87600, -- 10 years default (effectively permanent like ServiceTitan)
  p_max_uses INTEGER DEFAULT 999999 -- Unlimited views
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
  
  -- Insert new token with long expiry
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

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION check_payment_token(VARCHAR(64)) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mark_payment_token_used(VARCHAR(64), VARCHAR(45)) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_invoice_payment_token(UUID, INTEGER, INTEGER) TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

