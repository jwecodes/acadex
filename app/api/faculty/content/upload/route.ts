import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const facultyId = request.headers.get('x-faculty-id')

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const contentType = formData.get('contentType') as string
    const courseId = formData.get('courseId') as string
    const fileUrl = formData.get('fileUrl') as string
    const file = formData.get('file') as File

    if (!title || !contentType || !courseId || !fileUrl) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    const assignment = await prisma.courseAllocation.findFirst({
      where: { facultyId, courseId }
    })

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Not assigned' }, { status: 403 })
    }

    const content = await prisma.teachingContent.create({
      data: {
        title,
        description: description || null,
        contentType: contentType as any,
        courseId,
        facultyId,
        filePath: fileUrl,
        fileName: file?.name || 'file',
        fileSize: file?.size || 0,
        mimeType: file?.type || 'application/octet-stream',
        approvalStatus: 'PENDING'
      }
    })

    return NextResponse.json({ success: true, content }, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
