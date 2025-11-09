/**
 * Lazy-loaded PDF Viewer Component
 *
 * Performance optimization:
 * - Dynamically imports @react-pdf/renderer only when needed
 * - Reduces initial bundle size by ~200KB
 * - Shows loading skeleton while component loads
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-32" />
      </div>
    ),
  }
);

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  }
);

export { PDFDownloadLink, PDFViewer };
