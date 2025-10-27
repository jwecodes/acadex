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

    // Get faculty's course allocations
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

    // Get content stats
    const [uploadedContent, pendingApproval, approvedContent] = await Promise.all([
      prisma.teachingContent.count({ where: { facultyId } }),
      prisma.teachingContent.count({ where: { facultyId, approvalStatus: 'PENDING' } }),
      prisma.teachingContent.count({ where: { facultyId, approvalStatus: 'APPROVED' } })
    ])

    const courses = allocations.map((alloc: any) => ({  // Add type annotation
      id: alloc.id,
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
      stats: {
        totalCourses: courses.length,
        uploadedContent,
        pendingApproval,
        approvedContent
      },
      courses
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
