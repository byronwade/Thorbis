/**
 * AI-Powered Job Auto-Tagging System
 *
 * Automatically extracts categories, equipment, service types, and priority
 * from job notes without requiring manual tagging by CSRs/owners.
 *
 * This runs server-side and processes job data to make FSM workflow seamless.
 */

export type JobCategory =
  | "HVAC"
  | "Plumbing"
  | "Electrical"
  | "Roofing"
  | "General Contractor"
  | "Appliance Repair"
  | "Other";

export type ServiceType =
  | "emergency"
  | "routine"
  | "preventive"
  | "warranty"
  | "installation";

export type AIJobMetadata = {
  // User-visible (editable)
  generatedTitle: string;
  generatedDescription: string;

  // Behind-the-scenes (for reporting/search)
  categories: JobCategory[];
  equipment: string[];
  serviceType: ServiceType;
  priorityScore: number; // 0-100
  tags: string[];
  processedAt: Date;
};

/**
 * Extract job categories from title and notes
 */
function extractCategories(
  title: string,
  notes?: string | null
): JobCategory[] {
  const text = `${title} ${notes || ""}`.toLowerCase();
  const categories: JobCategory[] = [];

  const categoryKeywords: Record<JobCategory, string[]> = {
    HVAC: [
      "hvac",
      "heating",
      "cooling",
      "furnace",
      "air conditioning",
      "ac unit",
      "boiler",
      "heat pump",
      "ductwork",
      "thermostat",
      "ventilation",
    ],
    Plumbing: [
      "plumbing",
      "pipe",
      "leak",
      "drain",
      "water heater",
      "faucet",
      "toilet",
      "sink",
      "sewer",
      "water line",
      "sump pump",
      "backflow",
    ],
    Electrical: [
      "electrical",
      "wiring",
      "circuit",
      "breaker",
      "panel",
      "outlet",
      "lighting",
      "generator",
      "voltage",
      "amperage",
    ],
    Roofing: ["roof", "shingle", "gutter", "flashing", "skylight", "chimney"],
    "General Contractor": [
      "remodel",
      "renovation",
      "construction",
      "drywall",
      "flooring",
      "painting",
    ],
    "Appliance Repair": [
      "appliance",
      "refrigerator",
      "dishwasher",
      "washer",
      "dryer",
      "oven",
      "stove",
    ],
    Other: [],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === "Other") continue;

    const hasMatch = keywords.some((keyword) => text.includes(keyword));
    if (hasMatch) {
      categories.push(category as JobCategory);
    }
  }

  return categories.length > 0 ? categories : ["Other"];
}

/**
 * Extract equipment from title and notes
 */
function extractEquipment(title: string, notes?: string | null): string[] {
  const text = `${title} ${notes || ""}`.toLowerCase();
  const equipment: string[] = [];

  const equipmentKeywords = [
    "furnace",
    "boiler",
    "water heater",
    "ac unit",
    "heat pump",
    "thermostat",
    "sump pump",
    "generator",
    "electrical panel",
    "circuit breaker",
    "water softener",
    "backflow preventer",
    "exhaust fan",
    "ductwork",
    "piping",
    "wiring",
  ];

  for (const keyword of equipmentKeywords) {
    if (text.includes(keyword)) {
      // Capitalize first letter of each word
      const formatted = keyword
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      equipment.push(formatted);
    }
  }

  return [...new Set(equipment)]; // Remove duplicates
}

/**
 * Detect service type from notes
 */
function detectServiceType(title: string, notes?: string | null): ServiceType {
  const text = `${title} ${notes || ""}`.toLowerCase();

  // Emergency indicators (highest priority)
  if (
    text.includes("emergency") ||
    text.includes("urgent") ||
    text.includes("leak") ||
    text.includes("no heat") ||
    text.includes("no cooling") ||
    text.includes("power outage")
  ) {
    return "emergency";
  }

  // Installation indicators
  if (
    text.includes("install") ||
    text.includes("installation") ||
    text.includes("new system") ||
    text.includes("replacement")
  ) {
    return "installation";
  }

  // Preventive/maintenance indicators
  if (
    text.includes("maintenance") ||
    text.includes("inspection") ||
    text.includes("annual") ||
    text.includes("quarterly") ||
    text.includes("tune-up")
  ) {
    return "preventive";
  }

  // Warranty indicators
  if (text.includes("warranty") || text.includes("under warranty")) {
    return "warranty";
  }

  // Default to routine
  return "routine";
}

/**
 * Calculate AI priority score (0-100)
 */
function calculatePriorityScore(
  title: string,
  notes: string | null | undefined,
  jobType: string | null | undefined,
  priority: string
): number {
  let score = 50; // Base score

  const text = `${title} ${notes || ""}`.toLowerCase();

  // Emergency keywords (+30)
  if (
    text.includes("emergency") ||
    text.includes("urgent") ||
    text.includes("critical")
  ) {
    score += 30;
  }

  // Leak/water damage keywords (+20)
  if (
    text.includes("leak") ||
    text.includes("flooding") ||
    text.includes("water damage")
  ) {
    score += 20;
  }

  // No service keywords (+20)
  if (
    text.includes("no heat") ||
    text.includes("no cooling") ||
    text.includes("no power")
  ) {
    score += 20;
  }

  // Safety keywords (+15)
  if (
    text.includes("safety") ||
    text.includes("hazard") ||
    text.includes("gas leak")
  ) {
    score += 15;
  }

  // Commercial property (+10)
  if (
    text.includes("commercial") ||
    text.includes("business") ||
    text.includes("office")
  ) {
    score += 10;
  }

  // Manual priority adjustment
  if (priority === "urgent") {
    score += 20;
  } else if (priority === "high") {
    score += 10;
  } else if (priority === "low") {
    score -= 10;
  }

  // Job type adjustment
  if (jobType === "repair") {
    score += 5;
  } else if (jobType === "maintenance") {
    score -= 5;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Generate searchable tags
 */
function generateTags(
  title: string,
  notes: string | null | undefined,
  categories: JobCategory[],
  equipment: string[]
): string[] {
  const text = `${title} ${notes || ""}`.toLowerCase();
  const tags: string[] = [];

  // Add category tags
  tags.push(...categories);

  // Add equipment tags
  tags.push(...equipment);

  // Add common action tags
  const actionKeywords = [
    "repair",
    "install",
    "replace",
    "inspect",
    "maintain",
    "clean",
    "upgrade",
    "service",
  ];

  for (const action of actionKeywords) {
    if (text.includes(action)) {
      tags.push(action);
    }
  }

  // Add property type tags
  if (text.includes("commercial")) tags.push("commercial");
  if (text.includes("residential")) tags.push("residential");
  if (text.includes("industrial")) tags.push("industrial");

  return [...new Set(tags.map((tag) => tag.toLowerCase()))]; // Unique, lowercase
}

/**
 * Generate a clean, readable job title from notes
 */
function generateTitle(
  customerName: string,
  notes: string | null | undefined,
  jobType: string | null | undefined
): string {
  const categories = extractCategories("", notes);
  const equipment = extractEquipment("", notes);

  // Build title: Customer - [Equipment/Category] [JobType]
  const titleParts: string[] = [];

  if (equipment.length > 0) {
    titleParts.push(equipment[0]); // "Furnace"
  } else if (categories.length > 0 && categories[0] !== "Other") {
    titleParts.push(categories[0]); // "HVAC"
  }

  if (jobType) {
    const typeMap: Record<string, string> = {
      installation: "Installation",
      repair: "Repair",
      maintenance: "Maintenance",
      service: "Service",
    };
    titleParts.push(typeMap[jobType] || jobType);
  }

  const suffix = titleParts.length > 0 ? titleParts.join(" ") : "Service";
  return `${customerName} - ${suffix}`;
}

/**
 * Generate a brief description from notes (first 100 chars)
 */
function generateDescription(notes: string | null | undefined): string {
  if (!notes) return "";

  // Clean up notes and take first sentence or 100 chars
  const cleaned = notes.trim();
  const firstSentence = cleaned.split(/[.!?]/)[0];

  if (firstSentence && firstSentence.length <= 100) {
    return firstSentence;
  }

  return cleaned.substring(0, 100) + (cleaned.length > 100 ? "..." : "");
}

/**
 * Main auto-tagging function
 * Call this when a job is created or updated
 *
 * Generates clean title/description (user-visible)
 * Tags everything in background (for reporting)
 */
export function autoTagJob(job: {
  customerName: string;
  title?: string;
  description?: string | null;
  notes?: string | null;
  jobType?: string | null;
  priority: string;
}): AIJobMetadata {
  const categories = extractCategories(job.title || "", job.notes);
  const equipment = extractEquipment(job.title || "", job.notes);
  const serviceType = detectServiceType(job.title || "", job.notes);
  const priorityScore = calculatePriorityScore(
    job.title || "",
    job.notes,
    job.jobType,
    job.priority
  );
  const tags = generateTags(job.title || "", job.notes, categories, equipment);

  // Generate clean, readable title and description
  const generatedTitle = generateTitle(
    job.customerName,
    job.notes,
    job.jobType
  );
  const generatedDescription = generateDescription(job.notes);

  return {
    generatedTitle,
    generatedDescription,
    categories,
    equipment,
    serviceType,
    priorityScore,
    tags,
    processedAt: new Date(),
  };
}

/**
 * Format AI categories for display
 */
export function formatCategories(categories: JobCategory[]): string {
  return categories.join(", ");
}

/**
 * Format AI equipment for display
 */
export function formatEquipment(equipment: string[]): string {
  return equipment.join(", ");
}

/**
 * Get priority badge color based on AI score
 */
export function getPriorityColor(score: number): string {
  if (score >= 80) return "red"; // Critical
  if (score >= 60) return "orange"; // High
  if (score >= 40) return "yellow"; // Medium
  return "blue"; // Low
}
