import type {
  Job,
  Technician,
  Customer,
  Location,
  Address,
  TechnicianSchedule,
  RecurrenceRule,
} from '@/components/schedule/schedule-types'

/**
 * Generate mock schedule data for development and testing
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

function createAddress(street: string, city: string): Address {
  return {
    street,
    city,
    state: 'CA',
    zip: `9${randomInt(1000, 9999)}`,
    country: 'USA',
  }
}

function createLocation(street: string, city: string): Location {
  return {
    address: createAddress(street, city),
    coordinates: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.2,
      lng: -74.006 + (Math.random() - 0.5) * 0.2,
    },
  }
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

export function generateMockCustomers(count: number = 50): Customer[] {
  const companies = [
    'ABC Corp',
    'XYZ Inc',
    'Tech Solutions',
    'Global Systems',
    'Local Business',
    'Manufacturing Co',
    'Retail Store',
    'Healthcare Facility',
    'Office Complex',
    'Restaurant Chain',
    'Office Building',
    'Tech Startup',
    'School District',
    'Factory',
    'Warehouse',
    'New Client',
    'Retail Chain',
    'Shopping Mall',
    'Hospital',
    'Clinic',
    'Data Center',
    'Corporate HQ',
    'Coffee Shop',
  ]

  const streets = [
    '123 Main St',
    '456 Oak Ave',
    '789 Pine Rd',
    '321 Elm St',
    '654 Maple Dr',
    '987 Industrial Pkwy',
    '147 Commerce Blvd',
    '258 Medical Center Dr',
    '369 Corporate Way',
    '741 Restaurant Row',
  ]

  const cities = [
    'San Francisco',
    'Los Angeles',
    'San Diego',
    'Sacramento',
    'Oakland',
    'San Jose',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `customer-${i + 1}`,
    name: randomChoice(companies),
    email: `contact@company${i + 1}.com`,
    phone: `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    company: randomChoice(companies),
    location: createLocation(randomChoice(streets), randomChoice(cities)),
    createdAt: new Date(Date.now() - randomInt(0, 365) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }))
}

export function generateMockTechnicians(count: number = 20): Technician[] {
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Lisa',
    'James',
    'Patricia',
    'Christopher',
    'Jennifer',
    'Thomas',
    'Nicole',
    'Kevin',
    'Amanda',
    'Brian',
    'Rachel',
    'Daniel',
    'Michelle',
  ]

  const lastNames = [
    'Doe',
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Davis',
    'Martinez',
    'Anderson',
    'Wilson',
    'Taylor',
    'Moore',
    'Garcia',
    'Thompson',
    'Lee',
    'Rodriguez',
    'Clark',
    'White',
    'Harris',
    'Young',
  ]

  const roles = ['Senior Technician', 'Field Technician', 'Lead Technician']
  const statuses: Array<'available' | 'on-job' | 'on-break' | 'offline'> = [
    'available',
    'on-job',
    'on-break',
    'offline',
  ]

  const skills = [
    'HVAC Installation',
    'HVAC Repair',
    'System Diagnostics',
    'Preventive Maintenance',
    'Emergency Services',
    'Commercial Systems',
    'Residential Systems',
  ]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]

    const schedule: TechnicianSchedule = {
      availableHours: {
        start: 7, // 7 AM
        end: 19, // 7 PM
      },
      daysOff: [],
      breakTimes: [
        { start: 12 * 60, end: 13 * 60 }, // 12-1 PM lunch
      ],
    }

    return {
      id: `${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      role: randomChoice(roles),
      skills: Array.from({ length: randomInt(2, 4) }, () => randomChoice(skills)),
      status: randomChoice(statuses),
      schedule,
      createdAt: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }
  })
}

export function generateMockJobs(
  technicians: Technician[],
  customers: Customer[],
  options: {
    startDate?: Date
    endDate?: Date
    jobsPerTechnician?: number
    includeRecurring?: boolean
    includeLongTerm?: boolean
  } = {}
): Job[] {
  const {
    startDate = new Date(),
    endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    jobsPerTechnician = 3,
    includeRecurring = true,
    includeLongTerm = true,
  } = options

  const jobTitles = [
    'HVAC Maintenance',
    'Emergency Repair',
    'Installation',
    'System Inspection',
    'Preventive Maintenance',
    'Equipment Replacement',
    'Follow-up Service',
    'Diagnostic Service',
    'Repair Work',
    'Emergency Call',
    'Annual Inspection',
    'System Upgrade',
    'Filter Replacement',
    'Equipment Installation',
    'Maintenance Check',
    'Consultation',
    'Testing',
    'Initial Assessment',
    'Routine Maintenance',
    'Duct Cleaning',
    'System Repair',
  ]

  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = [
    'low',
    'medium',
    'high',
    'urgent',
  ]
  const statuses: Array<'scheduled' | 'in-progress' | 'completed' | 'cancelled'> = [
    'scheduled',
    'in-progress',
    'completed',
    'cancelled',
  ]

  const jobs: Job[] = []
  let jobIdCounter = 1

  technicians.forEach((technician) => {
    for (let i = 0; i < jobsPerTechnician; i++) {
      const customer = randomChoice(customers)

      // Random job duration between 30 minutes and 8 hours
      const durationMinutes = randomInt(30, 480)

      // Create job start time
      const jobStartTime = randomDate(startDate, endDate)

      // Set to working hours
      const hour = randomInt(7, 17) // 7 AM - 5 PM
      const minute = randomChoice([0, 15, 30, 45])
      jobStartTime.setHours(hour, minute, 0, 0)

      const jobEndTime = new Date(jobStartTime.getTime() + durationMinutes * 60 * 1000)

      // Decide on job characteristics
      const isRecurring = includeRecurring && Math.random() > 0.8
      const isLongTerm = includeLongTerm && Math.random() > 0.95

      // Create recurrence rule if recurring
      let recurrence: RecurrenceRule | undefined
      if (isRecurring) {
        const frequencies: RecurrenceRule['frequency'][] = ['daily', 'weekly', 'monthly']
        recurrence = {
          frequency: randomChoice(frequencies),
          interval: randomChoice([1, 2]),
          count: randomInt(5, 20),
        }
      }

      // Adjust duration if long-term project
      let finalEndTime = new Date(jobEndTime)
      if (isLongTerm) {
        // Long-term projects: 1-6 months
        const monthsToAdd = randomInt(1, 6)
        finalEndTime = new Date(jobStartTime)
        finalEndTime.setMonth(finalEndTime.getMonth() + monthsToAdd)
      }

      const job: Job = {
        id: `j${jobIdCounter++}`,
        technicianId: technician.id,
        title: randomChoice(jobTitles),
        description: `Service call for ${customer.name}`,
        customer,
        location: customer.location,
        startTime: jobStartTime,
        endTime: finalEndTime,
        status: randomChoice(statuses),
        priority: randomChoice(priorities),
        recurrence,
        metadata: {
          estimatedDuration: durationMinutes,
        },
        createdAt: new Date(jobStartTime.getTime() - randomInt(1, 7) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }

      jobs.push(job)
    }
  })

  // Add some meetings/events (all-day or short)
  if (Math.random() > 0.7) {
    technicians.slice(0, 3).forEach((technician) => {
      const meetingDate = randomDate(startDate, endDate)
      meetingDate.setHours(9, 0, 0, 0)

      const meeting: Job = {
        id: `j${jobIdCounter++}`,
        technicianId: technician.id,
        title: 'Team Meeting',
        description: 'Weekly team sync',
        customer: {
          id: 'internal',
          name: 'Internal',
          location: createLocation('Head Office', 'San Francisco'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        location: createLocation('Head Office', 'San Francisco'),
        startTime: meetingDate,
        endTime: new Date(meetingDate.getTime() + 60 * 60 * 1000), // 1 hour
        allDay: false,
        status: 'scheduled',
        priority: 'medium',
        metadata: {
          estimatedDuration: 60,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jobs.push(meeting)
    })
  }

  return jobs
}

// ============================================
// MAIN EXPORT
// ============================================

export function generateMockScheduleData(options: {
  technicianCount?: number
  customerCount?: number
  jobsPerTechnician?: number
  startDate?: Date
  endDate?: Date
  includeRecurring?: boolean
  includeLongTerm?: boolean
} = {}) {
  const {
    technicianCount = 20,
    customerCount = 50,
    jobsPerTechnician = 3,
    startDate = new Date(),
    endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    includeRecurring = true,
    includeLongTerm = true,
  } = options

  const customers = generateMockCustomers(customerCount)
  const technicians = generateMockTechnicians(technicianCount)
  const jobs = generateMockJobs(technicians, customers, {
    startDate,
    endDate,
    jobsPerTechnician,
    includeRecurring,
    includeLongTerm,
  })

  return {
    technicians,
    customers,
    jobs,
  }
}
