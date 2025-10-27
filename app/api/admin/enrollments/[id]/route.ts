import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.studentEnrollment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete enrollment error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete enrollment' },
      { status: 500 }
    )
  }
}
