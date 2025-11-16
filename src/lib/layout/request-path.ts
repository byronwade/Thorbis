import { headers } from "next/headers";

const DASHBOARD_PREFIX = "/dashboard";
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;
const INTERNAL_PATH_HEADERS = [
  "x-invoke-path",
  "x-matched-path",
  "x-middleware-request-url",
  "next-url", // Next.js sets this to the current request URL
];
const CUSTOM_PATH_HEADERS = [
  "x-dashboard-pathname",
  "x-original-url",
  "x-rewrite-url",
  "x-original-uri",
];

function sanitizePathCandidate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  let candidate = value.trim();
  if (!candidate) {
    return null;
  }

  if (ABSOLUTE_URL_REGEX.test(candidate)) {
    try {
      candidate = new URL(candidate).pathname || "";
    } catch {
      return null;
    }
  }

  if (!candidate.startsWith("/")) {
    candidate = `/${candidate.replace(/^\/?/, "")}`;
  }

  const pathOnly = candidate.split(/[?#]/)[0] || candidate;

  if (
    !pathOnly.startsWith("/") ||
    pathOnly.includes("[") ||
    pathOnly.includes("]")
  ) {
    return null;
  }

  return pathOnly.startsWith(DASHBOARD_PREFIX) ? pathOnly : null;
}

/**
 * Resolves the current dashboard pathname on the server.
 * Falls back to /dashboard when we cannot read route headers (e.g. tests).
 */
export async function getRequestPathname(defaultPath = DASHBOARD_PREFIX) {
  try {
    const headerList = await headers();

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[getRequestPathname] headers",
        INTERNAL_PATH_HEADERS.concat(CUSTOM_PATH_HEADERS).reduce<
          Record<string, string | null>
        >((acc, key) => {
          acc[key] = headerList.get(key);
          return acc;
        }, {})
      );
    }

    for (const headerName of INTERNAL_PATH_HEADERS) {
      const candidate = sanitizePathCandidate(headerList.get(headerName));
      if (candidate) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "[getRequestPathname] match",
            headerName,
            "=>",
            candidate
          );
        }
        return candidate;
      }
    }

    for (const headerName of CUSTOM_PATH_HEADERS) {
      const candidate = sanitizePathCandidate(headerList.get(headerName));
      if (candidate) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "[getRequestPathname] match",
            headerName,
            "=>",
            candidate
          );
        }
        return candidate;
      }
    }

    // Cookie and referer are REMOVED - they show stale/previous paths, not current
    // We rely only on Next.js headers which are always accurate
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[getRequestPathname] Error accessing headers/cookies:",
        error
      );
    }
    // Ignore header access errors and fall back to default dashboard route
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[getRequestPathname] fallback to default =>", defaultPath);
  }
  return defaultPath;
}
