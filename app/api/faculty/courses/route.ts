import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const facultyId = request.headers.get('x-faculty-id')

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const assignments = await prisma.courseAllocation.findMany({
      where: { facultyId },
      include: {
        course: {
          include: {
            programme: {
              select: {
                id: true,
                programmeCode: true,
                programmeName: true,
                section: true
              }
            }
          }
        }
      },
      orderBy: {
        course: { courseCode: 'asc' }
      }
    })

    const contentStats = await prisma.teachingContent.groupBy({
      by: ['approvalStatus'],
      where: { facultyId },
      _count: true
    })

    const contentSubmitted = contentStats.reduce((acc, item) => acc + item._count, 0)
    const pendingApproval = contentStats.find(c => c.approvalStatus === 'PENDING')?._count || 0
    const approved = contentStats.find(c => c.approvalStatus === 'APPROVED')?._count || 0

    return NextResponse.json({
      success: true,
      assignments,
      contentSubmitted,
      pendingApproval,
      approved
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
