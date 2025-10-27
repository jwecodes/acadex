import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const facultyId = searchParams.get('facultyId')

    if (!facultyId) {
      return NextResponse.json(
        { success: false, error: 'Faculty ID required' },
        { status: 400 }
      )
    }

    const allocations = await prisma.courseAllocation.findMany({
      where: { facultyId },
      include: {
        course: {
          include: {
            programme: true
          }
        }
      }
    })

    const courses = allocations.map((alloc: any) => ({  // Add type annotation
      courseId: alloc.courseId,
      role: alloc.role,
      courseCode: alloc.course.courseCode,
      courseName: alloc.course.courseName,
      session: alloc.course.session,
      semester: alloc.course.semester,
      credits: alloc.course.credits,
      programme: alloc.course.programme
    }))

    return NextResponse.json({
      success: true,
      courses
    })
  } catch (error) {
    console.error('Courses error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load courses' },
      { status: 500 }
    )
  }
}
