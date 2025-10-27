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

    const coursesWithStats = await Promise.all(
      allocations.map(async (alloc: any) => {
        const [contentCount, approvedCount, pendingCount] = await Promise.all([
          prisma.teachingContent.count({
            where: { courseId: alloc.courseId, facultyId }
          }),
          prisma.teachingContent.count({
            where: { courseId: alloc.courseId, facultyId, approvalStatus: 'APPROVED' }
          }),
          prisma.teachingContent.count({
            where: { courseId: alloc.courseId, facultyId, approvalStatus: 'PENDING' }
          })
        ])

        return {
          id: alloc.id,
          courseId: alloc.courseId,
          role: alloc.role,
          courseCode: alloc.course.courseCode,
          courseName: alloc.course.courseName,
          session: alloc.course.session,
          semester: alloc.course.semester,
          credits: alloc.course.credits,
          l: alloc.course.l,
          t: alloc.course.t,
          p: alloc.course.p,
          s: alloc.course.s,
          totalHours: alloc.course.totalHours,
          courseType: alloc.course.courseType,
          category: alloc.course.category,
          roomNo: alloc.course.roomNo,
          programme: alloc.course.programme,
          contentCount,
          approvedCount,
          pendingCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      courses: coursesWithStats
    })
  } catch (error) {
    console.error('Courses detailed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load courses' },
      { status: 500 }
    )
  }
}
