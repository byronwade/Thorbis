# Performance Audit Report

## Executive Summary
(To be filled after audit)

## Findings

### 1. Configuration & Dependencies
- **Next.js Version**: 16.0.1 (Latest)
- **React Version**: 19.2.0 (Latest)
- **Build Tools**:
    - `@next/bundle-analyzer` is installed and configured (`pnpm build:analyze`).
    - `knip`, `depcheck`, and `madge` are available for code analysis.
- **Observations**:
    - The project is using modern versions of core libraries, which is good for performance.
    - Analysis scripts are already in place, indicating a focus on code quality.


### 2. Component Rendering
*Pending analysis...*

### 3. Asset Optimization
- **Images**:
    - `public/hero.png` is **1.3MB**, which is very large. It should be converted to WebP/AVIF and resized.
    - `public/ThorbisLogo.webp` is 72KB, which is reasonable but could be optimized.
    - The project uses `next/image` in configuration, which is good.
- **Fonts**:
    - `next/font` is **NOT** currently used in `layout.tsx`.
    - Fonts appear to be loaded via CSS (`globals.css`) or external links, which can cause layout shifts (CLS) and slower text rendering.
    - **Recommendation**: Switch to `next/font/google` for automatic optimization and zero layout shift.



### 4. Data Fetching & Database
*Pending analysis...*

### 5. Bundle Size
*Pending analysis...*

## Recommendations
(To be filled after audit)
