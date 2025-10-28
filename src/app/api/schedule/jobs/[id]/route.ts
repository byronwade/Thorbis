import { NextRequest, NextResponse } from 'next/server'
import type { Job } from '@/components/schedule/schedule-types'

/**
 * Mock Job API
 * GET /api/schedule/jobs/[id] - Get job by ID
 * PUT /api/schedule/jobs/[id] - Update job
 * DELETE /api/schedule/jobs/[id] - Delete job
 */

// In-memory storage (would be replaced with database)
let jobs: Map<string, Job> = new Map()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = jobs.get(id)

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: job,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingJob = jobs.get(id)

    if (!existingJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
        },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Update job
    const updatedJob: Job = {
      ...existingJob,
      ...body,
      id,
      updatedAt: new Date(),
      // Convert date strings to Date objects
      startTime: body.startTime ? new Date(body.startTime) : existingJob.startTime,
      endTime: body.endTime ? new Date(body.endTime) : existingJob.endTime,
    }

    jobs.set(id, updatedJob)

    return NextResponse.json({
      success: true,
      data: updatedJob,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update job',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = jobs.get(id)

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
        },
        { status: 404 }
      )
    }

    jobs.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete job',
      },
      { status: 500 }
    )
  }
}
