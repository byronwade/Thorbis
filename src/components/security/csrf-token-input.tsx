/**
 * CSRF Token Input Component
 *
 * Client component that renders a hidden input field with the CSRF token.
 * Include this in all forms that modify data.
 *
 * Usage:
 * ```tsx
 * <form action={myServerAction}>
 *   <CSRFTokenInput token={csrfToken} />
 *   <input name="data" />
 *   <button type="submit">Save</button>
 * </form>
 * ```
 */

type CSRFTokenInputProps = {
  token: string;
};

export function CSRFTokenInput({ token }: CSRFTokenInputProps) {
  return (
    <input
      type="hidden"
      name="csrf_token"
      value={token}
      aria-hidden="true"
    />
  );
}
