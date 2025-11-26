# Mobile Optimization Guide

## Overview

Thorbis is fully optimized for native iOS and Android experiences with touch-friendly interactions, proper safe areas, momentum scrolling, and platform-specific optimizations.

## Core Features

### 1. Viewport Configuration

**File**: `src/app/layout.tsx`

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",  // Respects safe areas on notched devices
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};
```

**Features**:
- ✅ Proper viewport scaling
- ✅ Theme color adapts to light/dark mode
- ✅ Safe area support for notched devices (iPhone X+)
- ✅ User can zoom (accessibility)

### 2. iOS-Specific Optimizations

**PWA Support**:
```typescript
appleWebApp: {
  capable: true,
  statusBarStyle: "black-translucent",
  title: "Thorbis",
  startupImage: [/* Device-specific splash screens */]
}
```

**CSS Optimizations** (`src/app/globals.css`):
```css
@supports (-webkit-touch-callout: none) {
  html {
    /* Prevent text selection on long press */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    
    /* Smooth momentum scrolling */
    -webkit-overflow-scrolling: touch;
    
    /* Safe area insets for notched devices */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  
  body {
    /* Prevent rubber band scrolling */
    overscroll-behavior-y: none;
  }
}
```

### 3. Android-Specific Optimizations

```css
@supports (-webkit-appearance: none) {
  html {
    /* Smooth scrolling on Android */
    scroll-behavior: smooth;
  }
}
```

### 4. Touch-Friendly Interactions

**Active State Feedback**:
```css
@media (hover: none) and (pointer: coarse) {
  button:active,
  a:active,
  [role="button"]:active {
    opacity: 0.7;
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
}
```

**Features**:
- ✅ Visual feedback on touch
- ✅ No hover effects on touch devices
- ✅ Native-feeling scale animation
- ✅ Prevents accidental triggers

## Utility Classes

### Touch Targets

```css
/* Minimum 44x44px touch target (iOS HIG) */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Recommended 48x48px touch target (Material Design) */
.touch-target-md {
  min-height: 48px;
  min-width: 48px;
}
```

### Momentum Scrolling

```css
.momentum-scroll {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}
```

### Pull-to-Refresh Prevention

```css
.no-pull-refresh {
  overscroll-behavior-y: none;
}
```

### Safe Area Utilities

```css
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-left { padding-left: env(safe-area-inset-left); }
.safe-right { padding-right: env(safe-area-inset-right); }
```

### UI Element Helpers

```css
/* Disable text selection */
.no-select {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* Native transition timing */
.native-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Touch feedback (light, medium, heavy) */
.haptic-light:active { transform: scale(0.99); }
.haptic-medium:active { transform: scale(0.97); }
.haptic-heavy:active { transform: scale(0.95); }
```

## Component Optimizations

### 1. App Header (`app-header-client.tsx`)

**Mobile Menu Button**:
```tsx
<button
  className="touch-target no-select native-transition hover-gradient flex items-center justify-center rounded-md border border-transparent outline-none hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 lg:hidden"
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  type="button"
>
```

**Features**:
- ✅ 44x44px touch target
- ✅ No text selection
- ✅ Smooth animations
- ✅ Active state feedback
- ✅ Safe area support

**Mobile Navigation Sheet**:
```tsx
<div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background shadow-2xl duration-300 safe-top safe-bottom safe-left lg:hidden">
  <div className="momentum-scroll flex-1 overflow-y-auto">
    {/* Navigation items */}
  </div>
</div>
```

**Features**:
- ✅ Respects safe areas
- ✅ Momentum scrolling
- ✅ Smooth slide animations
- ✅ Touch-optimized spacing

### 2. Data Tables (`full-width-datatable.tsx`)

**Toolbar Optimizations**:
```tsx
<div className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b bg-muted/30 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-6 sm:py-4">
```

**Features**:
- ✅ Responsive padding (4 on mobile, 6 on desktop)
- ✅ Responsive gaps (3 on mobile, 4 on desktop)
- ✅ Wraps on small screens
- ✅ Touch-friendly buttons

**Table Rows**:
```tsx
<div className="group native-transition flex cursor-pointer items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50 active:bg-muted/70 sm:gap-6 sm:px-6 sm:py-3.5">
```

**Features**:
- ✅ Larger padding on mobile (16px vs 14px)
- ✅ Active state feedback
- ✅ Smooth transitions
- ✅ Touch-optimized checkboxes

**Column Visibility**:
```typescript
{
  key: "status",
  header: "Status",
  render: (item) => <StatusBadge status={item.status} />,
  hideOnMobile: true,  // Hide less critical columns on mobile
}
```

## Responsive Breakpoints

### Tailwind Breakpoints (Default)

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Strategy

Always start with mobile styles, then add larger breakpoint overrides:

```tsx
// ✅ GOOD: Mobile first
<div className="px-4 sm:px-6 lg:px-8">

// ❌ BAD: Desktop first
<div className="px-8 lg:px-6 sm:px-4">
```

## Touch Target Guidelines

### iOS Human Interface Guidelines

| Element Type | Minimum Size | Recommended |
|--------------|-------------|-------------|
| Buttons | 44x44px | 48x48px |
| Icons | 44x44px | 48x48px |
| List items | 44px height | 48px height |
| Form inputs | 44px height | 48px height |

### Material Design (Android)

| Element Type | Minimum Size | Recommended |
|--------------|-------------|-------------|
| Buttons | 48x48dp | 48x48dp |
| Icons | 48x48dp | 48x48dp |
| List items | 48dp height | 56dp height |
| Form inputs | 48dp height | 56dp height |

## Testing Checklist

### iOS Testing

- [ ] Test on iPhone SE (smallest screen)
- [ ] Test on iPhone 14 Pro (notch)
- [ ] Test on iPhone 14 Pro Max (large screen)
- [ ] Test on iPad
- [ ] Verify safe areas on all devices
- [ ] Test momentum scrolling
- [ ] Test pull-to-refresh behavior
- [ ] Verify PWA installation
- [ ] Test landscape orientation
- [ ] Test with VoiceOver (accessibility)

### Android Testing

- [ ] Test on small Android phone (< 5.5")
- [ ] Test on large Android phone (> 6.5")
- [ ] Test on Android tablet
- [ ] Test on foldable device
- [ ] Verify smooth scrolling
- [ ] Test navigation gestures
- [ ] Test PWA installation
- [ ] Test landscape orientation
- [ ] Test with TalkBack (accessibility)

### Cross-Platform

- [ ] Test touch targets (44px minimum)
- [ ] Test all buttons and links
- [ ] Test form inputs and dropdowns
- [ ] Test data table interactions
- [ ] Test modal/dialog interactions
- [ ] Test navigation (header, sidebar)
- [ ] Test keyboard navigation (external keyboard)
- [ ] Test with screen reader
- [ ] Test dark mode
- [ ] Test offline functionality (PWA)

## Performance Optimizations

### Image Optimization

Always use Next.js Image component:
```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}  // true for above-fold images
  placeholder="blur"  // smooth loading
/>
```

### Code Splitting

Use dynamic imports for heavy components:
```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/heavy-chart"), {
  loading: () => <Skeleton />,
  ssr: false,  // Client-only if needed
});
```

### Bundle Size Targets

- **Mobile 3G**: < 200KB initial bundle
- **Mobile 4G**: < 300KB initial bundle
- **Total**: < 1MB with all chunks

## Accessibility

### Touch Accessibility

- ✅ All interactive elements have 44x44px minimum touch target
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus indicators visible
- ✅ Screen reader labels on all interactive elements
- ✅ Keyboard navigation support

### Voice Control

```tsx
// ✅ GOOD: Semantic HTML
<button onClick={handleClick}>Submit</button>

// ❌ BAD: Non-semantic
<div onClick={handleClick}>Submit</div>
```

## PWA Configuration

### Manifest (`public/manifest.json`)

```json
{
  "name": "Thorbis",
  "short_name": "Thorbis",
  "description": "Modern Business Management Platform",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (Future)

```typescript
// Register service worker for offline support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

## Common Patterns

### Modal/Dialog on Mobile

```tsx
<Dialog>
  <DialogContent className="safe-bottom max-h-[90vh] w-[95vw] max-w-md">
    <div className="momentum-scroll max-h-[70vh] overflow-y-auto">
      {/* Content */}
    </div>
  </DialogContent>
</Dialog>
```

### Bottom Sheet (Mobile Alternative)

```tsx
<Sheet>
  <SheetContent side="bottom" className="safe-bottom">
    <div className="momentum-scroll max-h-[80vh] overflow-y-auto">
      {/* Content */}
    </div>
  </SheetContent>
</Sheet>
```

### Floating Action Button (FAB)

```tsx
<button className="touch-target-md fixed bottom-6 right-6 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 safe-bottom safe-right">
  <Plus className="size-6" />
</button>
```

## Best Practices

### Do's ✅

1. **Always test on real devices**, not just browser dev tools
2. **Use touch targets of 44x44px minimum**
3. **Provide visual feedback on touch** (active states)
4. **Respect safe areas** on notched devices
5. **Use momentum scrolling** for lists and content
6. **Hide non-critical information** on small screens
7. **Stack layouts vertically** on mobile
8. **Use larger padding and spacing** on mobile
9. **Optimize images** for mobile bandwidth
10. **Test with slow 3G connection**

### Don'ts ❌

1. **Don't rely on hover states** for mobile
2. **Don't use fixed positioning** without safe areas
3. **Don't make touch targets smaller than 44px**
4. **Don't use tiny text** (minimum 16px for readability)
5. **Don't ignore landscape orientation**
6. **Don't prevent zooming** (accessibility issue)
7. **Don't use horizontal scrolling** (anti-pattern)
8. **Don't show too much information** at once
9. **Don't use complex gestures** (swipe, pinch, etc.)
10. **Don't forget offline states** for PWA

## Resources

### Documentation
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design (Android)](https://m3.material.io/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

### Testing Tools
- [Chrome DevTools Mobile Emulation](https://developer.chrome.com/docs/devtools/device-mode/)
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [LambdaTest](https://www.lambdatest.com/) - Cross-browser testing
- [WebPageTest](https://www.webpagetest.org/) - Performance testing

### Performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance metrics
- [Web Vitals](https://web.dev/vitals/) - Core metrics

## Support

For mobile-specific issues, check:
1. Safe area insets are applied
2. Touch targets meet minimum size
3. Momentum scrolling is enabled
4. Viewport is correctly configured
5. Meta tags are present
6. PWA manifest is valid

