-- ============================================================================
-- PASSWORD FUNCTIONS FOR ADMIN AUTHENTICATION
-- ============================================================================
-- These functions handle password hashing and verification
-- Run this in the ADMIN Supabase project (iwudmixxoozwskgolqlz)
-- ============================================================================

-- Function to hash a password
CREATE OR REPLACE FUNCTION crypt_password(password_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password_text, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify a password
CREATE OR REPLACE FUNCTION verify_password(password_text TEXT, password_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN crypt(password_text, password_hash) = password_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION crypt_password(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon, authenticated;
