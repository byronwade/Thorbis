export type WidgetType =
  | "leaderboard"
  | "company-goals"
  | "top-performer"
  | "revenue-chart"
  | "jobs-completed"
  | "avg-ticket"
  | "customer-rating"
  | "daily-stats"
  | "weekly-stats"
  | "monthly-stats";

export type WidgetSize = "1x1" | "2x2" | "3x3" | "full" | "small" | "medium" | "large";

export type Widget = {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  position: number;
  slideId?: string; // Optional: manual slide assignment
};

export type WidgetConfig = {
  type: WidgetType;
  title: string;
  description: string;
  defaultSize: WidgetSize;
  minSize: WidgetSize;
  maxSize: WidgetSize;
};

export const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  leaderboard: {
    type: "leaderboard",
    title: "Leaderboard Table",
    description: "Full technician rankings with stats",
    defaultSize: "large",
    minSize: "medium",
    maxSize: "full",
  },
  "company-goals": {
    type: "company-goals",
    title: "Company Goals",
    description: "Progress towards company targets",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
  "top-performer": {
    type: "top-performer",
    title: "Top Performer",
    description: "Highlight the #1 technician",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
  "revenue-chart": {
    type: "revenue-chart",
    title: "Revenue Trend",
    description: "Revenue over time chart",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
  "jobs-completed": {
    type: "jobs-completed",
    title: "Jobs Completed",
    description: "Total jobs completed metric",
    defaultSize: "small",
    minSize: "small",
    maxSize: "medium",
  },
  "avg-ticket": {
    type: "avg-ticket",
    title: "Average Ticket",
    description: "Average ticket value metric",
    defaultSize: "small",
    minSize: "small",
    maxSize: "medium",
  },
  "customer-rating": {
    type: "customer-rating",
    title: "Customer Rating",
    description: "Average customer rating metric",
    defaultSize: "small",
    minSize: "small",
    maxSize: "medium",
  },
  "daily-stats": {
    type: "daily-stats",
    title: "Daily Stats",
    description: "Today's performance summary",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
  "weekly-stats": {
    type: "weekly-stats",
    title: "Weekly Stats",
    description: "This week's performance summary",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
  "monthly-stats": {
    type: "monthly-stats",
    title: "Monthly Stats",
    description: "This month's performance summary",
    defaultSize: "medium",
    minSize: "small",
    maxSize: "large",
  },
};

export const WIDGET_SIZE_CLASSES: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x2": "col-span-2 row-span-2",
  "3x3": "col-span-3 row-span-3",
  full: "col-span-4 row-span-4",
  // Legacy sizes (mapped to new sizes)
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
};

// Helper function to get widget cell count
export function getWidgetCellCount(size: WidgetSize): number {
  switch (size) {
    case "1x1":
    case "small":
      return 1;
    case "2x2":
      return 4;
    case "medium":
      return 2;
    case "large":
      return 4;
    case "3x3":
      return 9;
    case "full":
      return 16; // Full 4x4 grid
    default:
      return 1;
  }
}
