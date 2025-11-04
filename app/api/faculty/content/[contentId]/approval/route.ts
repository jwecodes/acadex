import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const facultyId = request.headers.get('x-faculty-id')
    const { status, notes } = await request.json()
    const { contentId } = params

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const content = await prisma.teachingContent.findUnique({
      where: { id: contentId },
      include: { course: true }
    })

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
    }

    const assignment = await prisma.courseAllocation.findFirst({
      where: {
        facultyId,
        courseId: content.courseId,
        role: 'COORDINATOR'
      }
    })

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 })
    }

    const updatedContent = await prisma.teachingContent.update({
      where: { id: contentId },
      data: {
        approvalStatus: status,
        coordinatorNotes: notes || null
      }
    })

    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
