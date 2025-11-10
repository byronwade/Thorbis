# Work Section Dual Views

## Overview

- All work list pages now support both table and Kanban views.
- View preference is stored per module (`jobs`, `estimates`, `invoices`, `contracts`, `maintenancePlans`, `materials`, `purchaseOrders`, `serviceAgreements`, `equipment`).
- The toggle is available in each page header and persists with `zustand` storage (`useWorkViewStore`).

## Usage

- Choose **Table** for dense data entry and bulk actions.
- Choose **Kanban** for drag-and-drop workflow updates.
- Kanban boards use `@dnd-kit` with optimistic updates where applicable (jobs trigger `updateJobStatus` server action).
- Column definitions map to existing status fields; moving a card updates its status and recalculates stats.
- Kanban columns include sticky headers, scrollable card stacks, and inline metrics (counts, totals) to make the workflow feel deliberate and easy to scan.

## Implementation Notes

- Shared primitives live in `src/components/ui/shadcn-io/kanban`.
- `WorkDataView` selects the correct child view, reducing duplicate conditional logic.
- `WorkViewSwitcher` binds to the shared store to keep toggles consistent across pages.
- Cards surface richer metadata (icons for schedule, location, assignee, quick “View” links) while maintaining accessible text sizes and contrast.

## Manual Test Checklist

- [ ] Toggle between table and Kanban on each work list page; preference persists after navigation.
- [ ] Drag jobs between columns updates status and triggers toast on success.
- [ ] Drag items within other Kanban boards reorders cards and updates status badges.
- [ ] Tables continue to support search, filters, and bulk actions after toggle.
- [ ] Column headers stay sticky and card lists scroll independently without layout jump.
- [ ] Card quick links open the correct resource in a new view.

