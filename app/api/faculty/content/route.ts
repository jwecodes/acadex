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

    const contents = await prisma.teachingContent.findMany({
      where: { facultyId },
      include: {
        course: {
          include: {
            programme: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      contents
    })
  } catch (error) {
    console.error('Content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load content' },
      { status: 500 }
    )
  }
}
