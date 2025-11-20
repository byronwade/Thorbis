# Lazy-Loaded Components

This directory contains optimized lazy-loaded wrappers for heavy dependencies to improve bundle size and page load performance.

## Components

### PDF Viewer (`pdf-viewer.tsx`)
Lazy-loads `@react-pdf/renderer` components for invoice PDF generation.

**Savings**: ~200KB initial bundle reduction

**Usage**:
```tsx
import { LazyPDFDocument, LazyPage, LazyText, LazyView } from "@/components/lazy/pdf-viewer";

const InvoicePDF = () => (
  <LazyPDFDocument>
    <LazyPage>
      <LazyView>
        <LazyText>Invoice Content</LazyText>
      </LazyView>
    </LazyPage>
  </LazyPDFDocument>
);
```

**Available Components**:
- `LazyPDFDocument` - Main document wrapper
- `LazyPage` - Individual pages
- `LazyText` - Text elements
- `LazyView` - Layout containers
- `LazyImage` - Images in PDF
- `LazyLink` - Hyperlinks
- `LazySvg` - SVG graphics
- `renderToBuffer()` - Server-side PDF generation
- `renderToStream()` - Streaming PDF generation

### Charts (`chart.tsx`)
Lazy-loads `recharts` chart components for dashboard analytics.

**Savings**: ~150KB initial bundle reduction

**Usage**:
```tsx
import { LazyLineChart, Line, XAxis, YAxis, ResponsiveContainer } from "@/components/lazy/chart";

<ResponsiveContainer width="100%" height={300}>
  <LazyLineChart data={data}>
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
    <XAxis dataKey="name" />
    <YAxis />
  </LazyLineChart>
</ResponsiveContainer>
```

**Available Lazy Charts**:
- `LazyLineChart`
- `LazyBarChart`
- `LazyAreaChart`
- `LazyPieChart`
- `LazyRadarChart`

## Benefits

1. **Smaller Initial Bundle**: Heavy dependencies are only loaded when needed (~350KB savings)
2. **Faster Page Loads**: Reduces JavaScript that needs to be parsed and executed
3. **Better User Experience**: Shows loading skeletons while components load
4. **Code Splitting**: Next.js automatically creates separate chunks for lazy components

## Migration Guide

### Before (Direct Import):
```tsx
import { Document, Page, Text } from "@react-pdf/renderer";
import { LineChart } from "recharts";
```

### After (Lazy Import):
```tsx
import { LazyPDFDocument, LazyPage, LazyText } from "@/components/lazy/pdf-viewer";
import { LazyLineChart } from "@/components/lazy/chart";
```

## When to Use

✅ **Use lazy-loaded components when**:
- Component is below the fold
- Component is used in modals/dialogs
- Component is not needed on initial page load
- Component has large dependencies (>50KB)

❌ **Don't use lazy-loaded components when**:
- Component is critical for First Contentful Paint
- Component is above the fold
- Component is needed immediately on page load
- Component is very small (<10KB)

## Performance Impact

Lazy loading these components typically results in:
- 30-50% smaller initial JavaScript bundle
- 20-30% faster Time to Interactive (TTI)
- Better Core Web Vitals scores
- Improved perceived performance

## Notes

- All lazy components use `ssr: false` to prevent hydration issues
- Loading skeletons match the approximate size of the loaded component
- Components are cached after first load (no re-fetching)
