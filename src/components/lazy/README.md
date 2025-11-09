# Lazy-Loaded Components

This directory contains optimized lazy-loaded wrappers for heavy dependencies to improve bundle size and page load performance.

## Components

### PDF Viewer (`pdf-viewer.tsx`)
Lazy-loads `@react-pdf/renderer` components.

**Savings**: ~200KB initial bundle reduction

**Usage**:
```tsx
import { PDFDownloadLink, PDFViewer } from "@/components/lazy/pdf-viewer";

// Use exactly like the original components
<PDFDownloadLink document={<MyDocument />} fileName="invoice.pdf">
  Download PDF
</PDFDownloadLink>
```

### Charts (`chart.tsx`)
Lazy-loads `recharts` chart components.

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

### TipTap Editor (`tiptap-editor.tsx`)
Lazy-loads TipTap editor components.

**Savings**: ~300KB initial bundle reduction

**Usage**:
```tsx
import { LazyTipTapEditor, useEditor } from "@/components/lazy/tiptap-editor";
import StarterKit from "@tiptap/starter-kit";

function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
  });

  return <LazyTipTapEditor editor={editor} />;
}
```

## Benefits

1. **Smaller Initial Bundle**: Heavy dependencies are only loaded when needed
2. **Faster Page Loads**: Reduces JavaScript that needs to be parsed and executed
3. **Better User Experience**: Shows loading skeletons while components load
4. **Code Splitting**: Next.js automatically creates separate chunks for lazy components

## Migration Guide

### Before (Direct Import):
```tsx
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LineChart } from "recharts";
import { EditorContent } from "@tiptap/react";
```

### After (Lazy Import):
```tsx
import { PDFDownloadLink } from "@/components/lazy/pdf-viewer";
import { LazyLineChart } from "@/components/lazy/chart";
import { LazyTipTapEditor } from "@/components/lazy/tiptap-editor";
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
