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
// Import lazy chart wrappers from our component
import { LazyLineChart, LazyResponsiveContainer } from "@/components/lazy/chart";
// Import supporting components DIRECTLY from recharts (for proper tree-shaking)
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

<LazyResponsiveContainer width="100%" height={300}>
  <LazyLineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LazyLineChart>
</LazyResponsiveContainer>
```

**IMPORTANT**: Only import the lazy chart wrappers (LazyLineChart, etc.) from this file.
Import supporting components (Line, Area, XAxis, YAxis, etc.) directly from `recharts`.
This ensures proper code-splitting - the recharts supporting components are bundled
with your component, not in the main bundle.

**Available Lazy Charts**:
- `LazyLineChart`
- `LazyBarChart`
- `LazyAreaChart`
- `LazyPieChart`
- `LazyRadarChart`
- `LazyResponsiveContainer`

## Benefits

1. **Smaller Initial Bundle**: Heavy dependencies are only loaded when needed (~350KB savings)
2. **Faster Page Loads**: Reduces JavaScript that needs to be parsed and executed
3. **Better User Experience**: Shows loading skeletons while components load
4. **Code Splitting**: Next.js automatically creates separate chunks for lazy components

## Migration Guide

### Before (Direct Import):
```tsx
import { Document, Page, Text } from "@react-pdf/renderer";
import { LineChart, Line, XAxis, YAxis } from "recharts";
```

### After (Lazy Import):
```tsx
// PDF components - import all from lazy file
import { LazyPDFDocument, LazyPage, LazyText } from "@/components/lazy/pdf-viewer";

// Chart components - split imports for proper code-splitting
import { LazyLineChart } from "@/components/lazy/chart";
import { Line, XAxis, YAxis } from "recharts"; // Supporting components from recharts
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
