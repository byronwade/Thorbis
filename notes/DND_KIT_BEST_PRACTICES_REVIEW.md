# DnD-Kit Best Practices Review

## ✅ What We're Doing Well

### 1. **CSS Transform/Translate (Hardware Accelerated)** ✅
- **Schedule Timeline**: Using `CSS.Translate.toString()` for drag transforms
  ```typescript
  transform: CSS.Translate.toString({
    x: transform?.x ?? 0,
    y: transform?.y ?? 0,
  })
  ```
- **Unassigned Panel**: Using `CSS.Transform.toString(transform)`
- **Kanban**: Using `CSS.Transform.toString(transform)`
- **Accordion**: Using `CSS.Transform.toString(transform)`
- **Data Tables**: Using `CSS.Transform.toString(transform)`

✅ **All implementations use hardware-accelerated transforms!**

### 2. **Mobile/Touch Support** ✅
- **Schedule Timeline**: Has `TouchSensor` with proper activation constraints
  ```typescript
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });
  ```
- **Data Tables**: Has `TouchSensor` with delay: 200, tolerance: 5
- **Kanban**: Has `PointerSensor` (works for touch)
- **Accordion**: Has `PointerSensor`

✅ **All components have touch support!**

### 3. **Lazy Loading** ✅
- **Schedule Timeline**: Lazy loaded via `dispatch-timeline-lazy.tsx`
- **Monthly View**: Lazy loaded via `monthly-view-lazy.tsx`
- **Kanban View**: Lazy loaded via `kanban-view-lazy.tsx`
- **Dispatch Map**: Lazy loaded via `dispatch-map-lazy.tsx`

✅ **DnD code is lazy-loaded when needed!**

### 4. **Virtualization** ✅
- **Schedule Timeline**: Uses `@tanstack/react-virtual` for lane virtualization
  ```typescript
  const lanesVirtualizer = useVirtualizer({
    count: technicianLanes.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 200,
    overscan: 3,
  });
  ```

✅ **Large lists are virtualized!**

## ⚠️ Issues Found & Recommendations

### 1. **Missing Keyboard Support** ❌

**Problem**: Schedule timeline doesn't have `KeyboardSensor` for accessibility.

**Current Code**:
```typescript
// apps/web/src/components/schedule/dispatch-timeline.tsx:2309
const sensors = useSensors(mouseSensor, touchSensor);
// ❌ Missing KeyboardSensor!
```

**Fix Required**:
```typescript
const sensors = useSensors(
  mouseSensor,
  touchSensor,
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates, // For sortable lists
  })
);
```

**Affected Files**:
- `apps/web/src/components/schedule/dispatch-timeline.tsx` - Missing KeyboardSensor
- `apps/web/src/components/schedule/monthly-view.tsx` - Missing KeyboardSensor

**Other Components** (Already have keyboard support):
- ✅ `full-width-datatable.tsx` - Has KeyboardSensor
- ✅ `kanban/index.tsx` - Has KeyboardSensor
- ✅ `unified-accordion.tsx` - Has KeyboardSensor

### 2. **DOM Depth & Layout Thrashing** ⚠️

**Schedule Timeline Structure**:
```
DndContext
  └─ div (scroll container)
      └─ div (virtual container)
          └─ div (lane container) - absolute positioned
              └─ TechnicianLane
                  └─ div (jobs container)
                      └─ JobCard (useDraggable)
                          └─ Multiple nested divs (badge, tooltip, popover, etc.)
```

**Issues**:
1. **Deep nesting**: JobCard has many nested divs (badge, tooltip, popover, context menu)
2. **Absolute positioning**: Jobs use `left` and `top` for positioning (not transform)
3. **Many draggable items**: Could have 50+ jobs visible at once

**Recommendations**:
1. **Flatten DOM structure** where possible
2. **Use CSS Grid or Flexbox** for job positioning instead of absolute positioning
3. **Limit visible draggable items** - Consider pagination or more aggressive virtualization
4. **Memoize JobCard** - Already done ✅, but ensure all props are stable

**Current JobCard positioning**:
```typescript
// Using left/top instead of transform for initial position
const style = {
  left: `${left}px`,  // ⚠️ Not hardware accelerated
  top: `${topOffset}px`,  // ⚠️ Not hardware accelerated
  transform: CSS.Translate.toString({  // ✅ Only for drag
    x: transform?.x ?? 0,
    y: transform?.y ?? 0,
  }),
};
```

**Better approach** (if possible):
```typescript
// Use transform for both initial position AND drag
const style = {
  transform: `translate(${left}px, ${topOffset}px) ${CSS.Translate.toString(transform)}`,
};
```

### 3. **Accessibility Attributes** ⚠️

**Current State**:
- ✅ `attributes` and `listeners` are spread on draggable elements
- ❌ Missing explicit `role`, `aria-label`, `tabIndex` for keyboard users
- ❌ No visible focus indicators for keyboard navigation

**Recommendations**:
1. Add `role="button"` or `role="option"` to draggable items
2. Add `aria-label` describing what can be dragged
3. Add `tabIndex={0}` for keyboard focus
4. Add visible focus styles: `focus-visible:ring-2 focus-visible:ring-primary`

**Example Fix**:
```typescript
<div
  ref={setNodeRef}
  style={style}
  {...attributes}
  {...listeners}
  role="button"
  aria-label={`Drag ${job.title} to reschedule`}
  tabIndex={0}
  className="focus-visible:ring-2 focus-visible:ring-primary"
>
```

### 4. **Activation Constraints** ✅

**Current Settings**:
- **Mouse**: 3-5px distance (good - prevents accidental drags)
- **Touch**: 150-200ms delay with 5px tolerance (good - distinguishes from scroll)

✅ **Activation constraints are well configured!**

### 5. **Performance Optimizations** ✅

**Already Implemented**:
- ✅ RequestAnimationFrame throttling in `use-schedule-drag.ts`
- ✅ Memoized components (`memo(JobCard)`)
- ✅ Virtualization for lanes
- ✅ Optimistic updates with throttling
- ✅ RAF-based drag move processing

✅ **Performance optimizations are excellent!**

## 📋 Action Items

### High Priority
1. **Add KeyboardSensor to schedule timeline** - Critical for accessibility
2. **Add KeyboardSensor to monthly view** - Critical for accessibility
3. **Add ARIA attributes** to all draggable items (role, aria-label, tabIndex)

### Medium Priority
4. **Review DOM depth** in JobCard - Consider flattening structure
5. **Add focus indicators** for keyboard navigation
6. **Consider CSS Grid** for job positioning instead of absolute positioning

### Low Priority
7. **Document keyboard shortcuts** for drag operations
8. **Add screen reader announcements** for drag operations

## 🎯 Implementation Priority

1. **Accessibility (Keyboard Support)** - Must fix
2. **ARIA Attributes** - Should fix
3. **DOM Optimization** - Nice to have (if performance issues arise)

## 📝 Code Examples

### Fix 1: Add Keyboard Support to Schedule Timeline

```typescript
// apps/web/src/components/schedule/dispatch-timeline.tsx
import { KeyboardSensor } from "@dnd-kit/core";

// Around line 2309
const sensors = useSensors(
  mouseSensor,
  touchSensor,
  useSensor(KeyboardSensor, {
    // For horizontal timeline, we might need custom coordinate getter
    coordinateGetter: (event, { context }) => {
      // Custom logic for timeline keyboard navigation
      // Arrow keys: left/right for time, up/down for technician
      return { x: 0, y: 0 }; // Placeholder
    },
  })
);
```

### Fix 2: Add ARIA Attributes to JobCard

```typescript
// In JobCard component around line 1138
<div
  ref={setNodeRef}
  style={style}
  {...attributes}
  {...listeners}
  role="button"
  aria-label={`Job: ${job.title}. Drag to reschedule. Currently scheduled for ${format(startTime, "h:mm a")}`}
  tabIndex={0}
  className={cn(
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
    // ... existing classes
  )}
>
```

### Fix 3: Improve DOM Structure (Future Optimization)

```typescript
// Consider using CSS Grid for job positioning
// Instead of absolute positioning with left/top
<div className="grid" style={{ gridTemplateColumns: `repeat(${hours}, 1fr)` }}>
  {jobs.map(job => (
    <JobCard
      style={{
        gridColumn: `${startColumn} / ${endColumn}`,
        transform: CSS.Translate.toString(transform), // Only for drag
      }}
    />
  ))}
</div>
```

## ✅ Summary

**Overall Assessment**: Your DnD implementation is **very good**! You're following most best practices:
- ✅ Hardware-accelerated transforms
- ✅ Touch support
- ✅ Lazy loading
- ✅ Virtualization
- ✅ Performance optimizations

**Main Gap**: Missing keyboard accessibility support in schedule components.

**Priority Fix**: Add `KeyboardSensor` to schedule timeline and monthly view for full accessibility compliance.

