# Widget-Based Job Details System - Complete Guide

## 🎯 Overview

The Widget-Based Job Details System provides a **flexible, customizable, and industry-specific** approach to displaying job information. Contractors can drag-and-drop widgets, resize them, and save custom layouts optimized for their specific trade.

## 🏗️ Architecture

### Core Components

```
src/
├── lib/
│   ├── services/
│   │   └── property-enrichment.ts     # Property data enrichment service
│   ├── stores/
│   │   └── job-details-layout-store.ts # Zustand state management
│   └── presets/
│       └── job-layout-presets.ts       # Industry-specific presets
├── components/
│   └── work/
│       └── job-details/
│           ├── widget-grid.tsx          # Drag-and-drop grid
│           ├── widget-container.tsx     # Widget wrapper
│           ├── widget-renderer.tsx      # Widget type mapper
│           ├── layout-customizer.tsx    # Customization UI
│           └── widgets/
│               ├── property-intelligence-widget.tsx
│               ├── job-financials-widget.tsx
│               ├── job-details-widget.tsx
│               ├── customer-info-widget.tsx
│               ├── invoices-widget.tsx
│               ├── estimates-widget.tsx
│               ├── job-costing-widget.tsx
│               ├── photo-gallery-widget.tsx
│               ├── documents-widget.tsx
│               └── communications-widget.tsx
└── app/
    └── (dashboard)/
        └── dashboard/
            └── work/
                └── [id]/
                    ├── page.tsx          # Original page
                    └── page-new.tsx      # New widget-based page
```

### Technology Stack

- **State Management**: Zustand (with persistence)
- **Drag-and-Drop**: @dnd-kit
- **UI Components**: shadcn/ui
- **Property Data**: External APIs (Attom, CoreLogic, Zillow)
- **Architecture**: Server Components + Client Components (hybrid)

## 📦 Installation

### 1. Dependencies Already Installed

```bash
# These are already installed in your project
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
@dnd-kit/modifiers
```

### 2. Environment Variables (Optional)

To enable property enrichment, add these to your `.env.local`:

```bash
# Property Data APIs
ATTOM_API_KEY=your_attom_api_key_here
CORELOGIC_API_KEY=your_corelogic_api_key_here
ZILLOW_API_KEY=your_zillow_api_key_here
```

**Sign up for property data APIs:**
- [Attom Data Solutions](https://api.developer.attomdata.com/) - Most comprehensive
- [CoreLogic](https://www.corelogic.com/products/api-hub/) - Enterprise-grade
- [Zillow API](https://www.zillow.com/howto/api/APIOverview.htm) - Basic property data

## 🎨 Available Widgets

### Core Widgets (35+ Total)

#### **Core Information**
- `job-header` - Job number, title, status, priority
- `job-timeline` - Visual process timeline
- `job-financials` - Financial summary
- `job-details` - Detailed job information

#### **Property & Customer**
- `property-details` - Basic property information
- `property-enrichment` ⭐ - **Enriched property intelligence**
- `customer-info` - Customer contact details
- `location-map` - Interactive map

#### **Financial**
- `invoices` - Invoice tracking
- `estimates` - Estimate management
- `job-costing` - Cost breakdown
- `profitability` - Profit analysis
- `payment-tracker` - Payment progress

#### **Project Management**
- `schedule` - Job schedule
- `team-assignments` - Assigned crew
- `materials-list` - Materials tracking
- `equipment-list` - Equipment needs
- `purchase-orders` - PO management

#### **Documentation**
- `photos` - Photo gallery
- `documents` - File management
- `permits` - Permit tracking
- `communications` - Messages/emails
- `activity-log` - Activity timeline

#### **Industry-Specific**
- `hvac-equipment` - HVAC units and specs
- `plumbing-fixtures` - Plumbing fixtures
- `electrical-panels` - Electrical panels
- `roofing-materials` - Roofing materials
- `landscape-zones` - Landscape zones

#### **Analytics**
- `time-tracking` - Labor hours
- `labor-hours` - Detailed labor breakdown
- `material-costs` - Material cost analysis
- `change-orders` - Scope changes

## 🔧 Usage

### Basic Implementation

```typescript
import { WidgetGrid } from "@/components/work/job-details/widget-grid";
import { LayoutCustomizer } from "@/components/work/job-details/layout-customizer";

export default async function JobDetailsPage({ params }) {
  const { id } = await params;

  // Fetch job data
  const job = await getJob(id);
  const property = await getProperty(job.propertyId);
  const customer = await getCustomer(job.customerId);

  // Enrich property data
  const propertyEnrichment = await propertyEnrichmentService.enrichProperty(
    property.address,
    property.city,
    property.state,
    property.zipCode
  );

  return (
    <div>
      {/* Customization Controls */}
      <LayoutCustomizer />

      {/* Widget Grid */}
      <WidgetGrid
        job={job}
        property={property}
        customer={customer}
        propertyEnrichment={propertyEnrichment}
      />
    </div>
  );
}
```

### Custom Widget Creation

Create a new widget component:

```typescript
// src/components/work/job-details/widgets/my-custom-widget.tsx
export function MyCustomWidget({ job, customData }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm">My Custom Widget</h4>
      {/* Your widget content */}
    </div>
  );
}
```

Add it to the widget metadata:

```typescript
// src/lib/stores/job-details-layout-store.ts
export const WIDGET_METADATA = {
  // ... existing widgets
  "my-custom-widget": {
    title: "My Custom Widget",
    description: "Description of what this widget does",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 4 },
    category: "custom",
    industries: ["all"],
  },
};
```

Register it in the renderer:

```typescript
// src/components/work/job-details/widget-renderer.tsx
import { MyCustomWidget } from "./widgets/my-custom-widget";

export function WidgetRenderer({ widget, ...props }) {
  switch (widget.type) {
    // ... existing cases
    case "my-custom-widget":
      return <MyCustomWidget {...props} />;
    // ...
  }
}
```

## 🏭 Industry Presets

### Available Presets

1. **HVAC Contractor**
   - Focus: Equipment specs, system sizing, property details
   - Widgets: HVAC Equipment, Property Intelligence, Financial Summary

2. **Plumbing Contractor**
   - Focus: Fixtures, permits, property details
   - Widgets: Plumbing Fixtures, Permits, Materials List

3. **Electrical Contractor**
   - Focus: Panels, circuits, code compliance
   - Widgets: Electrical Panels, Permits, Property Details

4. **Roofing Contractor**
   - Focus: Materials, weather, photos
   - Widgets: Roofing Materials, Photo Gallery, Property Intelligence

5. **Landscaping Contractor**
   - Focus: Zones, materials, location
   - Widgets: Landscape Zones, Location Map, Materials

6. **General Contractor**
   - Focus: Comprehensive overview
   - Widgets: All key widgets

7. **Remodeling Contractor**
   - Focus: Before/after photos, change orders
   - Widgets: Photo Gallery, Change Orders, Job Costing

8. **Commercial Construction**
   - Focus: Complex project management
   - Widgets: Schedule, Teams, Purchase Orders, Permits

### Loading a Preset

```typescript
import { useJobDetailsLayoutStore } from "@/lib/stores/job-details-layout-store";
import { hvacPreset } from "@/lib/presets/job-layout-presets";

function MyComponent() {
  const loadPreset = useJobDetailsLayoutStore((state) => state.loadPreset);

  // Load HVAC preset
  loadPreset(hvacPreset);
}
```

## 🔍 Property Enrichment

### What is Property Enrichment?

Property enrichment automatically fetches additional property data from external APIs:

- **Property Details**: Square footage, lot size, year built, bedrooms/bathrooms
- **Ownership**: Owner name, sale history, sale prices
- **Valuation**: Assessed value, market value, tax amounts
- **Permits**: Historical permit records
- **Utilities**: Electric, gas, water, sewer providers
- **Risk Factors**: Flood zones, earthquake zones, fire zones

### How It Works

```typescript
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";

// Enrich property data
const enrichment = await propertyEnrichmentService.enrichProperty(
  "123 Main Street",
  "San Francisco",
  "CA",
  "94102"
);

// Use enriched data
console.log(enrichment.details.squareFootage);
console.log(enrichment.ownership.lastSalePrice);
console.log(enrichment.permits); // Historical permits
```

### API Providers

**Attom Data Solutions** (Recommended)
- Most comprehensive property data
- Nationwide coverage
- Permit history included
- Sign up: https://api.developer.attomdata.com/

**CoreLogic** (Enterprise)
- High-quality data
- Requires enterprise account
- Best for large contractors

**Zillow API** (Deprecated)
- Basic property valuations
- Limited data
- API is being phased out

## 🎛️ User Customization

### Edit Mode

Users can enable "Edit Mode" to:
- Drag-and-drop widgets to reposition
- Remove unwanted widgets
- Collapse/expand widgets
- Resize widgets (upcoming feature)

### Saving Layouts

Layouts are automatically saved to localStorage and persist across sessions.

```typescript
// Layouts are saved automatically by Zustand persist middleware
// Saved to: localStorage['job-details-layout-storage']
```

### Resetting Layout

Users can reset to default layout at any time:

```typescript
const resetToDefault = useJobDetailsLayoutStore((state) => state.resetToDefault);
resetToDefault();
```

## 🚀 Performance Considerations

### Server Components

The widget system uses a hybrid approach:
- **Server Components**: Widget renderer, individual widgets (when possible)
- **Client Components**: Drag-and-drop grid, layout customizer

### Optimization Tips

1. **Lazy Load Widgets**: Only load widgets that are visible
2. **Cache Property Data**: Property enrichment is cached for 7 days
3. **Shallow Selectors**: Use Zustand selectors to prevent unnecessary re-renders

```typescript
// ❌ Bad - subscribes to entire store
const store = useJobDetailsLayoutStore();

// ✅ Good - only subscribes to widgets
const widgets = useJobDetailsLayoutStore((state) => state.widgets);
```

## 📱 Responsive Design

The widget grid automatically adjusts:
- **Desktop**: 4-column grid
- **Tablet**: 2-column grid (automatic)
- **Mobile**: 1-column grid (automatic)

Widgets can span multiple columns:
```typescript
size: { width: 2, height: 2 } // Spans 2 columns, 2 rows
```

## 🔐 Security

### Property Data APIs

- Store API keys in environment variables
- Never expose keys in client-side code
- Rate limit API calls
- Cache responses

### Data Privacy

- Property enrichment respects privacy laws
- Only public record data is fetched
- No personal information is stored
- Comply with GDPR/CCPA requirements

## 🐛 Troubleshooting

### Widgets Not Displaying

```typescript
// Check if widgets are in store
const widgets = useJobDetailsLayoutStore((state) => state.widgets);
console.log("Widgets:", widgets);

// Check if widgets are visible
const visibleWidgets = widgets.filter(w => w.isVisible);
console.log("Visible widgets:", visibleWidgets);
```

### Property Enrichment Not Working

```bash
# Check if API keys are set
echo $ATTOM_API_KEY

# Check API response in browser console
# Enable debug mode in property-enrichment.ts
```

### Drag-and-Drop Not Working

```typescript
// Ensure edit mode is enabled
const [isEditMode, setIsEditMode] = useState(true);

// Check if widget is draggable
const widget = useJobDetailsLayoutStore((state) =>
  state.getWidgetById(widgetId)
);
console.log("Is draggable:", widget?.isDraggable);
```

## 🎓 Best Practices

### 1. Widget Design

- **Keep it simple**: Each widget should have a single purpose
- **Mobile-first**: Design for small screens first
- **Consistent styling**: Use the same spacing, fonts, and colors
- **Loading states**: Show skeletons while data loads

### 2. Layout Design

- **Prioritize**: Put most important widgets at the top
- **Group related widgets**: Keep related information together
- **Use whitespace**: Don't cram too many widgets
- **Test on devices**: Check on mobile, tablet, and desktop

### 3. Property Enrichment

- **Cache aggressively**: Property data doesn't change often
- **Handle errors gracefully**: Show fallback UI when API fails
- **Respect rate limits**: Batch requests when possible
- **Show data source**: Let users know where data came from

## 📊 Analytics

Track widget usage to improve the system:

```typescript
// Track which widgets are most used
const widgetUsage = widgets.reduce((acc, widget) => {
  acc[widget.type] = (acc[widget.type] || 0) + 1;
  return acc;
}, {});

// Track which presets are most popular
localStorage.getItem('selected-preset');
```

## 🔮 Future Enhancements

### Planned Features

1. **Widget Resize**: Drag handles to resize widgets
2. **Auto-Layout**: AI-suggested layouts based on job type
3. **Shared Layouts**: Share custom layouts with team
4. **Widget Marketplace**: Community-contributed widgets
5. **Mobile Optimization**: Touch-friendly drag-and-drop
6. **Real-time Updates**: WebSocket-based live updates
7. **Widget Templates**: Pre-built widget combinations
8. **Advanced Analytics**: Usage tracking and recommendations

### Contributing

To add a new widget:

1. Create widget component in `widgets/` directory
2. Add metadata to `WIDGET_METADATA`
3. Register in `widget-renderer.tsx`
4. Add to appropriate industry presets
5. Update documentation

## 📞 Support

For questions or issues:

- Check the [troubleshooting section](#troubleshooting)
- Review example implementations
- Contact development team

## 📝 License

This widget system is part of the Thorbis project and follows the same license.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainers**: Thorbis Development Team
