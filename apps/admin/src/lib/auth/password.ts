import { createClient } from "@/lib/supabase/server";

/**
 * Password utilities for admin authentication
 *
 * Uses PostgreSQL's pgcrypto extension for bcrypt hashing
 * This ensures consistency with the password hashes stored in the database
 */

/**
 * Hash a password using bcrypt via PostgreSQL
 */
export async function hashPassword(password: string): Promise<string> {
	const supabase = await createClient();

	const { data, error } = await supabase.rpc("crypt_password", {
		password_text: password,
	});

	if (error) {
		// Fallback: Create the function if it doesn't exist
		await supabase.rpc("exec_sql", {
			sql: `
        CREATE OR REPLACE FUNCTION crypt_password(password_text TEXT)
        RETURNS TEXT AS $$
        BEGIN
          RETURN crypt(password_text, gen_salt('bf', 12));
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
		});

		// Retry
		const { data: retryData, error: retryError } = await supabase.rpc("crypt_password", {
			password_text: password,
		});

		if (retryError) {
			throw new Error(`Failed to hash password: ${retryError.message}`);
		}

		return retryData;
	}

	return data;
}

/**
 * Verify a password against a stored hash using PostgreSQL
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase.rpc("verify_password", {
		password_text: password,
		password_hash: hash,
	});

	if (error) {
		// Fallback: Create the function if it doesn't exist
		await supabase.rpc("exec_sql", {
			sql: `
        CREATE OR REPLACE FUNCTION verify_password(password_text TEXT, password_hash TEXT)
        RETURNS BOOLEAN AS $$
        BEGIN
          RETURN crypt(password_text, password_hash) = password_hash;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
		});

		// Retry
		const { data: retryData, error: retryError } = await supabase.rpc("verify_password", {
			password_text: password,
			password_hash: hash,
		});

		if (retryError) {
			throw new Error(`Failed to verify password: ${retryError.message}`);
		}

		return retryData;
	}

	return data;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters");
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}

	if (!/[0-9]/.test(password)) {
		errors.push("Password must contain at least one number");
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push("Password must contain at least one special character");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
