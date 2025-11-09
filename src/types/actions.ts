/**
 * Common action types
 *
 * Shared types for server actions
 */

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
