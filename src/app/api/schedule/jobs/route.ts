import { NextRequest, NextResponse } from 'next/server'
import type { Job } from '@/components/schedule/schedule-types'

/**
 * Mock Jobs API
 * GET /api/schedule/jobs - Get jobs
 * POST /api/schedule/jobs - Create job
 */

// In-memory storage (would be replaced with database)
let jobs: Job[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const technicianId = searchParams.get('technicianId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let filteredJobs = [...jobs]

    // Filter by technician
    if (technicianId) {
      filteredJobs = filteredJobs.filter((job) => job.technicianId === technicianId)
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      filteredJobs = filteredJobs.filter(
        (job) => job.startTime >= start && job.endTime <= end
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredJobs,
      count: filteredJobs.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.technicianId || !body.title || !body.startTime || !body.endTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // Create new job
    const newJob: Job = {
      ...body,
      id: `j${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    jobs.push(newJob)

    return NextResponse.json(
      {
        success: true,
        data: newJob,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create job',
      },
      { status: 500 }
    )
  }
}
