export const DASHBOARD_HEADERLESS_ROUTES = [
  "/dashboard/tv",
  "/dashboard/welcome",
] as const;

export function shouldRenderHeader(pathname: string) {
  return !DASHBOARD_HEADERLESS_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
}
