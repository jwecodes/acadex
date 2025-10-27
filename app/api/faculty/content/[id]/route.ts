import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id

    // Get content details
    const content = await prisma.teachingContent.findUnique({
      where: { id: contentId }
    })

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      )
    }

    // Only allow deletion if status is PENDING
    if (content.approvalStatus !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Only pending content can be deleted' },
        { status: 403 }
      )
    }

    // Delete from Supabase storage
    // Extract file path from public URL
    const urlParts = content.filePath.split('/teaching-materials/')
    if (urlParts.length > 1) {
      const filePath = urlParts[1]
      await supabase.storage
        .from('teaching-materials')
        .remove([filePath])
    }

    // Delete from database
    await prisma.teachingContent.delete({
      where: { id: contentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
