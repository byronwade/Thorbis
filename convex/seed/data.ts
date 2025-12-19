/**
 * Seed Data Definitions for Convex
 *
 * Contains sample data for all business entities.
 * Money values are in cents (e.g., $100.00 = 10000)
 */

// ============================================================================
// USERS
// ============================================================================

export const seedUsers = [
  {
    tokenIdentifier: "seed-user-owner-001",
    name: "John Smith",
    email: "john.smith@demo-hvac.com",
    phone: "+15551234567",
    isActive: true,
    emailVerified: true,
  },
  {
    tokenIdentifier: "seed-user-admin-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@demo-hvac.com",
    phone: "+15551234568",
    isActive: true,
    emailVerified: true,
  },
  {
    tokenIdentifier: "seed-user-tech-001",
    name: "Mike Davis",
    email: "mike.davis@demo-hvac.com",
    phone: "+15551234569",
    isActive: true,
    emailVerified: true,
  },
  {
    tokenIdentifier: "seed-user-tech-002",
    name: "Emily Chen",
    email: "emily.chen@demo-hvac.com",
    phone: "+15551234570",
    isActive: true,
    emailVerified: true,
  },
  {
    tokenIdentifier: "seed-user-dispatcher-001",
    name: "Robert Wilson",
    email: "robert.wilson@demo-hvac.com",
    phone: "+15551234571",
    isActive: true,
    emailVerified: true,
  },
];

// ============================================================================
// COMPANY
// ============================================================================

export const seedCompany = {
  name: "Demo HVAC Services",
  slug: "demo-hvac-services",
  email: "info@demo-hvac.com",
  phone: "+15551234567",
  website: "https://demo-hvac.com",
  address: "123 Main Street",
  city: "Austin",
  state: "TX",
  zipCode: "78701",
  country: "USA",
  onboardingCompleted: true,
  settings: {
    timezone: "America/Chicago",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    workHours: {
      start: "08:00",
      end: "18:00",
    },
    notifications: {
      email: true,
      sms: true,
    },
  },
};

// ============================================================================
// TEAM MEMBERS (roles for seed users)
// ============================================================================

export const seedTeamRoles = [
  { userIndex: 0, role: "owner" as const, department: "Management", jobTitle: "Owner" },
  { userIndex: 1, role: "admin" as const, department: "Operations", jobTitle: "Office Manager" },
  { userIndex: 2, role: "technician" as const, department: "Service", jobTitle: "Lead Technician" },
  { userIndex: 3, role: "technician" as const, department: "Service", jobTitle: "HVAC Technician" },
  { userIndex: 4, role: "dispatcher" as const, department: "Operations", jobTitle: "Dispatcher" },
];

// ============================================================================
// CUSTOMERS
// ============================================================================

export const seedCustomers = [
  {
    type: "residential" as const,
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@email.com",
    phone: "+15559876543",
    address: "456 Oak Lane",
    city: "Austin",
    state: "TX",
    zipCode: "78702",
    status: "active" as const,
    tags: ["VIP", "Annual Service"],
    notes: "Prefers morning appointments. Has two dogs.",
    totalRevenue: 450000, // $4,500.00
    source: "Referral",
  },
  {
    type: "residential" as const,
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@email.com",
    phone: "+15559876544",
    address: "789 Elm Street",
    city: "Austin",
    state: "TX",
    zipCode: "78703",
    status: "active" as const,
    tags: ["Service Plan"],
    notes: "Spanish speaking preferred",
    totalRevenue: 280000, // $2,800.00
    source: "Google",
  },
  {
    type: "commercial" as const,
    firstName: "David",
    lastName: "Thompson",
    companyName: "Thompson Restaurant Group",
    email: "david@thompsonrestaurants.com",
    phone: "+15559876545",
    address: "1200 Congress Ave",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    status: "active" as const,
    tags: ["Commercial", "Multi-Unit"],
    notes: "Owns 5 restaurants in downtown area. Urgent response required.",
    totalRevenue: 1250000, // $12,500.00
    source: "Cold Call",
  },
  {
    type: "residential" as const,
    firstName: "Jennifer",
    lastName: "Martinez",
    email: "jen.martinez@email.com",
    phone: "+15559876546",
    address: "321 Pine Road",
    city: "Round Rock",
    state: "TX",
    zipCode: "78664",
    status: "active" as const,
    tags: ["New Customer"],
    notes: "Recently moved to area",
    totalRevenue: 35000, // $350.00
    source: "Website",
  },
  {
    type: "commercial" as const,
    firstName: "Michael",
    lastName: "Brown",
    companyName: "Brown Medical Center",
    email: "mbrown@brownmedical.com",
    phone: "+15559876547",
    address: "5000 Medical Parkway",
    city: "Austin",
    state: "TX",
    zipCode: "78756",
    status: "active" as const,
    tags: ["Commercial", "Medical", "Priority"],
    notes: "24/7 emergency service required. HIPAA compliant work needed.",
    totalRevenue: 3500000, // $35,000.00
    source: "Referral",
  },
  {
    type: "residential" as const,
    firstName: "Susan",
    lastName: "Williams",
    email: "susan.w@email.com",
    phone: "+15559876548",
    address: "890 Sunset Blvd",
    city: "Pflugerville",
    state: "TX",
    zipCode: "78660",
    status: "active" as const,
    tags: ["Service Plan", "Senior Discount"],
    notes: "Elderly customer, needs appointment reminders",
    totalRevenue: 180000, // $1,800.00
    source: "Nextdoor",
  },
  {
    type: "industrial" as const,
    firstName: "Robert",
    lastName: "Taylor",
    companyName: "Taylor Manufacturing",
    email: "rtaylor@taylormfg.com",
    phone: "+15559876549",
    address: "8500 Industrial Blvd",
    city: "Austin",
    state: "TX",
    zipCode: "78744",
    status: "active" as const,
    tags: ["Industrial", "Large Scale"],
    notes: "Manufacturing facility with multiple HVAC units. Weekend work preferred.",
    totalRevenue: 7500000, // $75,000.00
    source: "Trade Show",
  },
  {
    type: "residential" as const,
    firstName: "Linda",
    lastName: "Lee",
    email: "linda.lee@email.com",
    phone: "+15559876550",
    address: "234 Valley View",
    city: "Cedar Park",
    state: "TX",
    zipCode: "78613",
    status: "inactive" as const,
    tags: ["Inactive"],
    notes: "Moved out of service area",
    totalRevenue: 95000, // $950.00
    source: "Yelp",
  },
];

// ============================================================================
// PROPERTIES (for customers)
// ============================================================================

export const seedProperties = [
  // James Anderson - 1 property
  { customerIndex: 0, name: "Main Residence", type: "residential" as const, address: "456 Oak Lane", city: "Austin", state: "TX", zipCode: "78702", isPrimary: true, squareFootage: 2400, yearBuilt: 1995 },

  // Maria Garcia - 1 property
  { customerIndex: 1, name: "Home", type: "residential" as const, address: "789 Elm Street", city: "Austin", state: "TX", zipCode: "78703", isPrimary: true, squareFootage: 1800, yearBuilt: 2010 },

  // Thompson Restaurant Group - 3 properties
  { customerIndex: 2, name: "Downtown Location", type: "commercial" as const, address: "1200 Congress Ave", city: "Austin", state: "TX", zipCode: "78701", isPrimary: true, squareFootage: 4500, yearBuilt: 2015 },
  { customerIndex: 2, name: "East Side Location", type: "commercial" as const, address: "2500 E 7th St", city: "Austin", state: "TX", zipCode: "78702", isPrimary: false, squareFootage: 3200, yearBuilt: 2018 },
  { customerIndex: 2, name: "South Congress Location", type: "commercial" as const, address: "1800 S Congress", city: "Austin", state: "TX", zipCode: "78704", isPrimary: false, squareFootage: 3800, yearBuilt: 2020 },

  // Jennifer Martinez - 1 property
  { customerIndex: 3, name: "Home", type: "residential" as const, address: "321 Pine Road", city: "Round Rock", state: "TX", zipCode: "78664", isPrimary: true, squareFootage: 2100, yearBuilt: 2022 },

  // Brown Medical Center - 2 properties
  { customerIndex: 4, name: "Main Building", type: "commercial" as const, address: "5000 Medical Parkway", city: "Austin", state: "TX", zipCode: "78756", isPrimary: true, squareFootage: 45000, yearBuilt: 2008 },
  { customerIndex: 4, name: "Outpatient Center", type: "commercial" as const, address: "5050 Medical Parkway", city: "Austin", state: "TX", zipCode: "78756", isPrimary: false, squareFootage: 12000, yearBuilt: 2012 },

  // Susan Williams - 1 property
  { customerIndex: 5, name: "Home", type: "residential" as const, address: "890 Sunset Blvd", city: "Pflugerville", state: "TX", zipCode: "78660", isPrimary: true, squareFootage: 1600, yearBuilt: 1985 },

  // Taylor Manufacturing - 1 property
  { customerIndex: 6, name: "Manufacturing Plant", type: "industrial" as const, address: "8500 Industrial Blvd", city: "Austin", state: "TX", zipCode: "78744", isPrimary: true, squareFootage: 150000, yearBuilt: 2000 },
];

// ============================================================================
// EQUIPMENT
// ============================================================================

export const seedEquipment = [
  // James Anderson
  { propertyIndex: 0, name: "Main AC Unit", type: "ac_unit" as const, manufacturer: "Carrier", model: "24ACC636A003", serialNumber: "1234567890", installDate: new Date("2020-06-15").getTime(), condition: "good" as const, status: "active" as const },
  { propertyIndex: 0, name: "Gas Furnace", type: "furnace" as const, manufacturer: "Lennox", model: "SL280UH090V48B", serialNumber: "2345678901", installDate: new Date("2020-06-15").getTime(), condition: "good" as const, status: "active" as const },

  // Maria Garcia
  { propertyIndex: 1, name: "Central AC", type: "ac_unit" as const, manufacturer: "Trane", model: "XR13", serialNumber: "3456789012", installDate: new Date("2018-03-20").getTime(), condition: "fair" as const, status: "active" as const },

  // Thompson Restaurant (Downtown)
  { propertyIndex: 2, name: "Rooftop Unit 1", type: "hvac" as const, manufacturer: "Daikin", model: "DZ18VC0481A", serialNumber: "4567890123", installDate: new Date("2021-08-10").getTime(), condition: "excellent" as const, status: "active" as const },
  { propertyIndex: 2, name: "Rooftop Unit 2", type: "hvac" as const, manufacturer: "Daikin", model: "DZ18VC0481A", serialNumber: "4567890124", installDate: new Date("2021-08-10").getTime(), condition: "excellent" as const, status: "active" as const },
  { propertyIndex: 2, name: "Kitchen Exhaust Hood", type: "other" as const, manufacturer: "CaptiveAire", model: "ND1", serialNumber: "5678901234", installDate: new Date("2015-01-01").getTime(), condition: "good" as const, status: "active" as const },

  // Brown Medical Center
  { propertyIndex: 6, name: "Chiller Unit 1", type: "other" as const, manufacturer: "York", model: "YLAA0155SE", serialNumber: "6789012345", installDate: new Date("2019-04-01").getTime(), condition: "good" as const, status: "active" as const },
  { propertyIndex: 6, name: "Chiller Unit 2", type: "other" as const, manufacturer: "York", model: "YLAA0155SE", serialNumber: "6789012346", installDate: new Date("2019-04-01").getTime(), condition: "good" as const, status: "active" as const },
  { propertyIndex: 6, name: "Air Handler 1", type: "other" as const, manufacturer: "Carrier", model: "39M", serialNumber: "7890123456", installDate: new Date("2019-04-01").getTime(), condition: "good" as const, status: "active" as const },

  // Taylor Manufacturing
  { propertyIndex: 9, name: "Industrial AC 1", type: "ac_unit" as const, manufacturer: "Trane", model: "CGAM", serialNumber: "8901234567", installDate: new Date("2017-09-15").getTime(), condition: "fair" as const, status: "active" as const },
  { propertyIndex: 9, name: "Industrial AC 2", type: "ac_unit" as const, manufacturer: "Trane", model: "CGAM", serialNumber: "8901234568", installDate: new Date("2017-09-15").getTime(), condition: "good" as const, status: "active" as const },
];

// ============================================================================
// PRICE BOOK ITEMS
// ============================================================================

export const seedPriceBookItems = [
  // Services
  { sku: "SVC-TUNE-AC", name: "AC Tune-Up", type: "service" as const, category: "Maintenance", unitPrice: 12900, costPrice: 4500, laborHours: 1.5, taxable: true },
  { sku: "SVC-TUNE-FURN", name: "Furnace Tune-Up", type: "service" as const, category: "Maintenance", unitPrice: 12900, costPrice: 4500, laborHours: 1.5, taxable: true },
  { sku: "SVC-DIAG", name: "Diagnostic Fee", type: "service" as const, category: "Service", unitPrice: 8900, costPrice: 2500, laborHours: 0.5, taxable: true },
  { sku: "SVC-EMERG", name: "Emergency Service Call", type: "service" as const, category: "Service", unitPrice: 19900, costPrice: 7500, laborHours: 1, taxable: true },
  { sku: "SVC-DUCT-CLEAN", name: "Duct Cleaning", type: "service" as const, category: "Maintenance", unitPrice: 39900, costPrice: 15000, laborHours: 4, taxable: true },
  { sku: "SVC-REFRIG", name: "Refrigerant Recharge", type: "service" as const, category: "Service", unitPrice: 25000, costPrice: 12000, laborHours: 1, taxable: true },

  // Labor
  { sku: "LAB-HOUR", name: "Standard Labor Hour", type: "labor" as const, category: "Labor", unitPrice: 12500, costPrice: 5000, laborHours: 1, taxable: true },
  { sku: "LAB-HOUR-OT", name: "Overtime Labor Hour", type: "labor" as const, category: "Labor", unitPrice: 18750, costPrice: 7500, laborHours: 1, taxable: true },
  { sku: "LAB-HOUR-EMERG", name: "Emergency Labor Hour", type: "labor" as const, category: "Labor", unitPrice: 22500, costPrice: 9000, laborHours: 1, taxable: true },

  // Materials
  { sku: "MAT-FILTER-16X20", name: "Air Filter 16x20x1", type: "material" as const, category: "Filters", unitPrice: 1500, costPrice: 500, taxable: true },
  { sku: "MAT-FILTER-20X20", name: "Air Filter 20x20x1", type: "material" as const, category: "Filters", unitPrice: 1800, costPrice: 600, taxable: true },
  { sku: "MAT-CAPACITOR", name: "Run Capacitor", type: "material" as const, category: "Parts", unitPrice: 8500, costPrice: 3500, taxable: true },
  { sku: "MAT-CONTACTOR", name: "Contactor", type: "material" as const, category: "Parts", unitPrice: 12500, costPrice: 5000, taxable: true },
  { sku: "MAT-THERMOSTAT", name: "Programmable Thermostat", type: "material" as const, category: "Parts", unitPrice: 15000, costPrice: 8000, taxable: true },
  { sku: "MAT-THERMO-SMART", name: "Smart Thermostat", type: "material" as const, category: "Parts", unitPrice: 35000, costPrice: 20000, taxable: true },
  { sku: "MAT-REFRIGERANT", name: "R-410A Refrigerant (lb)", type: "material" as const, category: "Refrigerant", unitPrice: 7500, costPrice: 3500, taxable: true },
  { sku: "MAT-BLOWER-MOTOR", name: "Blower Motor", type: "material" as const, category: "Parts", unitPrice: 45000, costPrice: 25000, taxable: true },
  { sku: "MAT-COMPRESSOR", name: "Compressor", type: "material" as const, category: "Parts", unitPrice: 150000, costPrice: 85000, taxable: true },

  // Equipment (full units)
  { sku: "EQUIP-AC-3TON", name: "3-Ton AC Unit Installation", type: "equipment" as const, category: "Equipment", unitPrice: 650000, costPrice: 400000, laborHours: 8, taxable: true },
  { sku: "EQUIP-AC-4TON", name: "4-Ton AC Unit Installation", type: "equipment" as const, category: "Equipment", unitPrice: 750000, costPrice: 475000, laborHours: 10, taxable: true },
  { sku: "EQUIP-FURNACE", name: "Gas Furnace Installation", type: "equipment" as const, category: "Equipment", unitPrice: 450000, costPrice: 280000, laborHours: 8, taxable: true },
  { sku: "EQUIP-HEATPUMP", name: "Heat Pump Installation", type: "equipment" as const, category: "Equipment", unitPrice: 850000, costPrice: 550000, laborHours: 12, taxable: true },
];

// ============================================================================
// VENDORS
// ============================================================================

export const seedVendors = [
  {
    name: "HVAC Supply Co",
    displayName: "HVAC Supply Co",
    vendorNumber: "VND-001",
    email: "orders@hvacsupply.com",
    phone: "+15551112222",
    address: "100 Warehouse Way",
    city: "Austin",
    state: "TX",
    zipCode: "78748",
    paymentTerms: "net_30" as const,
    category: "supplier" as const,
    status: "active" as const,
  },
  {
    name: "Carrier Distributors",
    displayName: "Carrier Distributors",
    vendorNumber: "VND-002",
    email: "sales@carrierdist.com",
    phone: "+15551112223",
    address: "200 Equipment Blvd",
    city: "San Antonio",
    state: "TX",
    zipCode: "78229",
    paymentTerms: "net_30" as const,
    category: "distributor" as const,
    status: "active" as const,
  },
  {
    name: "Lennox Wholesale",
    displayName: "Lennox Wholesale",
    vendorNumber: "VND-003",
    email: "wholesale@lennox.com",
    phone: "+15551112224",
    address: "300 Industrial Park",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    paymentTerms: "net_60" as const,
    category: "manufacturer" as const,
    status: "active" as const,
  },
  {
    name: "Filter Depot",
    displayName: "Filter Depot",
    vendorNumber: "VND-004",
    email: "orders@filterdepot.com",
    phone: "+15551112225",
    address: "50 Filter Lane",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    paymentTerms: "net_15" as const,
    category: "supplier" as const,
    status: "active" as const,
  },
];

// ============================================================================
// JOBS
// ============================================================================

export const seedJobs = [
  // Completed jobs
  {
    customerIndex: 0,
    propertyIndex: 0,
    technicianIndex: 2, // Mike Davis
    jobNumber: "JOB-2024-0001",
    title: "AC Tune-Up",
    description: "Annual maintenance service for central AC unit",
    status: "completed" as const,
    priority: "medium" as const,
    jobType: "maintenance" as const,
    scheduledStart: new Date("2024-03-15T09:00:00").getTime(),
    scheduledEnd: new Date("2024-03-15T11:00:00").getTime(),
    actualStart: new Date("2024-03-15T09:15:00").getTime(),
    actualEnd: new Date("2024-03-15T10:45:00").getTime(),
    totalAmount: 12900,
  },
  {
    customerIndex: 1,
    propertyIndex: 1,
    technicianIndex: 3, // Emily Chen
    jobNumber: "JOB-2024-0002",
    title: "Thermostat Replacement",
    description: "Replace old thermostat with smart thermostat",
    status: "completed" as const,
    priority: "low" as const,
    jobType: "repair" as const,
    scheduledStart: new Date("2024-03-16T14:00:00").getTime(),
    scheduledEnd: new Date("2024-03-16T15:30:00").getTime(),
    actualStart: new Date("2024-03-16T14:05:00").getTime(),
    actualEnd: new Date("2024-03-16T15:20:00").getTime(),
    totalAmount: 47500,
  },
  {
    customerIndex: 2,
    propertyIndex: 2,
    technicianIndex: 2,
    jobNumber: "JOB-2024-0003",
    title: "Emergency AC Repair",
    description: "AC not cooling - restaurant kitchen overheating",
    status: "completed" as const,
    priority: "urgent" as const,
    jobType: "emergency" as const,
    scheduledStart: new Date("2024-03-17T08:00:00").getTime(),
    scheduledEnd: new Date("2024-03-17T12:00:00").getTime(),
    actualStart: new Date("2024-03-17T07:45:00").getTime(),
    actualEnd: new Date("2024-03-17T10:30:00").getTime(),
    totalAmount: 85000,
  },

  // In progress jobs
  {
    customerIndex: 4,
    propertyIndex: 6,
    technicianIndex: 2,
    jobNumber: "JOB-2024-0010",
    title: "Quarterly Maintenance - Main Building",
    description: "Quarterly HVAC maintenance for medical center",
    status: "in_progress" as const,
    priority: "high" as const,
    jobType: "maintenance" as const,
    scheduledStart: new Date().getTime(),
    scheduledEnd: new Date(Date.now() + 4 * 60 * 60 * 1000).getTime(),
    actualStart: Date.now() - 60 * 60 * 1000,
    totalAmount: 250000,
  },

  // Scheduled jobs (future)
  {
    customerIndex: 5,
    propertyIndex: 8,
    technicianIndex: 3,
    jobNumber: "JOB-2024-0015",
    title: "AC Inspection",
    description: "Pre-summer AC inspection and tune-up",
    status: "scheduled" as const,
    priority: "medium" as const,
    jobType: "maintenance" as const,
    scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime(),
    scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).getTime(),
    totalAmount: 12900,
  },
  {
    customerIndex: 6,
    propertyIndex: 9,
    technicianIndex: 2,
    jobNumber: "JOB-2024-0016",
    title: "Industrial AC Service",
    description: "Scheduled maintenance for manufacturing plant HVAC",
    status: "scheduled" as const,
    priority: "medium" as const,
    jobType: "maintenance" as const,
    scheduledStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).getTime(),
    scheduledEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).getTime(),
    totalAmount: 450000,
  },
  {
    customerIndex: 3,
    propertyIndex: 5,
    technicianIndex: 3,
    jobNumber: "JOB-2024-0017",
    title: "New System Installation Quote",
    description: "Site visit for new AC system quote",
    status: "scheduled" as const,
    priority: "low" as const,
    jobType: "consultation" as const,
    scheduledStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
    scheduledEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).getTime(),
    totalAmount: 0,
  },
];

// ============================================================================
// ESTIMATES
// ============================================================================

export const seedEstimates = [
  {
    customerIndex: 0,
    propertyIndex: 0,
    estimateNumber: "EST-2024-0001",
    title: "AC System Replacement",
    description: "Full AC system replacement with high-efficiency unit",
    status: "sent" as const,
    lineItems: [
      { name: "4-Ton AC Unit", quantity: 1, unitPrice: 750000, total: 750000 },
      { name: "Installation Labor", quantity: 10, unitPrice: 12500, total: 125000 },
      { name: "Ductwork Modification", quantity: 1, unitPrice: 150000, total: 150000 },
    ],
    subtotal: 1025000,
    taxRate: 8.25,
    taxAmount: 84563,
    discountAmount: 0,
    totalAmount: 1109563,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime(),
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).getTime(),
  },
  {
    customerIndex: 3,
    propertyIndex: 5,
    estimateNumber: "EST-2024-0002",
    title: "New Home HVAC System",
    description: "Complete HVAC installation for new construction",
    status: "draft" as const,
    lineItems: [
      { name: "3-Ton AC Unit", quantity: 1, unitPrice: 650000, total: 650000 },
      { name: "Gas Furnace", quantity: 1, unitPrice: 450000, total: 450000 },
      { name: "Smart Thermostat", quantity: 1, unitPrice: 35000, total: 35000 },
      { name: "Installation Labor", quantity: 16, unitPrice: 12500, total: 200000 },
    ],
    subtotal: 1335000,
    taxRate: 8.25,
    taxAmount: 110138,
    discountAmount: 50000,
    totalAmount: 1395138,
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).getTime(),
  },
  {
    customerIndex: 6,
    propertyIndex: 9,
    estimateNumber: "EST-2024-0003",
    title: "Industrial HVAC Upgrade",
    description: "Upgrade manufacturing plant HVAC systems",
    status: "accepted" as const,
    lineItems: [
      { name: "Industrial AC Units", quantity: 2, unitPrice: 1500000, total: 3000000 },
      { name: "Air Handlers", quantity: 4, unitPrice: 250000, total: 1000000 },
      { name: "Controls System", quantity: 1, unitPrice: 500000, total: 500000 },
      { name: "Installation Labor", quantity: 80, unitPrice: 12500, total: 1000000 },
    ],
    subtotal: 5500000,
    taxRate: 8.25,
    taxAmount: 453750,
    discountAmount: 250000,
    totalAmount: 5703750,
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).getTime(),
    sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime(),
    acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).getTime(),
  },
];

// ============================================================================
// INVOICES
// ============================================================================

export const seedInvoices = [
  {
    customerIndex: 0,
    propertyIndex: 0,
    jobIndex: 0,
    invoiceNumber: "INV-2024-0001",
    title: "AC Tune-Up Service",
    status: "paid" as const,
    lineItems: [
      { name: "AC Tune-Up", quantity: 1, unitPrice: 12900, total: 12900 },
    ],
    subtotal: 12900,
    taxRate: 8.25,
    taxAmount: 1064,
    discountAmount: 0,
    totalAmount: 13964,
    amountPaid: 13964,
    amountDue: 0,
    dueDate: new Date("2024-04-01").getTime(),
    paidAt: new Date("2024-03-20").getTime(),
  },
  {
    customerIndex: 1,
    propertyIndex: 1,
    jobIndex: 1,
    invoiceNumber: "INV-2024-0002",
    title: "Thermostat Installation",
    status: "paid" as const,
    lineItems: [
      { name: "Smart Thermostat", quantity: 1, unitPrice: 35000, total: 35000 },
      { name: "Installation Labor", quantity: 1, unitPrice: 12500, total: 12500 },
    ],
    subtotal: 47500,
    taxRate: 8.25,
    taxAmount: 3919,
    discountAmount: 0,
    totalAmount: 51419,
    amountPaid: 51419,
    amountDue: 0,
    dueDate: new Date("2024-04-01").getTime(),
    paidAt: new Date("2024-03-18").getTime(),
  },
  {
    customerIndex: 2,
    propertyIndex: 2,
    jobIndex: 2,
    invoiceNumber: "INV-2024-0003",
    title: "Emergency AC Repair",
    status: "sent" as const,
    lineItems: [
      { name: "Emergency Service Call", quantity: 1, unitPrice: 19900, total: 19900 },
      { name: "Contactor Replacement", quantity: 1, unitPrice: 12500, total: 12500 },
      { name: "Capacitor Replacement", quantity: 1, unitPrice: 8500, total: 8500 },
      { name: "Labor", quantity: 2.5, unitPrice: 22500, total: 56250 },
    ],
    subtotal: 97150,
    taxRate: 8.25,
    taxAmount: 8015,
    discountAmount: 0,
    totalAmount: 105165,
    amountPaid: 0,
    amountDue: 105165,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime(),
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).getTime(),
  },
  {
    customerIndex: 4,
    propertyIndex: 6,
    invoiceNumber: "INV-2024-0004",
    title: "Q1 Maintenance Contract",
    status: "partial" as const,
    lineItems: [
      { name: "Quarterly Maintenance - Main Building", quantity: 1, unitPrice: 250000, total: 250000 },
      { name: "Quarterly Maintenance - Outpatient", quantity: 1, unitPrice: 75000, total: 75000 },
    ],
    subtotal: 325000,
    taxRate: 8.25,
    taxAmount: 26813,
    discountAmount: 0,
    totalAmount: 351813,
    amountPaid: 175000,
    amountDue: 176813,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime(),
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
  },
  {
    customerIndex: 5,
    propertyIndex: 8,
    invoiceNumber: "INV-2024-0005",
    title: "Furnace Repair",
    status: "overdue" as const,
    lineItems: [
      { name: "Diagnostic Fee", quantity: 1, unitPrice: 8900, total: 8900 },
      { name: "Blower Motor", quantity: 1, unitPrice: 45000, total: 45000 },
      { name: "Labor", quantity: 2, unitPrice: 12500, total: 25000 },
    ],
    subtotal: 78900,
    taxRate: 8.25,
    taxAmount: 6509,
    discountAmount: 5000,
    totalAmount: 80409,
    amountPaid: 0,
    amountDue: 80409,
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime(),
    sentAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).getTime(),
  },
];

// ============================================================================
// PAYMENTS
// ============================================================================

export const seedPayments = [
  {
    customerIndex: 0,
    invoiceIndex: 0,
    paymentNumber: "PAY-2024-0001",
    amount: 13964,
    paymentMethod: "credit_card" as const,
    paymentType: "payment" as const,
    cardBrand: "visa" as const,
    cardLast4: "4242",
    status: "completed" as const,
    receiptEmailed: true,
    isReconciled: true,
    processedAt: new Date("2024-03-20T10:30:00").getTime(),
    completedAt: new Date("2024-03-20T10:30:05").getTime(),
  },
  {
    customerIndex: 1,
    invoiceIndex: 1,
    paymentNumber: "PAY-2024-0002",
    amount: 51419,
    paymentMethod: "credit_card" as const,
    paymentType: "payment" as const,
    cardBrand: "mastercard" as const,
    cardLast4: "5555",
    status: "completed" as const,
    receiptEmailed: true,
    isReconciled: true,
    processedAt: new Date("2024-03-18T14:15:00").getTime(),
    completedAt: new Date("2024-03-18T14:15:03").getTime(),
  },
  {
    customerIndex: 4,
    invoiceIndex: 3,
    paymentNumber: "PAY-2024-0003",
    amount: 175000,
    paymentMethod: "ach" as const,
    paymentType: "payment" as const,
    status: "completed" as const,
    bankName: "Chase Bank",
    receiptEmailed: true,
    isReconciled: false,
    processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).getTime(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 5000).getTime(),
  },
];

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export const seedPurchaseOrders = [
  {
    vendorIndex: 0,
    poNumber: "PO-2024-0001",
    title: "Monthly Parts Order",
    status: "received" as const,
    priority: "medium" as const,
    lineItems: [
      { name: "Air Filter 16x20x1", quantity: 50, unitPrice: 500, total: 25000 },
      { name: "Air Filter 20x20x1", quantity: 30, unitPrice: 600, total: 18000 },
      { name: "Run Capacitor", quantity: 10, unitPrice: 3500, total: 35000 },
      { name: "Contactor", quantity: 5, unitPrice: 5000, total: 25000 },
    ],
    subtotal: 103000,
    taxAmount: 8498,
    shippingAmount: 0,
    totalAmount: 111498,
    expectedDelivery: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime(),
    actualDelivery: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).getTime(),
    orderedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).getTime(),
    receivedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).getTime(),
    autoGenerated: false,
  },
  {
    vendorIndex: 1,
    poNumber: "PO-2024-0002",
    title: "Equipment for Taylor Mfg Project",
    status: "ordered" as const,
    priority: "high" as const,
    lineItems: [
      { name: "Industrial AC Unit", quantity: 2, unitPrice: 85000000, total: 170000000 },
      { name: "Air Handler", quantity: 4, unitPrice: 15000000, total: 60000000 },
    ],
    subtotal: 230000000,
    taxAmount: 18975000,
    shippingAmount: 500000,
    totalAmount: 249475000,
    expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).getTime(),
    orderedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).getTime(),
    autoGenerated: false,
  },
  {
    vendorIndex: 3,
    poNumber: "PO-2024-0003",
    title: "Filter Restock",
    status: "pending_approval" as const,
    priority: "low" as const,
    lineItems: [
      { name: "Air Filter 16x20x1", quantity: 100, unitPrice: 500, total: 50000 },
      { name: "Air Filter 20x20x1", quantity: 100, unitPrice: 600, total: 60000 },
      { name: "Air Filter 20x25x1", quantity: 50, unitPrice: 700, total: 35000 },
    ],
    subtotal: 145000,
    taxAmount: 11963,
    shippingAmount: 0,
    totalAmount: 156963,
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
    autoGenerated: true,
  },
];
