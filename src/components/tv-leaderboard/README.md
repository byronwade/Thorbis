# TV Leaderboard Widget System

A fully customizable, drag-and-drop widget-based dashboard for displaying technician performance metrics on TV screens.

## Features

- **Full-Screen Mode**: No header, no sidebar - true full-screen TV display
- **ESC to Exit**: Press ESC key anytime to exit and return to dashboard
- **Interactive Reminder**: Any click or keypress shows a sleek reminder to press ESC
- **Drag-and-Drop Interface**: Rearrange widgets by dragging them to new positions
- **Add/Remove Widgets**: Choose from 10 different widget types to customize your dashboard
- **Persistent Layout**: Widget configuration is saved to localStorage
- **No Scrolling**: All content fits within the screen viewport (overflow-hidden)
- **Edit Mode**: Toggle between view mode and edit mode
- **Responsive Grid**: 4-column grid with auto-sizing rows

## Widget Types

### Large Widgets
- **Leaderboard Table** (`leaderboard`): Full technician rankings with all stats
- **Company Goals** (`company-goals`): Progress bars for revenue, ticket, and rating goals
- **Top Performer** (`top-performer`): Highlight the #1 ranked technician
- **Revenue Chart** (`revenue-chart`): Weekly revenue trend visualization

### Medium Widgets
- **Daily Stats** (`daily-stats`): Today's performance summary
- **Weekly Stats** (`weekly-stats`): This week's performance summary
- **Monthly Stats** (`monthly-stats`): This month's performance summary

### Small Widgets
- **Jobs Completed** (`jobs-completed`): Total jobs completed metric
- **Average Ticket** (`avg-ticket`): Average ticket value metric
- **Customer Rating** (`customer-rating`): Average customer rating metric

## Usage

### Viewing the Dashboard

Navigate to `/dashboard/tv-leaderboard` to view the dashboard in presentation mode.

### Editing the Layout

1. Click the "Edit Layout" button in the top-right corner
2. Drag widgets to rearrange them
3. Click the X button on any widget to remove it
4. Click "Add Widget" to add new widgets
5. Click "Save Layout" to persist your changes

### Canceling Changes

Click "Cancel" to discard unsaved changes and revert to the last saved layout.

## File Structure

```
src/components/dashboard/tv-leaderboard/
├── README.md                          # This file
├── widget-types.ts                    # Widget type definitions and configurations
├── widget-renderer.tsx                # Routes widget types to their components
├── draggable-grid.tsx                 # Drag-and-drop grid layout system
├── widget-manager.tsx                 # Widget addition dialog
└── widgets/
    ├── leaderboard-widget.tsx
    ├── company-goals-widget.tsx
    ├── top-performer-widget.tsx
    ├── revenue-chart-widget.tsx
    ├── jobs-completed-widget.tsx
    ├── avg-ticket-widget.tsx
    ├── customer-rating-widget.tsx
    ├── daily-stats-widget.tsx
    ├── weekly-stats-widget.tsx
    └── monthly-stats-widget.tsx
```

## Technical Details

### Dependencies

- `@dnd-kit/core`: Core drag-and-drop functionality
- `@dnd-kit/sortable`: Sortable container and items
- `@dnd-kit/utilities`: CSS transform utilities

### Widget Sizes

Widgets support four size categories:
- `small`: 1 column × 1 row
- `medium`: 2 columns × 1 row
- `large`: 2 columns × 2 rows
- `full`: 4 columns × 2 rows

### Data Flow

The page passes a `widgetData` object to the `DraggableGrid`, which then passes it to each `WidgetRenderer`, which finally passes it to the individual widget components. Each widget extracts only the data it needs.

### Storage

Widget configuration is stored in localStorage under the key `tv-leaderboard-widgets`. The stored data includes:
- Widget ID
- Widget type
- Widget size
- Widget position (order in the array)

## Adding New Widgets

To add a new widget type:

1. **Define the widget type** in `widget-types.ts`:
   ```typescript
   export type WidgetType = "existing-types" | "new-widget";

   export const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
     // ... existing configs
     "new-widget": {
       type: "new-widget",
       title: "New Widget",
       description: "Description of the widget",
       defaultSize: "medium",
       minSize: "small",
       maxSize: "large",
     },
   };
   ```

2. **Create the widget component** in `widgets/new-widget.tsx`:
   ```typescript
   export function NewWidget({ data }: NewWidgetProps) {
     return (
       <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-background/90 to-background/70 p-4 backdrop-blur-sm">
         {/* Widget content */}
       </div>
     );
   }
   ```

3. **Register the widget** in `widget-renderer.tsx`:
   ```typescript
   case "new-widget":
     return <NewWidget data={data} />;
   ```

4. **Add data** for the widget in the page's `widgetData` object

## Styling Guidelines

All widgets should follow these conventions:
- Use `h-full` to fill the grid cell height
- Use `overflow-hidden` to prevent content overflow
- Use `rounded-xl` for consistent border radius
- Use `border border-primary/20` for subtle borders
- Use gradient backgrounds: `bg-gradient-to-br from-background/90 to-background/70`
- Use `backdrop-blur-sm` for glassmorphism effect
- Use consistent padding: `p-4` or `p-6`

## Performance Considerations

- The page uses `fixedHeight: true` in `usePageLayout()` to prevent scrolling
- All widgets are rendered simultaneously (no lazy loading)
- Drag operations use CSS transforms for 60fps performance
- localStorage operations are debounced to prevent excessive writes
