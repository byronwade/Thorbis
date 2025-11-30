# Schedule Page Performance Optimization Plan

## Overview
This plan outlines performance optimizations for the schedule page, focusing on drag-and-drop features, rendering performance, and overall responsiveness while maintaining the current design and layout.

## Performance Issues Identified

### 1. TechnicianLane Memo Comparison Issue (High Impact)
**Location**: `apps/web/src/components/schedule/dispatch-timeline.tsx:1947-1960`
**Issue**: The memo comparison uses `prev.jobs === next.jobs` which checks array reference equality. This causes unnecessary re-renders when the array reference changes but content is identical.
**Impact**: Every time `technicianLanes` is recalculated, all lanes re-render even if job positions haven't changed.
**Solution**: Implement deep comparison or content-based comparison for the jobs array.

### 2. Expensive Calculations in technicianLanes useMemo (High Impact)
**Location**: `apps/web/src/components/schedule/dispatch-timeline.tsx:2389-2438`
**Issue**: Multiple expensive operations in a single useMemo:
- Multiple `.map()` operations
- Date object creation in loops (should use timestamps)
- Overlap detection for every job
- Height calculations
**Impact**: Recalculates all lanes when any dependency changes, even for lanes that haven't changed.
**Solution**: 
- Use timestamps instead of Date objects in calculations
- Memoize individual lane calculations
- Only recalculate lanes that actually changed

### 3. No Virtualization for Technician Lanes (Medium Impact)
**Location**: `apps/web/src/components/schedule/dispatch-timeline.tsx:1963+`
**Issue**: All technician lanes are rendered even when not visible. With many technicians, this creates hundreds of DOM nodes.
**Impact**: Slow initial render, high memory usage, poor scroll performance.
**Solution**: Implement virtual scrolling for technician lanes using `react-window` or custom implementation.

### 4. Hourly Slots Array Creation (Low-Medium Impact)
**Location**: `apps/web/src/components/schedule/dispatch-timeline.tsx:2305-2311`
**Issue**: Creates full array of Date objects even though `hourlySlotData` provides a more efficient structure with `getSlot()` method.
**Impact**: Unnecessary memory allocation and GC pressure for large date ranges.
**Solution**: Use `hourlySlotData.getSlot()` directly instead of creating full array, or lazy-create slots only when needed.

### 5. Travel Gap Calculations (Low Impact)
**Location**: `apps/web/src/components/schedule/dispatch-timeline.tsx:1582-1585`
**Issue**: Travel gaps recalculated on every render when jobs or drag state changes.
**Impact**: Minor performance hit, but could be optimized further.
**Solution**: Memoize travel gap calculations more aggressively, skip during drag.

### 6. Date Object Creation in Loops (Medium Impact)
**Location**: Multiple locations in `dispatch-timeline.tsx`
**Issue**: Creating Date objects in map/filter operations instead of using timestamps.
**Impact**: Unnecessary object allocation and GC pressure.
**Solution**: Use timestamps (numbers) for calculations, only create Date objects when needed for display.

### 7. Drag Preview Throttling (Already Optimized)
**Location**: `apps/web/src/components/schedule/hooks/use-schedule-drag.ts:276-287`
**Status**: Already optimized with 20ms throttling (~50fps). No changes needed.

## Optimization Strategies

### Strategy 1: Improve Memoization and Comparison Functions
- Replace reference equality checks with content-based comparisons
- Use `useMemo` with more granular dependencies
- Implement custom comparison functions for complex objects

### Strategy 2: Virtual Scrolling for Technician Lanes
- Implement virtual scrolling using `react-window` or `@tanstack/react-virtual`
- Only render visible lanes + overscan buffer
- Maintain scroll position and lane heights

### Strategy 3: Optimize Date Handling
- Use timestamps (numbers) for all calculations
- Only create Date objects when needed for display/formatting
- Cache formatted date strings

### Strategy 4: Granular Lane Updates
- Split `technicianLanes` calculation into individual lane calculations
- Only recalculate lanes that have changed jobs
- Use a Map/object to track which lanes need recalculation

### Strategy 5: Lazy Rendering
- Defer rendering of non-visible elements
- Use `IntersectionObserver` for lazy loading
- Implement progressive rendering for large datasets

## Implementation Priority

### Phase 1: High Impact, Low Risk (Do First)
1. Fix TechnicianLane memo comparison (content-based instead of reference)
2. Optimize Date object creation (use timestamps in calculations)
3. Improve technicianLanes useMemo granularity

### Phase 2: High Impact, Medium Risk
4. Implement virtual scrolling for technician lanes
5. Optimize hourly slots array creation

### Phase 3: Medium Impact, Low Risk
6. Further optimize travel gap calculations
7. Add more granular memoization

## Expected Performance Gains

- **Initial Render**: 40-60% faster with virtualization
- **Scroll Performance**: 50-70% improvement with virtual scrolling
- **Drag Performance**: 10-20% improvement with optimized calculations
- **Memory Usage**: 30-50% reduction with virtual scrolling and timestamp optimization
- **Re-render Performance**: 30-40% improvement with better memoization

## Research-Based Best Practices Applied

1. **Virtual Scrolling**: Based on industry best practices for large lists
2. **Timestamp Optimization**: Reduces object allocation and GC pressure
3. **Content-Based Memoization**: Prevents unnecessary re-renders
4. **Granular Updates**: Only update what changed
5. **RAF Throttling**: Already implemented, maintaining 60fps target

## Notes

- All optimizations maintain current design and layout
- No breaking changes to API or component structure
- Backward compatible with existing code
- Can be implemented incrementally

