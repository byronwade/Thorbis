import type {
  Job,
  Technician,
  LegacyJob,
  Customer,
  Location,
  Address,
  TechnicianSchedule,
} from '@/components/schedule/schedule-types'

/**
 * Utilities for schedule management
 */

// ============================================
// CONFLICT DETECTION
// ============================================

export function hasTimeConflict(
  job1Start: Date | string,
  job1End: Date | string,
  job2Start: Date | string,
  job2End: Date | string
): boolean {
  const start1 = job1Start instanceof Date ? job1Start : new Date(job1Start)
  const end1 = job1End instanceof Date ? job1End : new Date(job1End)
  const start2 = job2Start instanceof Date ? job2Start : new Date(job2Start)
  const end2 = job2End instanceof Date ? job2End : new Date(job2End)

  return (
    (start1 >= start2 && start1 < end2) ||
    (end1 > start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  )
}

export function findConflictingJobs(
  jobs: Job[],
  technicianId: string,
  startTime: Date,
  endTime: Date,
  excludeJobId?: string
): Job[] {
  return jobs.filter((job) => {
    if (excludeJobId && job.id === excludeJobId) return false
    if (job.technicianId !== technicianId) return false

    return hasTimeConflict(startTime, endTime, job.startTime, job.endTime)
  })
}

// ============================================
// MIGRATION UTILITIES
// ============================================

export function legacyJobToJob(legacy: LegacyJob, technicianId: string): Job {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Parse time strings
  const [startHour, startMin] = legacy.startTime.split(':').map(Number)
  const [endHour, endMin] = legacy.endTime.split(':').map(Number)

  const startTime = new Date(today)
  startTime.setHours(startHour, startMin, 0, 0)

  const endTime = new Date(today)
  endTime.setHours(endHour, endMin, 0, 0)

  // Create address and location
  const address: Address = {
    street: legacy.address,
    city: '',
    state: '',
    zip: '',
    country: 'USA',
  }

  const location: Location = {
    address,
    coordinates: {
      lat: legacy.lat,
      lng: legacy.lng,
    },
  }

  // Create customer
  const customer: Customer = {
    id: `customer-${legacy.customer.toLowerCase().replace(/\s+/g, '-')}`,
    name: legacy.customer,
    location,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Calculate estimated duration in minutes
  const estimatedDuration = legacy.estimatedDuration
    ? parseFloat(legacy.estimatedDuration.replace(/[^\d.]/g, '')) * 60
    : undefined

  return {
    id: legacy.id,
    technicianId,
    title: legacy.title,
    description: legacy.description,
    customer,
    location,
    startTime,
    endTime,
    status: legacy.status,
    priority: legacy.priority,
    metadata: {
      estimatedDuration,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// ============================================
// TIME CALCULATIONS
// ============================================

export function calculateDuration(startTime: Date | string, endTime: Date | string): number {
  const start = startTime instanceof Date ? startTime : new Date(startTime)
  const end = endTime instanceof Date ? endTime : new Date(endTime)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)) // minutes
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

// ============================================
// WORK HOURS CALCULATIONS
// ============================================

export function calculateWorkload(
  jobs: Job[],
  technicianSchedule: TechnicianSchedule,
  date: Date
): {
  totalMinutes: number
  availableMinutes: number
  utilizationRate: number
} {
  const dayStart = new Date(date)
  dayStart.setHours(technicianSchedule.availableHours.start, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(technicianSchedule.availableHours.end, 0, 0, 0)

  const availableMinutes = calculateDuration(dayStart, dayEnd)

  // Calculate total job duration for this day
  const totalMinutes = jobs.reduce((sum, job) => {
    // Check if job is on this date
    if (
      job.startTime.toDateString() === date.toDateString() ||
      job.endTime.toDateString() === date.toDateString()
    ) {
      return sum + calculateDuration(job.startTime, job.endTime)
    }
    return sum
  }, 0)

  const utilizationRate = availableMinutes > 0 ? (totalMinutes / availableMinutes) * 100 : 0

  return {
    totalMinutes,
    availableMinutes,
    utilizationRate: Math.min(utilizationRate, 100),
  }
}

// ============================================
// DATE UTILITIES
// ============================================

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

// ============================================
// RECURRING JOBS
// ============================================

export function generateRecurringJobInstances(
  baseJob: Job,
  startDate: Date,
  endDate: Date
): Job[] {
  if (!baseJob.recurrence) return [baseJob]

  const instances: Job[] = []
  const { frequency, interval, count, endDate: recurrenceEndDate } = baseJob.recurrence

  let currentDate = new Date(baseJob.startTime)
  let instanceCount = 0

  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      // Calculate job duration
      const duration = calculateDuration(baseJob.startTime, baseJob.endTime)

      // Create new instance
      const instance: Job = {
        ...baseJob,
        id: `${baseJob.id}-instance-${instanceCount}`,
        parentJobId: baseJob.id,
        startTime: new Date(currentDate),
        endTime: addMinutes(new Date(currentDate), duration),
      }

      instances.push(instance)
    }

    // Move to next occurrence
    instanceCount++

    if (count && instanceCount >= count) break
    if (recurrenceEndDate && currentDate >= recurrenceEndDate) break

    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + interval * 7)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval)
        break
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + interval)
        break
    }
  }

  return instances
}

// ============================================
// FILTERING
// ============================================

export function filterJobs(
  jobs: Job[],
  filters: {
    technicianIds?: string[]
    statuses?: Job['status'][]
    priorities?: Job['priority'][]
    searchQuery?: string
  }
): Job[] {
  return jobs.filter((job) => {
    // Filter by technician
    if (filters.technicianIds && filters.technicianIds.length > 0) {
      if (!filters.technicianIds.includes(job.technicianId)) return false
    }

    // Filter by status
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(job.status)) return false
    }

    // Filter by priority
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(job.priority)) return false
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase()
      const matchesTitle = job.title.toLowerCase().includes(query)
      const matchesCustomer = job.customer.name.toLowerCase().includes(query)
      const matchesDescription = job.description?.toLowerCase().includes(query) || false

      if (!matchesTitle && !matchesCustomer && !matchesDescription) return false
    }

    return true
  })
}

// ============================================
// SORTING
// ============================================

export function sortJobsByStartTime(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => {
    // Ensure dates are Date objects
    const aTime = a.startTime instanceof Date ? a.startTime : new Date(a.startTime)
    const bTime = b.startTime instanceof Date ? b.startTime : new Date(b.startTime)
    return aTime.getTime() - bTime.getTime()
  })
}

export function sortTechniciansByName(technicians: Technician[]): Technician[] {
  return [...technicians].sort((a, b) => a.name.localeCompare(b.name))
}

// ============================================
// VALIDATION
// ============================================

export function validateJobTimes(startTime: Date, endTime: Date): {
  valid: boolean
  error?: string
} {
  if (startTime >= endTime) {
    return {
      valid: false,
      error: 'End time must be after start time',
    }
  }

  const duration = calculateDuration(startTime, endTime)
  if (duration < 15) {
    return {
      valid: false,
      error: 'Job must be at least 15 minutes long',
    }
  }

  return { valid: true }
}

export function validateJob(job: Partial<Job>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!job.title || job.title.trim() === '') {
    errors.push('Title is required')
  }

  if (!job.technicianId) {
    errors.push('Technician must be assigned')
  }

  if (!job.startTime) {
    errors.push('Start time is required')
  }

  if (!job.endTime) {
    errors.push('End time is required')
  }

  if (job.startTime && job.endTime) {
    const timeValidation = validateJobTimes(job.startTime, job.endTime)
    if (!timeValidation.valid) {
      errors.push(timeValidation.error!)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
