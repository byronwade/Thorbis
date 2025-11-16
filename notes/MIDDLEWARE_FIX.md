# Middleware Build Error Fix

## Overview
Fixed Next.js build error caused by using a variable in the middleware `matcher` configuration instead of a static string literal.

---

## Error

```
Next.js can't recognize the exported `config` field in route. 
Entry `matcher[0]` need to be static strings or static objects.

./middleware.ts:22:14
> 22 | export const config = {
     |              ^^^^^^
  23 |   matcher: [DASHBOARD_MATCHER],
```

---

## Problem

Next.js middleware configuration requires the `matcher` property to be **statically analyzable at compile time**. This means:

❌ **Cannot use variables:**
```typescript
const DASHBOARD_MATCHER = "/dashboard/:path*";

export const config = {
  matcher: [DASHBOARD_MATCHER], // ERROR: Variable not allowed
};
```

✅ **Must use static literals:**
```typescript
export const config = {
  matcher: ["/dashboard/:path*"], // OK: Static string literal
};
```

---

## Solution

### Before (❌ Error):
```typescript
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_MATCHER = "/dashboard/:path*";
const HEADER_NAME = "x-dashboard-pathname";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_NAME, request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [DASHBOARD_MATCHER], // ❌ Variable not allowed
};
```

### After (✅ Fixed):
```typescript
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const HEADER_NAME = "x-dashboard-pathname";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_NAME, request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"], // ✅ Static string literal
};
```

---

## Changes Made

### 1. **Removed Variable** ✅
```diff
- const DASHBOARD_MATCHER = "/dashboard/:path*";
```

### 2. **Used Static String** ✅
```diff
  export const config = {
-   matcher: [DASHBOARD_MATCHER],
+   matcher: ["/dashboard/:path*"],
  };
```

### 3. **Kept Header Constant** ✅
```typescript
const HEADER_NAME = "x-dashboard-pathname"; // Still OK - used in function, not config
```

---

## Why This Happens

Next.js needs to statically analyze the middleware configuration at **build time** to:

1. **Optimize routing** - Pre-compute which routes need middleware
2. **Generate edge runtime** - Bundle only necessary code
3. **Improve performance** - Avoid runtime overhead

**Static analysis** means the compiler must be able to determine the value **without executing any code**.

### What's Allowed:

✅ **String literals:**
```typescript
matcher: ["/dashboard/:path*"]
```

✅ **Array literals:**
```typescript
matcher: ["/dashboard/:path*", "/api/:path*"]
```

✅ **Object literals:**
```typescript
matcher: [
  { source: "/dashboard/:path*" },
  { source: "/api/:path*" }
]
```

### What's NOT Allowed:

❌ **Variables:**
```typescript
const path = "/dashboard/:path*";
matcher: [path]
```

❌ **Functions:**
```typescript
function getPath() { return "/dashboard/:path*"; }
matcher: [getPath()]
```

❌ **Template literals with variables:**
```typescript
const base = "/dashboard";
matcher: [`${base}/:path*`]
```

❌ **Computed values:**
```typescript
matcher: [process.env.MATCHER_PATH]
```

---

## Additional Fix

Also removed duplicate code at the end of `src/app/call-window/page.tsx` that was causing syntax errors.

### Before (❌ Duplicate):
```typescript
export default function CallWindowPage() {
  return (
    <Suspense fallback={...}>
      <CallWindowContent />
    </Suspense>
  );
}

// Duplicate code below (accidentally added)
        </div>
      }
    >
      <CallWindowContent />
    </Suspense>
  );
}
```

### After (✅ Clean):
```typescript
export default function CallWindowPage() {
  return (
    <Suspense fallback={...}>
      <CallWindowContent />
    </Suspense>
  );
}
```

---

## Matcher Syntax

The `matcher` property supports Next.js path matching syntax:

### Basic Paths:
```typescript
matcher: ["/about"]           // Exact match
matcher: ["/about/:path*"]    // Wildcard (any path after /about)
matcher: ["/about/:path+"]    // One or more segments
```

### Multiple Paths:
```typescript
matcher: [
  "/dashboard/:path*",
  "/api/:path*",
  "/admin/:path*"
]
```

### With Options:
```typescript
matcher: [
  {
    source: "/dashboard/:path*",
    has: [
      { type: "header", key: "x-authorized" }
    ]
  }
]
```

### Excluding Paths:
```typescript
matcher: [
  "/((?!api|_next/static|_next/image|favicon.ico).*)"
]
```

---

## Best Practices

### 1. **Use Static Strings** ✅
```typescript
export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### 2. **Document Complex Patterns** ✅
```typescript
export const config = {
  // Match all dashboard routes except API and static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
```

### 3. **Keep Logic in Function** ✅
```typescript
export function middleware(request: NextRequest) {
  // Runtime logic here - can use variables, functions, etc.
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  
  if (isDashboard) {
    // Handle dashboard routes
  }
  
  return NextResponse.next();
}

export const config = {
  // Static configuration here - no variables
  matcher: ["/dashboard/:path*"],
};
```

---

## Related Documentation

- [Next.js Middleware Configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Middleware Matcher](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
- [Path Matching](https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl)

---

## Status

✅ **Middleware matcher uses static string**  
✅ **Removed duplicate code**  
✅ **No linter errors**  
✅ **Build should succeed**  

Build error fixed! 🎉

